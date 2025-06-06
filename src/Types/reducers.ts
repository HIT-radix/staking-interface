import { WalletDataState } from "@radixdlt/radix-dapp-toolkit";
import { FungibleBalances, NonFungibleBalances, RewardTokenDistribution, TokenData } from "./token";
import { SnapshotDB } from "./api";

export type AppReducer = {
  walletData: WalletDataState;
  hitPrice: number;
  walletAddress: string;
  fomoPrice: number;
};

export enum Percentage {
  _0 = 0,
  _10 = 0.1,
  _25 = 0.25,
  _50 = 0.5,
  _75 = 0.75,
  _100 = 1,
}

export enum Tabs {
  stake = "stake",
  unstake = "unstake",
  claim = "claim",
}

export type StakingReducer = {
  currentTab: Tabs;
  amount: string;
  percentage: Percentage;
  isInSufficientBalance: boolean;
  stHitBalance: string;
  stHIT_totalSupply: string;
  stakedHIT: string;
  lockedHITRewards: string;
  isOwner: boolean;
  NodeStakeNFTid?: number;
  lockedNodeStakingHits: string;
  lockedNodeStakingFomos: string;
  // lockedNodeStakingxUSDTs: string;
  lockedNodeStakingxUSDCs: string;
};

export enum StakingTokens {
  HIT = "HIT",
  StHIT = "StHIT",
  FOMO = "FOMO",
  XRD = "XRD",
  LSU = "LSU",
  // XUSDT = "xUSDT",
  XUSDC = "xUSDC",
}

export type SessionReducer = {
  successTxCount: number;
  tokenData?: TokenData;
  fomoTokenData?: TokenData;
  hitBalance: string;
  fomoBalance: string;
  rewardsModalData?: {
    amount: string;
    RewardTokenDistributions: RewardTokenDistribution[];
    tokenSymbol: StakingTokens;
    tokenAddress: string;
    snapshot: number;
    timestamp: number;
  };
  selectedSnapshots: SnapshotDB[];
  // xusdtBalance: string;
  xusdcBalance: string;
  felixWallet: {
    fungible: FungibleBalances;
    nonFungible: NonFungibleBalances;
  };
};

export type LoadingReducer = {
  balanceLoading: boolean;
  txInProgress: boolean;
  tokenDataLoading: boolean;
  poolDataLoading: boolean;
  rugProofComponentDataLoading: boolean;
  stHitDataLoading: boolean;
  nodeStakingRewards: boolean;
  nodeStakingComponentDataLoading: boolean;
};
