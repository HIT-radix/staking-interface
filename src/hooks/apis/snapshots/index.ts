import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HEDGE_FUND_SERVER_URL } from "Constants/endpoints";
import {
  FundUnitHistoricValuesResponse,
  FundUnitValue,
  RecoverDistributionData,
  RecoverDistributionResponse,
  SnapshotsListResponse,
  TotalFundHistoricValuesResponse,
  TotalFundValue,
} from "Types/api";
import { resolveSecret } from "Utils/fetchers";
import { snapshotKeys } from "./keys";

// Fetchers
const fetchTotalFundHistoricValues = async (secret?: string): Promise<TotalFundValue[]> => {
  const resolvedSecret = resolveSecret(secret);
  const { data } = await axios.get<TotalFundHistoricValuesResponse>(
    `${HEDGE_FUND_SERVER_URL}/snapshots/total-fund-historic-values`,
    {
      params: { secret: resolvedSecret },
    }
  );
  return data.data;
};

const fetchFundUnitHistoricValues = async (secret?: string): Promise<FundUnitValue[]> => {
  const resolvedSecret = resolveSecret(secret);
  const { data } = await axios.get<FundUnitHistoricValuesResponse>(
    `${HEDGE_FUND_SERVER_URL}/snapshots/fund-unit-historic-values`,
    {
      params: { secret: resolvedSecret },
    }
  );
  return data.data;
};

const fetchSnapshots = async (params: {
  page: number;
  limit: number;
  secret?: string;
}): Promise<SnapshotsListResponse> => {
  const resolvedSecret = resolveSecret(params.secret);
  const { data } = await axios.get<SnapshotsListResponse>(`${HEDGE_FUND_SERVER_URL}/snapshots`, {
    params: { secret: resolvedSecret, page: params.page, limit: params.limit },
  });
  return data;
};

const recoverDistribution = async (params: {
  claimNftId?: string | null;
  date?: string;
  secret?: string;
}): Promise<RecoverDistributionData> => {
  const resolvedSecret = resolveSecret(params.secret);
  const { data } = await axios.get<RecoverDistributionResponse>(
    `${HEDGE_FUND_SERVER_URL}/snapshots/recover-distribution`,
    {
      params: {
        secret: resolvedSecret,
        claimNftId: params.claimNftId || undefined,
        date: params.date,
      },
    }
  );
  return data.data;
};

// Hooks
export const useSnapshots = (options?: {
  page?: number;
  limit?: number;
  secret?: string;
  enabled?: boolean;
}) => {
  const secret = resolveSecret(options?.secret);
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 10;
  return useQuery({
    queryKey: snapshotKeys.list(page, limit, secret),
    queryFn: () => fetchSnapshots({ page, limit, secret }),
    enabled: (options?.enabled ?? true) && Boolean(secret),
  });
};

export const useRecoverDistribution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recoverDistribution,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: snapshotKeys.all });
    },
  });
};

export const useTotalFundHistoricValues = (options?: { secret?: string; enabled?: boolean }) => {
  const secret = resolveSecret(options?.secret);
  return useQuery({
    queryKey: snapshotKeys.totalFundHistoricValues(secret),
    queryFn: () => fetchTotalFundHistoricValues(secret),
    enabled: options?.enabled ?? true,
  });
};

export const useFundUnitHistoricValues = (options?: { secret?: string; enabled?: boolean }) => {
  const secret = resolveSecret(options?.secret);
  return useQuery({
    queryKey: snapshotKeys.fundUnitHistoricValues(secret),
    queryFn: () => fetchFundUnitHistoricValues(secret),
    enabled: options?.enabled ?? true,
  });
};
