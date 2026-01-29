export const snapshotKeys = {
  all: ["snapshots"] as const,
  totalFundHistoricValues: (secret?: string) =>
    [...snapshotKeys.all, "total-fund-historic-values", secret] as const,
  fundUnitHistoricValues: (secret?: string) =>
    [...snapshotKeys.all, "fund-unit-historic-values", secret] as const,
};
