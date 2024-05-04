import { toast } from "react-toastify";

import {
  getLockTxManifest,
  getStakeTxManifest,
  getDistributeHitTxManifest,
  getUnStakeTxManifest,
  getDistributeLockHitTxManifest,
  fetchComponentDetails,
} from "./fetchers";
import { setAmount, setPercentage } from "Store/Reducers/staking";
import { incrementSuccessTxCount } from "Store/Reducers/session";
import { Percentage, StakingTokens } from "Types/reducers";
import { setTxInProgress } from "Store/Reducers/loadings";
import CachedService from "Classes/cachedService";
import { formatTokenAmount } from "./format";
import { store } from "Store";
import { getRdt } from "subs";
import {
  StakeSuccessToast,
  DistributeSuccessToast,
  TxCanceledToast,
  TxFailedToast,
  TxProgressToast,
  UnStakeSuccessToast,
  LockSuccessToast,
} from "Components/toasts";
import axios from "axios";
import { TelegramBotServerUrl } from "Constants/endpoints";

type Props = {
  amount: string;
  walletAddress: string;
  txManifestBuilder: (walletAddress: string, amount: string) => string;
  tokenSymbol: StakingTokens;
  ToastElement: ({
    amount,
    token,
    txId,
  }: {
    amount: string;
    token: StakingTokens;
    txId: string;
  }) => JSX.Element;
};

export const baseTxSender = async ({
  amount,
  txManifestBuilder,
  ToastElement,
  tokenSymbol,
  walletAddress,
}: Props) => {
  const rdt = getRdt();
  let isSuccess = false;
  try {
    if (rdt) {
      store.dispatch(setTxInProgress(true));
      CachedService.TxProgressToast(<TxProgressToast />);
      const result = await rdt.walletApi.sendTransaction({
        transactionManifest: txManifestBuilder(walletAddress, amount),
        version: 1,
      });
      if (result.isErr()) throw result.error;
      toast.dismiss();
      CachedService.successToast(
        <ToastElement
          amount={formatTokenAmount(Number(amount))}
          token={tokenSymbol}
          txId={result.value.transactionIntentHash}
        />
      );
      afterSuccessChore();
      isSuccess = true;
      console.log("sendTransaction Result: ", result);
    }
  } catch (error: any) {
    afterErrorChore(error);
  }
  store.dispatch(setTxInProgress(false));
  return isSuccess;
};

export const stakeHIT = async () => {
  try {
    const {
      app: { walletAddress },
      staking: { amount },
    } = store.getState();

    const isSuccess = await baseTxSender({
      walletAddress,
      amount,
      txManifestBuilder: getStakeTxManifest,
      ToastElement: StakeSuccessToast,
      tokenSymbol: StakingTokens.HIT,
    });
    if (isSuccess) {
      await axios.post(`${TelegramBotServerUrl}/emit-stake-message`, {
        message: `${formatTokenAmount(+amount)} HIT has been staked! 💉`,
      });
    }
  } catch (error) {
    console.log("failed sending telegram message");
  }
};

export const unstakeHIT = async () => {
  const {
    app: { walletAddress },
    staking: { amount },
  } = store.getState();

  await baseTxSender({
    walletAddress,
    amount,
    txManifestBuilder: getUnStakeTxManifest,
    ToastElement: UnStakeSuccessToast,
    tokenSymbol: StakingTokens.StHIT,
  });
};

export const distributeHITRewards = async (amount: string, distributeLockedHits: boolean) => {
  const {
    app: { walletAddress },
  } = store.getState();

  await baseTxSender({
    walletAddress,
    amount,
    txManifestBuilder: distributeLockedHits
      ? getDistributeLockHitTxManifest
      : getDistributeHitTxManifest,
    ToastElement: DistributeSuccessToast,
    tokenSymbol: StakingTokens.HIT,
  });

  if (distributeLockedHits) {
    fetchComponentDetails();
  }
};

export const LockHITRewards = async (amount: string) => {
  const {
    app: { walletAddress },
  } = store.getState();

  await baseTxSender({
    walletAddress,
    amount,
    txManifestBuilder: getLockTxManifest,
    ToastElement: LockSuccessToast,
    tokenSymbol: StakingTokens.HIT,
  });
  fetchComponentDetails();
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
