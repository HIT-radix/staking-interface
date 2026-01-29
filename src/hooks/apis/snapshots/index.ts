import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { HEDGE_FUND_SERVER_URL } from "Constants/endpoints";
import {
  FundUnitHistoricValuesResponse,
  FundUnitValue,
  TotalFundHistoricValuesResponse,
  TotalFundValue,
} from "Types/api";
import { assertSecret, resolveSecret } from "Utils/fetchers";
import { snapshotKeys } from "./keys";

// Fetchers
const fetchTotalFundHistoricValues = async (secret?: string): Promise<TotalFundValue[]> => {
  const resolvedSecret = assertSecret(resolveSecret(secret));
  const { data } = await axios.get<TotalFundHistoricValuesResponse>(
    `${HEDGE_FUND_SERVER_URL}/snapshots/total-fund-historic-values`,
    {
      params: { secret: resolvedSecret },
    }
  );
  return data.data;
};

const fetchFundUnitHistoricValues = async (secret?: string): Promise<FundUnitValue[]> => {
  const resolvedSecret = assertSecret(resolveSecret(secret));
  const { data } = await axios.get<FundUnitHistoricValuesResponse>(
    `${HEDGE_FUND_SERVER_URL}/snapshots/fund-unit-historic-values`,
    {
      params: { secret: resolvedSecret },
    }
  );
  return data.data;
};

// Hooks
export const useTotalFundHistoricValues = (options?: { secret?: string; enabled?: boolean }) => {
  const secret = resolveSecret(options?.secret);
  return useQuery({
    queryKey: snapshotKeys.totalFundHistoricValues(secret),
    queryFn: () => fetchTotalFundHistoricValues(secret),
    enabled: (options?.enabled ?? true) && Boolean(secret),
  });
};

export const useFundUnitHistoricValues = (options?: { secret?: string; enabled?: boolean }) => {
  const secret = resolveSecret(options?.secret);
  return useQuery({
    queryKey: snapshotKeys.fundUnitHistoricValues(secret),
    queryFn: () => fetchFundUnitHistoricValues(secret),
    enabled: (options?.enabled ?? true) && Boolean(secret),
  });
};
