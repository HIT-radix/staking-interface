import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UnlockingRewards } from "Types/api";
import { NodeManagerReducer } from "Types/reducers";

const initialState: NodeManagerReducer = {
  currentlyEarnedLockedLSUs: "0",
  ownerLSUsInUnlockingProcess: "0",
  totalStakedXrds: "0",
  totalXrdsLeavingOurNode: "0",
  unlockingLSUsBreakdown: [],
  epoch: 0,
};

const nodeManager = createSlice({
  name: "nodeManager",
  initialState,
  reducers: {
    setCurrentlyEarnedLockedLSUs(state, action: PayloadAction<string>) {
      state.currentlyEarnedLockedLSUs = action.payload;
    },
    setOwnerLSUsInUnlockingProcess(state, action: PayloadAction<string>) {
      state.ownerLSUsInUnlockingProcess = action.payload;
    },
    setTotalStakedXrds(state, action: PayloadAction<string>) {
      state.totalStakedXrds = action.payload;
    },
    setTotalXrdsLeavingOurNode(state, action: PayloadAction<string>) {
      state.totalXrdsLeavingOurNode = action.payload;
    },
    setUnlockingLSUsBreakdown(state, action: PayloadAction<UnlockingRewards>) {
      state.unlockingLSUsBreakdown = action.payload;
    },
    setValidatorInfo(state, action: PayloadAction<NodeManagerReducer>) {
      state.currentlyEarnedLockedLSUs = action.payload.currentlyEarnedLockedLSUs;
      state.ownerLSUsInUnlockingProcess = action.payload.ownerLSUsInUnlockingProcess;
      state.totalStakedXrds = action.payload.totalStakedXrds;
      state.totalXrdsLeavingOurNode = action.payload.totalXrdsLeavingOurNode;
      state.unlockingLSUsBreakdown = action.payload.unlockingLSUsBreakdown;
      state.epoch = action.payload.epoch;
    },
  },
});

export default nodeManager.reducer;

export const {
  setCurrentlyEarnedLockedLSUs,
  setOwnerLSUsInUnlockingProcess,
  setTotalStakedXrds,
  setTotalXrdsLeavingOurNode,
  setUnlockingLSUsBreakdown,
  setValidatorInfo,
} = nodeManager.actions;
