import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { createAction } from "@reduxjs/toolkit";

import app from "./app";
import session from "./session";
import loadings from "./loadings";

const persistConfig = {
  version: 1,
  key: "hit-staking-ts",
  storage,
  whitelist: ["app"],
  // migrate: createMigrate({}),
};

export const logout = createAction("USER_LOGOUT");

const reducers = combineReducers({
  app,
  session,
  loadings,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "USER_LOGOUT") {
    localStorage.removeItem("persist:hit-staking-ts");
    return reducers(undefined, action);
  }
  return reducers(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
