import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoadingReducer } from "Types/reducers";

const initialState: LoadingReducer = {
  balanceLoading: false,
  txInProgress: false,
  tokenDataLoading: false,
  poolDataLoading: false,
};

const loadings = createSlice({
  name: "loadings",
  initialState,
  reducers: {
    setBalanceLoading(state, action: PayloadAction<boolean>) {
      state.balanceLoading = action.payload;
    },
    setTxInProgress(state, action: PayloadAction<boolean>) {
      state.txInProgress = action.payload;
    },
    setTokenDataLoading(state, action: PayloadAction<boolean>) {
      state.tokenDataLoading = action.payload;
    },
    setPoolDataLoading(state, action: PayloadAction<boolean>) {
      state.poolDataLoading = action.payload;
    },
  },
});

export default loadings.reducer;

export const { setBalanceLoading, setTxInProgress, setTokenDataLoading, setPoolDataLoading } =
  loadings.actions;
