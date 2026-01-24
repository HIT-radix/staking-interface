import { useCallback, useEffect, useMemo, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

import { HEDGE_FUND_SERVER_URL } from "Constants/endpoints";
import { useSelector } from "Store";

type ProtocolPercentage = {
  name: string;
  percentage: number;
};

type ProtocolEntry = {
  name: string;
  value: string;
  original: number;
};

const ProtocolsPercentages = () => {
  const isOwner = useSelector((state) => state.staking.isOwner);

  const [protocols, setProtocols] = useState<ProtocolEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastTxId, setLastTxId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const adminSecret = process.env.REACT_APP_HEDGE_FUND_ADMIN_SECRET ?? "";

  const loadPercentages = useCallback(async () => {
    setFetching(true);
    setApiError(null);
    try {
      const { data } = await axios.get<{ success: boolean; data: ProtocolPercentage[] }>(
        `${HEDGE_FUND_SERVER_URL}/admin/get-protocols-percentages`
      );

      if (!data?.success || !Array.isArray(data.data)) {
        throw new Error("Unexpected response received from server");
      }

      setProtocols(
        data.data.map((item) => ({
          name: item.name,
          value: item.percentage.toString(),
          original: item.percentage,
        }))
      );
      setValidationError(null);
    } catch (error) {
      console.error("Failed to fetch protocol percentages", error);
      setApiError("Unable to load protocol percentages.");
      toast.error("Failed to fetch protocol percentages");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    void loadPercentages();
  }, [loadPercentages]);

  const totalPercentage = useMemo(
    () =>
      protocols.reduce((acc, entry) => {
        const numeric = Number(entry.value);
        return acc + (Number.isFinite(numeric) ? numeric : 0);
      }, 0),
    [protocols]
  );

  const sumDifference = useMemo(() => Math.abs(totalPercentage - 100), [totalPercentage]);

  const isDirty = useMemo(
    () => protocols.some(({ value, original }) => Number(value) !== original),
    [protocols]
  );

  const canUpdate = protocols.length > 0 && isDirty && adminSecret.trim().length > 0 && !loading;

  const handlePercentageChange = (name: string, rawValue: string) => {
    const sanitized = rawValue.replace(/[^0-9.]/g, "");
    const parts = sanitized.split(".");
    const normalized = parts.length <= 1 ? parts[0] : `${parts.shift()}.${parts.join("")}`;

    setValidationError(null);

    setProtocols((prev) =>
      prev.map((entry) =>
        entry.name === name
          ? {
              ...entry,
              value: normalized,
            }
          : entry
      )
    );
  };

  const resetToOriginal = () => {
    setProtocols((prev) =>
      prev.map((entry) => ({
        ...entry,
        value: entry.original.toString(),
      }))
    );
    setLastTxId(null);
    setValidationError(null);
  };

  const handleUpdate = async () => {
    if (!canUpdate) {
      return;
    }

    setValidationError(null);

    const invalidEntry = protocols.find((entry) => {
      if (entry.value.trim() === "") {
        return true;
      }

      const numeric = Number(entry.value);
      return Number.isNaN(numeric) || numeric < 0 || numeric > 100;
    });

    if (invalidEntry) {
      const message = "Each percentage must be a number between 0 and 100.";
      setValidationError(message);
      toast.error(message);
      return;
    }

    if (sumDifference > 0.2) {
      const message = "The total must be within 0.2% of 100 before updating.";
      setValidationError(message);
      toast.error(message);
      return;
    }

    setLoading(true);
    setLastTxId(null);
    setValidationError(null);
    try {
      const payload = protocols.map((entry) => ({
        protocol: entry.name,
        percentage: Number(entry.value),
      }));

      const { data } = await axios.post<{
        success: boolean;
        data?: { txId?: string };
      }>(`${HEDGE_FUND_SERVER_URL}/admin/set-protocols-percentages`, {
        secret: adminSecret.trim(),
        percentages: payload,
      });

      if (!data?.success) {
        throw new Error("Server rejected the update request");
      }

      toast.success("Protocols percentages updated successfully");
      setLastTxId(data.data?.txId ?? null);
      await loadPercentages();
    } catch (error) {
      console.error("Failed to update protocol percentages", error);
      const message =
        (error as AxiosError<{ message?: string }>).response?.data?.message ||
        (error as Error).message ||
        "Unable to update protocol percentages";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOwner) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="text-3xl font-semibold text-accent mb-6">Protocols Percentages</div>

      <div className="bg-base-200/40 border border-base-300 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="space-y-4">
          {fetching ? (
            <div className="text-secondary">Loading protocol percentages…</div>
          ) : apiError ? (
            <div className="text-error">{apiError}</div>
          ) : (
            protocols.map((protocol) => (
              <div
                key={protocol.name}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6"
              >
                <span className="text-secondary font-medium sm:w-1/2">{protocol.name}</span>
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*\\.?[0-9]*"
                  value={protocol.value}
                  onChange={(event) => handlePercentageChange(protocol.name, event.target.value)}
                  className="input bg-base-200 text-accent focus:outline-none focus:ring w-full sm:max-w-xs"
                  placeholder="0"
                />
              </div>
            ))
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className={`text-sm ${validationError ? "text-error" : "text-secondary"}`}>
            Total: {totalPercentage.toFixed(2)}% (Δ {sumDifference.toFixed(2)})
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="btn btn-outline"
              type="button"
              onClick={resetToOriginal}
              disabled={!isDirty || loading || fetching}
            >
              Reset Changes
            </button>
            <button
              className={`btn btn-accent ${loading ? "loading" : ""}`}
              type="button"
              onClick={handleUpdate}
              disabled={!canUpdate || fetching}
            >
              {loading ? "Updating" : "Update Percentages"}
            </button>
          </div>
        </div>
        {validationError ? <div className="text-error text-sm">{validationError}</div> : null}

        {lastTxId ? (
          <div className="text-secondary text-sm">
            Last transaction ID:
            <span className="block font-mono break-all text-accent">{lastTxId}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProtocolsPercentages;
