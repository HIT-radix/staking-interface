import { WalletDataState } from "@radixdlt/radix-dapp-toolkit";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppReducer } from "Types/reducers";

const initialState: AppReducer = {
  walletData: { accounts: [], personaData: [], proofs: [] },
};

const app = createSlice({
  name: "app",
  initialState,
  reducers: {
    setWalletData(state, action: PayloadAction<WalletDataState>) {
      state.walletData = action.payload;
    },
  },
});

export default app.reducer;

export const { setWalletData } = app.actions;
