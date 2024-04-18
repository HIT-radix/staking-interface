import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Percentage, StakingReducer, Tabs } from "Types/reducers";

const initialState: StakingReducer = {
  currentTab: Tabs.stake,
  amount: "",
  percentage: Percentage._0,
  isInSufficientBalance: false,
  stHitBalance: "0",
};

const staking = createSlice({
  name: "staking",
  initialState,
  reducers: {
    setCurrentTab(state, action: PayloadAction<Tabs>) {
      state.currentTab = action.payload;
    },
    setAmount(state, action: PayloadAction<string>) {
      state.amount = action.payload;
    },
    setPercentage(state, action: PayloadAction<Percentage>) {
      state.percentage = action.payload;
    },
    setIsInsufficientBalance(state, action: PayloadAction<boolean>) {
      if (state.isInSufficientBalance !== action.payload) {
        state.isInSufficientBalance = action.payload;
      }
    },
    setStHitBalance(state, action: PayloadAction<string>) {
      state.stHitBalance = action.payload;
    },
  },
});

export default staking.reducer;

export const {
  setCurrentTab,
  setAmount,
  setPercentage,
  setIsInsufficientBalance,
  setStHitBalance,
} = staking.actions;
