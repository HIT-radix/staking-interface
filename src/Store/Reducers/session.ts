import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { SnapshotDB } from "Types/api";
import { SessionReducer } from "Types/reducers";
import { TokenData } from "Types/token";

const initialState: SessionReducer = {
  successTxCount: 0,
  tokenData: undefined,
  hitBalance: "0",
  fomoBalance: "0",
  xusdtBalance: "0",
  fomoTokenData: undefined,
  rewardsModalData: undefined,
  selectedSnapshots: [],
  felixWallet: { fungible: {}, nonFungible: {} },
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
    setxusdtBalance(state, action: PayloadAction<string>) {
      state.xusdtBalance = action.payload;
    },
    updateHitFomoData(state, action: PayloadAction<{ hit?: TokenData; fomo?: TokenData }>) {
      if (action.payload.hit) {
        state.tokenData = action.payload.hit;
      }
      if (action.payload.fomo) {
        state.fomoTokenData = action.payload.fomo;
      }
    },
    setRewardsModalData(state, action: PayloadAction<SessionReducer["rewardsModalData"]>) {
      state.rewardsModalData = action.payload;
    },
    setSelectedSnapshots(state, action: PayloadAction<SnapshotDB[]>) {
      state.selectedSnapshots = action.payload;
    },
    setFelixWallet(state, action: PayloadAction<SessionReducer["felixWallet"]>) {
      state.felixWallet = action.payload;
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
  setxusdtBalance,
  setFelixWallet,
} = session.actions;
