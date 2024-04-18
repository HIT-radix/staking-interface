import { createSlice } from "@reduxjs/toolkit";
import { SessionReducer } from "Types/reducers";

const initialState: SessionReducer = {
  successTxCount: 0,
};

const session = createSlice({
  name: "session",
  initialState,
  reducers: {
    incrementSuccessTxCount(state) {
      state.successTxCount = state.successTxCount + 1;
    },
  },
});

export default session.reducer;

export const { incrementSuccessTxCount } = session.actions;
