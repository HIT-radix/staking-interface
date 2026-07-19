import { useCallback, useMemo, useState } from "react";
import { AlertCircle, Database, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

import { useRecoverDistribution, useSnapshots } from "hooks/apis/snapshots";
import { SnapshotState, SnapshotWithAccounts } from "Types/api";
import { useSelector } from "Store";

const PAGE_LIMIT = 10;

type StepStatus = "completed" | "in_progress" | "partial" | "pending";

const STEP_STATUS_LABEL: Record<StepStatus, string> = {
  completed: "Completed",
  in_progress: "In Progress",
  partial: "Partial",
  pending: "Pending",
};

const STEP_STATUS_CLASS: Record<StepStatus, string> = {
  completed: "badge-success",
  in_progress: "badge-info",
  partial: "badge-warning",
  pending: "badge-ghost",
};

const StatusBadge = ({ status }: { status: StepStatus }) => (
  <span className={`badge ${STEP_STATUS_CLASS[status]} badge-sm font-medium`}>
    {STEP_STATUS_LABEL[status]}
  </span>
);

// Order of the snapshot lifecycle used to derive step completion.
const STATE_ORDER: SnapshotState[] = [
  SnapshotState.UNLOCK_STARTED,
  SnapshotState.UNSTAKE_STARTED,
  SnapshotState.UNSTAKED,
  SnapshotState.DISTRIBUTED,
];

const stateReached = (state: SnapshotState, target: SnapshotState) =>
  STATE_ORDER.indexOf(state) >= STATE_ORDER.indexOf(target);

const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

type SnapshotView = {
  snapshot: SnapshotWithAccounts;
  step1: StepStatus;
  step2: StepStatus;
  step3: StepStatus;
  sentCount: number;
  totalAccounts: number;
  canRecover: boolean;
};

const buildView = (snapshot: SnapshotWithAccounts): SnapshotView => {
  const accounts = snapshot.accounts ?? [];
  const totalAccounts = accounts.length;
  const sentCount = accounts.filter((a) => a.fund_units_sent).length;
  const hasPending = totalAccounts > 0 && sentCount < totalAccounts;

  // Step 1 (unlock) is complete once the snapshot exists.
  const step1: StepStatus = "completed";

  // Step 2 (unstake) is complete once the unstake has been started.
  const step2: StepStatus = stateReached(snapshot.state, SnapshotState.UNSTAKE_STARTED)
    ? "completed"
    : "pending";

  // Step 3 (finish unstake + distribute fund units).
  let step3: StepStatus;
  if (snapshot.state === SnapshotState.DISTRIBUTED && !hasPending) {
    step3 = "completed";
  } else if (stateReached(snapshot.state, SnapshotState.UNSTAKED)) {
    // Finish unstake has happened; distribution is either partial or fully pending.
    step3 = sentCount > 0 ? "partial" : "in_progress";
  } else {
    step3 = "pending";
  }

  // Recovery re-runs distribution, which only makes sense once the unstake has
  // finished (state UNSTAKED or later) and some accounts are still pending.
  const canRecover = hasPending && stateReached(snapshot.state, SnapshotState.UNSTAKED);

  return { snapshot, step1, step2, step3, sentCount, totalAccounts, canRecover };
};

const Snapshots = () => {
  const isOwner = useSelector((state) => state.staking.isOwner);
  const [page, setPage] = useState(1);
  const [confirmTarget, setConfirmTarget] = useState<SnapshotWithAccounts | null>(null);

  const { data, isLoading, isFetching, error } = useSnapshots({ page, limit: PAGE_LIMIT });
  const recoverMutation = useRecoverDistribution();

  const views = useMemo<SnapshotView[]>(() => (data?.data ?? []).map(buildView), [data]);

  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  const handleRecover = useCallback(async () => {
    if (!confirmTarget) return;
    const target = confirmTarget;
    try {
      const result = await recoverMutation.mutateAsync({
        date: target.date,
        claimNftId: target.claim_nft_id,
      });
      if (result.success) {
        toast.success(
          `Recovered ${result.distributedCount} account(s). ${result.pendingAfter} still pending.`
        );
      } else {
        toast.error(result.message || "Recovery could not be completed");
      }
    } catch (err) {
      const message =
        (err as AxiosError<{ message?: string }>).response?.data?.message ||
        (err as Error).message ||
        "Failed to recover distribution";
      toast.error(message);
    } finally {
      setConfirmTarget(null);
    }
  }, [confirmTarget, recoverMutation]);

  if (!isOwner) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-accent">Snapshots</h1>
          <p className="text-secondary text-sm mt-1">
            Lifecycle and distribution status of all fund snapshots
          </p>
        </div>
        {isFetching && !isLoading ? (
          <span className="text-secondary text-sm flex items-center gap-2">
            <span className="loading loading-spinner loading-xs"></span>
            Refreshing…
          </span>
        ) : null}
      </div>

      <div className="bg-base-200/40 border border-base-300 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 gap-4">
            <span className="loading loading-spinner loading-lg text-accent"></span>
            <span className="text-accent animate-pulse">Loading snapshots...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-error bg-error/10 flex flex-col items-center">
            <AlertCircle className="h-12 w-12 mb-2" />
            <p className="font-semibold">Failed to load snapshots.</p>
            <p className="text-sm mt-1 opacity-80 text-accent">
              {(error as Error).message || "Unknown error occurred"}
            </p>
          </div>
        ) : views.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-accent">
            <Database className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">No snapshots found</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="table table-zebra w-full whitespace-nowrap">
              <thead className="bg-base-300/50 text-secondary uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="pl-6">Snapshot Date</th>
                  <th>Claim NFT ID</th>
                  <th>Step 1 · Unlock</th>
                  <th>Step 2 · Unstake</th>
                  <th>Step 3 · Distribute</th>
                  <th className="pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {views.map((view) => (
                  <tr key={view.snapshot.date}>
                    <td className="pl-6 font-medium text-accent">
                      {formatDate(view.snapshot.date)}
                    </td>
                    <td className="font-mono text-xs max-w-[200px] truncate text-secondary">
                      {view.snapshot.claim_nft_id ?? "—"}
                    </td>
                    <td>
                      <StatusBadge status={view.step1} />
                    </td>
                    <td>
                      <StatusBadge status={view.step2} />
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <StatusBadge status={view.step3} />
                        {view.totalAccounts > 0 ? (
                          <span className="text-xs text-secondary">
                            {view.sentCount}/{view.totalAccounts} sent
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="pr-6 text-right">
                      {view.canRecover ? (
                        <button
                          className="btn btn-warning btn-sm gap-2"
                          onClick={() => setConfirmTarget(view.snapshot)}
                          disabled={recoverMutation.isPending}
                        >
                          <RefreshCw className="h-4 w-4" />
                          Recover
                        </button>
                      ) : (
                        <span className="text-xs text-secondary">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination && pagination.total > 0 ? (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-secondary">
            Page {pagination.page} of {totalPages} · {pagination.total} snapshot(s)
          </span>
          <div className="join">
            <button
              className="btn btn-secondary btn-sm join-item"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isFetching}
            >
              Prev
            </button>
            <button
              className="btn btn-secondary btn-sm join-item"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isFetching}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}

      {/* Recovery confirmation modal */}
      <dialog className={`modal ${confirmTarget ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="text-lg font-bold text-accent">Recover Step 3 distribution</h3>
          {confirmTarget ? (
            <div className="py-4 space-y-2 text-sm">
              <p className="text-secondary">
                This re-runs the fund-unit distribution on-chain for the accounts still pending in
                this snapshot. This action triggers real transactions and cannot be undone.
              </p>
              <div className="bg-base-200 rounded-lg p-3 space-y-1">
                <div>
                  <span className="text-secondary">Snapshot: </span>
                  <span className="text-accent">{formatDate(confirmTarget.date)}</span>
                </div>
                <div>
                  <span className="text-secondary">Claim NFT ID: </span>
                  <span className="text-accent font-mono break-all">
                    {confirmTarget.claim_nft_id ?? "—"}
                  </span>
                </div>
                <div>
                  <span className="text-secondary">Pending accounts: </span>
                  <span className="text-accent">
                    {(confirmTarget.accounts ?? []).filter((a) => !a.fund_units_sent).length}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
          <div className="modal-action">
            <button
              className="btn btn-outline"
              onClick={() => setConfirmTarget(null)}
              disabled={recoverMutation.isPending}
            >
              Cancel
            </button>
            <button
              className={`btn btn-warning ${recoverMutation.isPending ? "loading" : ""}`}
              onClick={handleRecover}
              disabled={recoverMutation.isPending}
            >
              {recoverMutation.isPending ? "Recovering" : "Confirm Recover"}
            </button>
          </div>
        </div>
        <div className="modal-backdrop" onClick={() => setConfirmTarget(null)} />
      </dialog>
    </div>
  );
};

export default Snapshots;
