import { DataRequestBuilder } from "@radixdlt/radix-dapp-toolkit";
import axios from "axios";
import GeneralOwnerInterface from "Components/generalOwnerInterface";
import InfoTile from "Components/infoTile";
import { FOMO_RESOURCE_ADDRESS, HIT_RESOURCE_ADDRESS } from "Constants/address";
import { HIT_SERVER_URL } from "Constants/endpoints";
import { useSelector } from "Store";
import { getRdt } from "subs";
import { StakingTokens } from "Types/reducers";
import { RewardTokenDistribution } from "Types/token";
import { formatTokenAmount } from "Utils/format";
import { assignNodeStakingRewards, depositNodeStakingRewards } from "Utils/txSenders";

const ValidatorStaking = () => {
  const hitBalance = useSelector((state) => state.session.hitBalance);
  const fomoBalance = useSelector((state) => state.session.fomoBalance);
  const balanceLoading = useSelector((state) => state.loadings.balanceLoading);
  const lockedNodeStakingHits = useSelector((state) => state.staking.lockedNodeStakingHits);
  const lockedNodeStakingFomos = useSelector((state) => state.staking.lockedNodeStakingFomos);
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
        const { data: rewardTokenDistributions } = await axios.post<RewardTokenDistribution[]>(
          `${HIT_SERVER_URL}/node-staking/take-snapshot`,
          { proofs, reward: +amount }
          // { proofs, reward: 1_530_000_000 }
        );

        console.log("rewards", rewardTokenDistributions);
        await assignNodeStakingRewards(amount, rewardTokenDistributions, tokenSymbol, tokenAddress);

        // window.alert(`Person is ${data.valid}`);

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
          />
        </div>
        <div className="min-w-[300px]">
          <InfoTile
            title="Your FOMO Balance"
            value={formatTokenAmount(+fomoBalance)}
            isLoading={balanceLoading}
          />
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="min-w-[300px]">
          <InfoTile
            title="Total Locked HIT"
            value={formatTokenAmount(+lockedNodeStakingHits)}
            isLoading={nodeStakingComponentDataLoading}
          />
        </div>
        <div className="min-w-[300px]">
          <InfoTile
            title="Total Locked FOMO"
            value={formatTokenAmount(+lockedNodeStakingFomos)}
            isLoading={nodeStakingComponentDataLoading}
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
      />
    </div>
  );
};

export default ValidatorStaking;
