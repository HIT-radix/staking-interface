import { WalletDataState } from "@radixdlt/radix-dapp-toolkit";
import { TokenData } from "./token";

export type AppReducer = {
  walletData: WalletDataState;
  hitPrice: number;
  walletAddress: string;
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
};

export enum StakingTokens {
  HIT = "HIT",
  StHIT = "StHIT",
  FOMO = "FOMO",
  XRD = "XRD",
}

export type SessionReducer = {
  successTxCount: number;
  tokenData?: TokenData;
  hitBalance: string;
};

export type LoadingReducer = {
  balanceLoading: boolean;
  txInProgress: boolean;
  tokenDataLoading: boolean;
  poolDataLoading: boolean;
  componentDataLoading: boolean;
  stHitDataLoading: boolean;
  findingNodeNFT: boolean;
};
