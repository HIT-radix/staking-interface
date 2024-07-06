import { toast } from "react-toastify";

import { fetchComponentDetails } from "./fetchers";
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
  NFTmintToast,
  AssignRewardSuccessToast,
  ClaimSuccessToast,
} from "Components/toasts";
import axios from "axios";
import { TelegramBotServerUrl } from "Constants/endpoints";
import {
  getAssignNodeStakingRewardsManifest,
  getDepositNodeStakingRewardsManifest,
  getDistributeHitTxManifest,
  getDistributeLockHitTxManifest,
  getLockTxManifest,
  getMintNodeStakingRewardsNFTbadgeManifest,
  getStakeTxManifest,
  getUnStakeTxManifest,
  getWithdrawNodeStakingRewardsManifest,
} from "./manifests";
import { RewardTokenDistribution } from "Types/token";

type Props = {
  amount: string;
  txManifest: string;
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

export const baseTxSender = async ({ amount, txManifest, ToastElement, tokenSymbol }: Props) => {
  const rdt = getRdt();
  let isSuccess = false;
  try {
    if (rdt) {
      store.dispatch(setTxInProgress(true));
      CachedService.TxProgressToast(<TxProgressToast />);
      const result = await rdt.walletApi.sendTransaction({
        transactionManifest: txManifest,
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
      amount,
      txManifest: getStakeTxManifest(walletAddress, amount),
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
    amount,
    txManifest: getUnStakeTxManifest(walletAddress, amount),
    ToastElement: UnStakeSuccessToast,
    tokenSymbol: StakingTokens.StHIT,
  });
};

export const distributeHITRewards = async (amount: string, distributeLockedHits: boolean) => {
  try {
    const {
      app: { walletAddress },
    } = store.getState();

    await baseTxSender({
      amount,
      txManifest: distributeLockedHits
        ? getDistributeLockHitTxManifest(walletAddress, amount)
        : getDistributeHitTxManifest(walletAddress, amount),
      ToastElement: DistributeSuccessToast,
      tokenSymbol: StakingTokens.HIT,
    });

    if (distributeLockedHits) {
      fetchComponentDetails();
    }
  } catch (error) {
    console.log("Unable to distribute Hits");
  }
};

export const LockHITRewards = async (amount: string) => {
  try {
    const {
      app: { walletAddress },
    } = store.getState();

    await baseTxSender({
      amount,
      txManifest: getLockTxManifest(walletAddress, amount),
      ToastElement: LockSuccessToast,
      tokenSymbol: StakingTokens.HIT,
    });
    fetchComponentDetails();
  } catch (error) {
    console.log("Unable to lock hits");
  }
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

export const mintNodeStakingRewardsNFTbadge = async () => {
  try {
    const {
      app: { walletAddress },
    } = store.getState();

    await baseTxSender({
      amount: "1",
      txManifest: getMintNodeStakingRewardsNFTbadgeManifest(walletAddress),
      ToastElement: NFTmintToast,
      tokenSymbol: StakingTokens.HIT,
    });
  } catch (error) {
    console.log("Unable to mint node staking nft badge");
  }
};

export const depositNodeStakingRewards = async (
  amount: string,
  tokenSymbol: StakingTokens,
  tokenAddress: string
) => {
  try {
    const {
      app: { walletAddress },
    } = store.getState();

    await baseTxSender({
      amount,
      txManifest: getDepositNodeStakingRewardsManifest(walletAddress, amount, tokenAddress),
      ToastElement: LockSuccessToast,
      tokenSymbol,
    });
  } catch (error) {
    console.log("Unable to lock", tokenSymbol);
  }
};

export const assignNodeStakingRewards = async (
  amount: string,
  rewardTokenDistributions: RewardTokenDistribution[],
  tokenSymbol: StakingTokens,
  rewardTokenAddress: string
) => {
  try {
    const {
      app: { walletAddress },
    } = store.getState();

    await baseTxSender({
      amount,
      txManifest: getAssignNodeStakingRewardsManifest(
        walletAddress,
        rewardTokenDistributions,
        rewardTokenAddress
      ),
      ToastElement: AssignRewardSuccessToast,
      tokenSymbol,
    });
  } catch (error) {
    console.log("Unable to assign", tokenSymbol, "rewards");
  }
};

export const withdrawNodeStakingRewards = async (userNftBadgeId: number) => {
  try {
    const {
      app: { walletAddress },
    } = store.getState();

    await baseTxSender({
      amount: "",
      txManifest: getWithdrawNodeStakingRewardsManifest(walletAddress, userNftBadgeId),
      ToastElement: ClaimSuccessToast,
      tokenSymbol: StakingTokens.HIT,
    });
  } catch (error) {
    console.log("Unable to withdraw node staking rewards");
  }
};
