import { RewardTokenDistribution } from "./token";

export interface ResourceDetails {
  amount: string;
  last_updated_at_state_version: number;
  aggregation_level: string;
  resource_address: string;
}

interface TypedValue {
  raw_hex: string;
  programmatic_json: {
    variant_id: number;
    fields: { element_kind: string; elements: { value: string; kind: string }[]; kind: string }[];
    kind: string;
  };
  typed: { values?: string[]; type: string; value?: string };
}

interface MetadataItem {
  key: string;
  value: TypedValue;
  is_locked: boolean;
  last_updated_at_state_version: number;
}

interface RoleAssignment {
  role_key: { module: string; name: string };
  assignment: {
    resolution: string;
    explicit_rule?: {
      type: string;
      access_rule: {
        type: string;
        proof_rule: {
          type: string;
          requirement: {
            type: string;
            non_fungible: {
              local_id: { id_type: string; sbor_hex: string; simple_rep: string };
              resource_address: string;
            };
          };
        };
      };
    };
    updater_roles: { module: string; name: string }[];
  };
}

interface Details {
  package_address: string;
  blueprint_name: string;
  blueprint_version: string;
  state: Record<string, any>;
  role_assignments: {
    owner: {
      rule: {
        type: string;
        access_rule: {
          type: string;
          proof_rule: {
            type: string;
            requirement: {
              type: string;
              non_fungible: {
                local_id: { id_type: string; sbor_hex: string; simple_rep: string };
                resource_address: string;
              };
            };
          };
        };
        updater: string;
      };
      entries: RoleAssignment[];
    };
    type: string;
  };
  total_supply: string;
}

interface Item {
  address: string;
  fungible_resources: { total_count: number; items: ResourceDetails[] };
  non_fungible_resources: { total_count: number; items: ResourceDetails[] };
  metadata: { total_count: number; items: MetadataItem[] };
  details: Details;
}

export interface EntityDetails {
  items: Item[];
}

export type SnapshotApiResponse = {
  rewardsList: RewardTokenDistribution[];
  snapshot_state_version: number;
};

export type SnapshotDB = {
  snapshot: number;
  timestamp: number;
  data: RewardTokenDistribution[];
};

export interface LedgerState {
  network: string;
  state_version: number;
  proposer_round_timestamp: string;
  epoch: number;
  round: number;
}

export interface PoolUnitRedemptionValue {
  resource_address: string;
  amount: string;
}

export interface PoolUnitNativeResourceDetails {
  pool_address: string;
  redemption_resource_count: number;
  unit_redemption_value: PoolUnitRedemptionValue[];
  kind: string;
}

export interface ExplicitMetadata {
  total_count: number;
  items: MetadataItem[];
}

export interface PoolUnitNativeDetails {
  role_assignments: Details["role_assignments"];
  divisibility: number;
  total_supply: string;
  total_minted: string;
  total_burned: string;
  native_resource_details: PoolUnitNativeResourceDetails;
  type: string;
}

export interface PoolUnitEntityDetailsApiItem {
  address: string;
  fungible_resources: Item["fungible_resources"];
  non_fungible_resources: Item["non_fungible_resources"];
  metadata: Item["metadata"];
  explicit_metadata: ExplicitMetadata;
  details: PoolUnitNativeDetails;
}

export interface PoolUnitEntityDetailsApiResponse {
  ledger_state: LedgerState;
  items: PoolUnitEntityDetailsApiItem[];
}

export interface AttosStrategyData {
  name: string;
  symbol: string;
  icon_url: string;
  info_url: string;
  resource_address: string;
  bonus_type: string;
  strategy_type: string;
  provider: string;
  bonus_value: number;
  deposited: number;
  loaned: number;
  requiredAssets: {
    resource_address: string;
    symbol: string;
  }[];
  rewardTokens: string[];
}

export enum StrategyId {
  XRD_Flux_Liquidation = "XRD_Flux_Liquidation",
  LSULP_Flux_Liquidation = "LSULP_Flux_Liquidation",
  xUSDT_Weft_Finance_Lending = "xUSDT_Weft Finance_Lending",
  xUSDC_Weft_Finance_Lending = "xUSDC_Weft Finance_Lending",
  xUSDT_Root_Finance_Lending = "xUSDT_Root Finance_Lending",
  xUSDC_Root_Finance_Lending = "xUSDC_Root Finance_Lending",
  xUSDC_Surge_Trade_Liquidation = "xUSDC_Surge_Trade_Liquidation",
}

export interface SurgeStatsResponse {
  apy: {
    start_datetime: string;
    tooltip: {
      "Approx LP Rewards": number;
      "Trade Fees": number;
    };
    value: number;
  };
  data: {
    pool_now: {
      datetime: string;
      price: number;
      total_amount: number;
      total_supply: number;
    };
    pool_past: {
      datetime: string;
      price: number;
      total_amount: number;
      total_supply: number;
    };
  };
  fees_pool: {
    "24hours": string;
    "30days": string;
    "7days": string;
    all_time: string;
  };
  fees_protocol: {
    "24hours": string;
    "30days": string;
    "7days": string;
    all_time: string;
  };
  last_updated: string;
  tvl: number;
  volume: {
    "24hours": string;
    "30days": string;
    "7days": string;
    all_time: string;
  };
}

export interface AttosPoolData {
  type: string;
  pool_type: string;
  current_price: string;
  sub_type: string;
  xRatio: string;
  yRatio: string;
  component: string;
  tvl: number;
  bonus_24h: number | null;
  bonus_7d: number;
  base: string;
  quote: string;
  volume_7d: number;
  volume_24h: number;
  bonus_name: string;
  left_alt: string;
  right_alt: string;
  left_icon: string;
  right_icon: string;
  left_token: string;
  right_token: string;
  name: string;
  left_name: string;
  right_name: string;
  deposit_link: string;
  boosted: boolean;
  tags: string[];
}
