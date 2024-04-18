import { WalletDataState } from "@radixdlt/radix-dapp-toolkit";

export type AppReducer = {
  walletData: WalletDataState;
  hitPrice: number;
  hitBalance: string;
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
};

export enum StakingTokens {
  HIT = "HIT",
  StHIT = "StHIT",
}

export type SessionReducer = {
  successTxCount: number;
};

export type LoadingReducer = {
  balanceLoading: boolean;
  txInProgress: boolean;
};
