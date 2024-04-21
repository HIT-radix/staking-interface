import { store } from "Store";
import { getStakeTxManifest, getUnStakeTxManifest } from "./fetchers";
import { getRdt } from "subs";
import { setTxInProgress } from "Store/Reducers/loadings";
import { incrementSuccessTxCount } from "Store/Reducers/session";
import { setAmount, setPercentage } from "Store/Reducers/staking";
import { Percentage } from "Types/reducers";

export const stakeHIT = async () => {
  const {
    app: { walletAddress },
    staking: { amount },
  } = store.getState();

  const rdt = getRdt();
  try {
    if (rdt) {
      store.dispatch(setTxInProgress(true));
      const result = await rdt.walletApi.sendTransaction({
        transactionManifest: getStakeTxManifest(walletAddress, amount),
        version: 1,
      });
      if (result.isErr()) throw result.error;
      store.dispatch(incrementSuccessTxCount());
      store.dispatch(setAmount("0"));
      store.dispatch(setPercentage(Percentage._0));
      console.log("sendTransaction Result: ", result.value);
    }
  } catch (error) {
    console.log("Unable to send Transaction", error);
  }
  store.dispatch(setTxInProgress(false));
};

export const unstakeHIT = async () => {
  const {
    app: { walletAddress },
    staking: { amount },
  } = store.getState();

  const rdt = getRdt();
  try {
    if (rdt) {
      store.dispatch(setTxInProgress(true));
      const result = await rdt.walletApi.sendTransaction({
        transactionManifest: getUnStakeTxManifest(walletAddress, amount),
        version: 1,
      });
      if (result.isErr()) throw result.error;
      store.dispatch(incrementSuccessTxCount());
      store.dispatch(setAmount("0"));
      store.dispatch(setPercentage(Percentage._0));
      console.log("sendTransaction Result: ", result.value);
    }
  } catch (error) {
    console.log("Unable to send Transaction", error);
  }
  store.dispatch(setTxInProgress(false));
};
