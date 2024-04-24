import { toast } from "react-toastify";

import { store } from "Store";
import { getStakeTxManifest, getTopupTxManifest, getUnStakeTxManifest } from "./fetchers";
import { getRdt } from "subs";
import { setTxInProgress } from "Store/Reducers/loadings";
import { incrementSuccessTxCount } from "Store/Reducers/session";
import { setAmount, setPercentage } from "Store/Reducers/staking";
import { Percentage, StakingTokens } from "Types/reducers";
import CachedService from "Classes/cachedService";
import {
  StakeSuccessToast,
  TopupSuccessToast,
  TxCanceledToast,
  TxFailedToast,
  TxProgressToast,
  UnStakeSuccessToast,
} from "Components/toasts";
import { formatTokenAmount } from "./format";

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
          amount={formatTokenAmount(Number(amount))}
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
          amount={formatTokenAmount(Number(amount))}
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

export const topupHIT = async (amount: string) => {
  const {
    app: { walletAddress },
  } = store.getState();

  const rdt = getRdt();
  try {
    if (rdt) {
      store.dispatch(setTxInProgress(true));
      CachedService.TxProgressToast(<TxProgressToast />);
      const result = await rdt.walletApi.sendTransaction({
        transactionManifest: getTopupTxManifest(walletAddress, amount),
        version: 1,
      });
      if (result.isErr()) throw result.error;
      toast.dismiss();
      CachedService.successToast(
        <TopupSuccessToast
          amount={formatTokenAmount(Number(amount))}
          token={StakingTokens.HIT}
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
