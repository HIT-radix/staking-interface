import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { SessionReducer } from "Types/reducers";
import { TokenData } from "Types/token";

const initialState: SessionReducer = {
  successTxCount: 0,
  tokenData: undefined,
  hitBalance: "0",
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
  },
});

export default session.reducer;

export const { incrementSuccessTxCount, updateTokenData, setHitBalance } = session.actions;
