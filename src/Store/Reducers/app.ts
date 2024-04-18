import { WalletDataState } from "@radixdlt/radix-dapp-toolkit";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppReducer } from "Types/reducers";

const initialState: AppReducer = {
  walletData: { accounts: [], personaData: [], proofs: [] },
  hitPrice: 0,
  hitBalance: "",
};

const app = createSlice({
  name: "app",
  initialState,
  reducers: {
    setWalletData(state, action: PayloadAction<WalletDataState>) {
      state.walletData = action.payload;
    },
    setHitPrice(state, action: PayloadAction<number | undefined>) {
      state.hitPrice = action.payload ?? 0;
    },
  },
});

export default app.reducer;

export const { setWalletData, setHitPrice } = app.actions;
