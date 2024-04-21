import { toast } from "react-toastify";

import { store } from "Store";
import { getStakeTxManifest, getUnStakeTxManifest } from "./fetchers";
import { getRdt } from "subs";
import { setTxInProgress } from "Store/Reducers/loadings";
import { incrementSuccessTxCount } from "Store/Reducers/session";
import { setAmount, setPercentage } from "Store/Reducers/staking";
import { Percentage, StakingTokens } from "Types/reducers";
import CachedService from "Classes/cachedService";
import {
  StakeSuccessToast,
  TxCanceledToast,
  TxFailedToast,
  TxProgressToast,
  UnStakeSuccessToast,
} from "Components/toasts";

export const stakeHIT = async () => {
  const {
    app: { walletAddress },
    staking: { amount },
  } = store.getState();

  const rdt = getRdt();
  try {
    if (rdt) {
      store.dispatch(setTxInProgress(true));
      CachedService.TxProgressToast(<TxProgressToast />);
      const result = await rdt.walletApi.sendTransaction({
        transactionManifest: getStakeTxManifest(walletAddress, amount),
        version: 1,
      });
      if (result.isErr()) throw result.error;
      toast.dismiss();
      CachedService.successToast(
        <StakeSuccessToast
          amount={amount}
          token={StakingTokens.HIT}
          txId={result.value.transactionIntentHash}
        />
      );
      afterSuccessChore();
      console.log("sendTransaction Result: ", result);
    }
  } catch (error: any) {
    afterErrorChore(error);
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
      CachedService.TxProgressToast(<TxProgressToast />);
      const result = await rdt.walletApi.sendTransaction({
        transactionManifest: getUnStakeTxManifest(walletAddress, amount),
        version: 1,
      });
      if (result.isErr()) throw result.error;
      toast.dismiss();
      CachedService.successToast(
        <UnStakeSuccessToast
          amount={amount}
          token={StakingTokens.StHIT}
          txId={result.value.transactionIntentHash}
        />
      );
      afterSuccessChore();
      console.log("sendTransaction Result: ", result.value);
    }
  } catch (error: any) {
    afterErrorChore(error);
  }
  store.dispatch(setTxInProgress(false));
};

const afterSuccessChore = () => {
  store.dispatch(incrementSuccessTxCount());
  store.dispatch(setAmount("0"));
  store.dispatch(setPercentage(Percentage._0));
};

const afterErrorChore = (error: any) => {
  toast.dismiss();
  if (error?.error === "rejectedByUser") {
    CachedService.errorToast(<TxCanceledToast />);
  } else {
    CachedService.errorToast(<TxFailedToast />);
  }
  console.log("Unable to send Transaction", error);
};
