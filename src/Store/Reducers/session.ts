import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { SnapshotDB } from "Types/api";
import { SessionReducer } from "Types/reducers";
import { TokenData } from "Types/token";

const initialState: SessionReducer = {
  successTxCount: 0,
  tokenData: undefined,
  hitBalance: "0",
  fomoBalance: "0",
  reddicksBalance: "0",
  // xusdtBalance: "0",
  xusdcBalance: "0",
  fomoTokenData: undefined,
  reddicksTokenData: undefined,
  rewardsModalData: undefined,
  buybackAirdropModalData: undefined,
  selectedSnapshots: [],
  felixWallet: { fungible: {}, nonFungible: {} },
  userWallet: { fungible: {}, nonFungible: {} },
  botWallet: { fungible: {}, nonFungible: {} },
};

const session = createSlice({
  name: "session",
  initialState,
  reducers: {
    incrementSuccessTxCount(state) {
      state.successTxCount = state.successTxCount + 1;
    },
    updateTokenData(state, action: PayloadAction<TokenData>) {
      state.tokenData = action.payload;
    },
    setHitBalance(state, action: PayloadAction<string>) {
      state.hitBalance = action.payload;
    },
    setFomoBalance(state, action: PayloadAction<string>) {
      state.fomoBalance = action.payload;
    },
    setReddicksBalance(state, action: PayloadAction<string>) {
      state.reddicksBalance = action.payload;
    },
    // setxusdtBalance(state, action: PayloadAction<string>) {
    //   state.xusdtBalance = action.payload;
    // },
    setxusdcBalance(state, action: PayloadAction<string>) {
      state.xusdcBalance = action.payload;
    },
    updateHitFomoData(
      state,
      action: PayloadAction<{ hit?: TokenData; fomo?: TokenData; reddicks?: TokenData }>
    ) {
      if (action.payload.hit) {
        state.tokenData = action.payload.hit;
      }
      if (action.payload.fomo) {
        state.fomoTokenData = action.payload.fomo;
      }
      if (action.payload.reddicks) {
        state.reddicksTokenData = action.payload.reddicks;
      }
    },
    setRewardsModalData(state, action: PayloadAction<SessionReducer["rewardsModalData"]>) {
      state.rewardsModalData = action.payload;
    },
    setBuybackAirdropModalData(
      state,
      action: PayloadAction<SessionReducer["buybackAirdropModalData"]>
    ) {
      state.buybackAirdropModalData = action.payload;
    },
    setSelectedSnapshots(state, action: PayloadAction<SnapshotDB[]>) {
      state.selectedSnapshots = action.payload;
    },
    setFelixWallet(state, action: PayloadAction<SessionReducer["felixWallet"]>) {
      state.felixWallet = action.payload;
    },
    setBotWallet(state, action: PayloadAction<SessionReducer["botWallet"]>) {
      state.botWallet = action.payload;
    },
    setUserWallet(state, action: PayloadAction<SessionReducer["userWallet"]>) {
      state.userWallet = action.payload;
    },
  },
});

export default session.reducer;

export const {
  incrementSuccessTxCount,
  updateTokenData,
  setHitBalance,
  setFomoBalance,
  updateHitFomoData,
  setRewardsModalData,
  setSelectedSnapshots,
  // setxusdtBalance,
  setFelixWallet,
  setxusdcBalance,
  setReddicksBalance,
  setUserWallet,
  setBuybackAirdropModalData,
  setBotWallet,
} = session.actions;
