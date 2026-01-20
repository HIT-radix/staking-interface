import { DataRequestBuilder } from "@radixdlt/radix-dapp-toolkit";
import axios from "axios";

import GeneralOwnerInterface from "Components/generalOwnerInterface";
import InfoTile from "Components/infoTile";
import {
  FOMO_RESOURCE_ADDRESS,
  HIT_RESOURCE_ADDRESS,
  REDDICKS_RESOURCE_ADDRESS,
} from "Constants/address";
import { HIT_SERVER_URL } from "Constants/endpoints";
import { dispatch, useSelector } from "Store";
import { setRewardsModalData } from "Store/Reducers/session";
import { getRdt } from "subs";
import { SnapshotApiResponse } from "Types/api";
import { StakingTokens } from "Types/reducers";
import { formatTokenAmount } from "Utils/format";
import { depositNodeStakingRewards } from "Utils/txSenders";

const ValidatorStaking = () => {
  const hitBalance = useSelector((state) => state.session.hitBalance);
  const fomoBalance = useSelector((state) => state.session.fomoBalance);
  const reddicksBalance = useSelector((state) => state.session.reddicksBalance);
  const balanceLoading = useSelector((state) => state.loadings.balanceLoading);
  const lockedNodeStakingHits = useSelector((state) => state.staking.lockedNodeStakingHits);
  const lockedNodeStakingFomos = useSelector((state) => state.staking.lockedNodeStakingFomos);
  const lockedNodeStakingREDDICKS = useSelector((state) => state.staking.lockedNodeStakingREDDICKS);
  const nodeStakingComponentDataLoading = useSelector(
    (state) => state.loadings.nodeStakingComponentDataLoading
  );

  const verifyAndDistribute = async (
    amount: string,
    tokenSymbol: StakingTokens,
    tokenAddress: string
  ) => {
    const rdtInstance = getRdt();
    if (rdtInstance) {
      rdtInstance.walletApi.dataRequestControl(async ({ proofs }) => {
        const {
          data: { rewardsList, snapshot_state_version },
        } = await axios.post<SnapshotApiResponse>(`${HIT_SERVER_URL}/node-staking/take-snapshot`, {
          proofs,
          reward: +amount,
        });

        dispatch(
          setRewardsModalData({
            amount,
            RewardTokenDistributions: rewardsList,
            tokenSymbol,
            tokenAddress,
            snapshot: snapshot_state_version,
            timestamp: Date.now(),
          })
        );
        (document.getElementById("DistributionModal") as HTMLDialogElement).showModal();

        // reset this so it does not trigger on wallet connect button
        rdtInstance.walletApi.dataRequestControl(async () => {});
      });

      await rdtInstance.walletApi.sendOneTimeRequest(
        DataRequestBuilder.accounts().atLeast(1).withProof()
      );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="min-w-[300px]">
          <InfoTile
            title="Your HIT Balance"
            value={formatTokenAmount(+hitBalance)}
            isLoading={balanceLoading}
            tooltip={hitBalance}
          />
        </div>
        <div className="min-w-[300px]">
          <InfoTile
            title="Your FOMO Balance"
            value={formatTokenAmount(+fomoBalance)}
            isLoading={balanceLoading}
            tooltip={fomoBalance}
          />
        </div>
        <div className="min-w-[300px]">
          <InfoTile
            title="Your REDDICKS Balance"
            value={formatTokenAmount(+reddicksBalance)}
            isLoading={balanceLoading}
            tooltip={reddicksBalance}
          />
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="min-w-[300px]">
          <InfoTile
            title="Total Locked HIT"
            value={formatTokenAmount(+lockedNodeStakingHits)}
            isLoading={nodeStakingComponentDataLoading}
            tooltip={lockedNodeStakingHits}
          />
        </div>
        <div className="min-w-[300px]">
          <InfoTile
            title="Total Locked FOMO"
            value={formatTokenAmount(+lockedNodeStakingFomos)}
            isLoading={nodeStakingComponentDataLoading}
            tooltip={lockedNodeStakingFomos}
          />
        </div>
        <div className="min-w-[300px]">
          <InfoTile
            title="Total Locked REDDICKS"
            value={formatTokenAmount(+lockedNodeStakingREDDICKS)}
            isLoading={nodeStakingComponentDataLoading}
            tooltip={lockedNodeStakingREDDICKS}
          />
        </div>
      </div>
      <GeneralOwnerInterface
        heading="Lock HITs for Future Rewards"
        placeholder="Enter HIT amount to lock"
        balance={hitBalance}
        onButtonClick={async (amount) =>
          await depositNodeStakingRewards(amount, StakingTokens.HIT, HIT_RESOURCE_ADDRESS)
        }
        btnText="Lock HIT tokens"
      />
      <GeneralOwnerInterface
        heading="Lock FOMOs for Future Rewards"
        placeholder="Enter FOMO amount to lock"
        balance={fomoBalance}
        onButtonClick={async (amount) =>
          await depositNodeStakingRewards(amount, StakingTokens.FOMO, FOMO_RESOURCE_ADDRESS)
        }
        btnText="Lock FOMO tokens"
        tokenSymbol={StakingTokens.FOMO}
      />
      <GeneralOwnerInterface
        heading="Lock REDDICKS for Future Rewards"
        placeholder="Enter REDDICKS amount to lock"
        balance={reddicksBalance}
        onButtonClick={async (amount) =>
          await depositNodeStakingRewards(amount, StakingTokens.REDDICKS, REDDICKS_RESOURCE_ADDRESS)
        }
        btnText="Lock REDDICKS tokens"
        tokenSymbol={StakingTokens.REDDICKS}
      />
      <GeneralOwnerInterface
        heading="Take Snapshot and Distribute locked HIT"
        placeholder="Enter HIT amount to distribute"
        balance={lockedNodeStakingHits}
        onButtonClick={async (amount) =>
          await verifyAndDistribute(amount, StakingTokens.HIT, HIT_RESOURCE_ADDRESS)
        }
        btnText="Distribute HIT tokens"
      />
      <GeneralOwnerInterface
        heading="Take Snapshot and Distribute locked FOMO"
        placeholder="Enter FOMO amount to distribute"
        balance={lockedNodeStakingFomos}
        onButtonClick={async (amount) =>
          await verifyAndDistribute(amount, StakingTokens.FOMO, FOMO_RESOURCE_ADDRESS)
        }
        btnText="Distribute FOMO tokens"
        tokenSymbol={StakingTokens.FOMO}
      />
      <GeneralOwnerInterface
        heading="Take Snapshot and Distribute locked REDDICKS"
        placeholder="Enter REDDICKS amount to distribute"
        balance={lockedNodeStakingREDDICKS}
        onButtonClick={async (amount) =>
          await verifyAndDistribute(amount, StakingTokens.REDDICKS, REDDICKS_RESOURCE_ADDRESS)
        }
        btnText="Distribute REDDICKS tokens"
        tokenSymbol={StakingTokens.REDDICKS}
      />
    </div>
  );
};

export default ValidatorStaking;
