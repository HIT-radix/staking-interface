import { WalletDataState } from "@radixdlt/radix-dapp-toolkit";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppReducer } from "Types/reducers";

const initialState: AppReducer = {
  walletData: { accounts: [], personaData: [], proofs: [] },
  hitPrice: 0,
  walletAddress: "",
};

const app = createSlice({
  name: "app",
  initialState,
  reducers: {
    setWalletData(state, action: PayloadAction<WalletDataState>) {
      state.walletData = action.payload;
      let accounts = action.payload.accounts;
      state.walletAddress = accounts.length > 0 ? action.payload.accounts[0].address : "";
    },
    setHitPrice(state, action: PayloadAction<number>) {
      state.hitPrice = action.payload;
    },
  },
});

export default app.reducer;

export const { setWalletData, setHitPrice } = app.actions;
