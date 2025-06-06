import { useMemo } from "react";
import { ArrowRight, Camera, Save } from "lucide-react";
import axios from "axios";
import { DataRequestBuilder } from "@radixdlt/radix-dapp-toolkit";

import GeneralOwnerInterface from "Components/generalOwnerInterface";
import { StakingTokens } from "Types/reducers";
import { getRdt } from "subs";
import { SnapshotApiResponse } from "Types/api";
import { HIT_SERVER_URL } from "Constants/endpoints";
import { incrementSuccessTxCount, setRewardsModalData } from "Store/Reducers/session";
import { XUSDC_RESOURCE_ADDRESS } from "Constants/address";
import { dispatch, useSelector } from "Store";
import SnapshotsTable from "./snapshotsTable";
import { depositNodeStakingRewards } from "Utils/txSenders";
import { calculateAvgShareOfSnapshots, formatTokenAmount } from "Utils/format";
import InfoTile from "Components/infoTile";

const InvestmentFunds = () => {
  const selectedRows = useSelector((state) => state.session.selectedSnapshots);
  const xusdcBalance = useSelector((state) => state.session.xusdcBalance);
  const balanceLoading = useSelector((state) => state.loadings.balanceLoading);
  const nodeStakingComponentDataLoading = useSelector(
    (state) => state.loadings.nodeStakingComponentDataLoading
  );
  const lockedNodeStakingxUSDCs = useSelector((state) => state.staking.lockedNodeStakingxUSDCs);

  const takeSnapshot = async () => {
    const rdtInstance = getRdt();
    if (rdtInstance) {
      rdtInstance.walletApi.dataRequestControl(async ({ proofs }) => {
        const {
          data: { rewardsList, snapshot_state_version },
        } = await axios.post<SnapshotApiResponse>(
          `${HIT_SERVER_URL}/node-staking/take-n-save-snapshot`,
          {
            proofs,
            reward: 1,
          }
        );

        dispatch(
          setRewardsModalData({
            amount: "1",
            RewardTokenDistributions: rewardsList,
            tokenSymbol: StakingTokens.XUSDC,
            tokenAddress: XUSDC_RESOURCE_ADDRESS,
            snapshot: snapshot_state_version,
            timestamp: Date.now(),
          })
        );
        dispatch(incrementSuccessTxCount());
        (document.getElementById("SnapshotModal") as HTMLDialogElement).showModal();

        // reset this so it does not trigger on wallet connect button
        rdtInstance.walletApi.dataRequestControl(async () => {});
      });

      await rdtInstance.walletApi.sendOneTimeRequest(
        DataRequestBuilder.accounts().atLeast(1).withProof()
      );
    }
  };

  const enableDistribution = useMemo(() => selectedRows.length > 0, [selectedRows]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="min-w-[300px]">
            <InfoTile
              title="Your xUSDC Balance"
              value={formatTokenAmount(+xusdcBalance)}
              isLoading={balanceLoading}
              tooltip={xusdcBalance}
            />
          </div>
          <div className="min-w-[300px]">
            <InfoTile
              title="Total Locked xUSDCs"
              value={formatTokenAmount(+lockedNodeStakingxUSDCs)}
              isLoading={nodeStakingComponentDataLoading}
              tooltip={lockedNodeStakingxUSDCs}
            />
          </div>
        </div>
      </div>

      <div className="btn btn-accent mb-6 mt-3" onClick={takeSnapshot}>
        Take & Save Snapshot <Camera /> <ArrowRight /> <Save />
      </div>
      <GeneralOwnerInterface
        heading="Lock xUSDC for Future Rewards"
        placeholder="Enter xUSDC amount to lock"
        balance={xusdcBalance}
        onButtonClick={async (amount) =>
          await depositNodeStakingRewards(amount, StakingTokens.XUSDC, XUSDC_RESOURCE_ADDRESS)
        }
        btnText="Lock xUSDC tokens"
        tokenSymbol={StakingTokens.XUSDC}
      />
      <div
        onClick={() => {
          if (!enableDistribution) {
            alert("Please select a snapshot to distribute xUSDC");
          }
        }}
      >
        <div className={enableDistribution ? "" : "opacity-40 pointer-events-none "}>
          <GeneralOwnerInterface
            heading="Distribute locked xUSDC"
            placeholder="Enter xUSDC amount to distribute"
            balance={"9999999"}
            onButtonClick={async (amount) => await calculateAvgShareOfSnapshots(amount)}
            btnText="Distribute xUSDC"
            tokenSymbol={StakingTokens.XUSDC}
          />
        </div>
      </div>
      <div className="w-[95vw] max-w-[700px]">
        <SnapshotsTable />
      </div>
    </div>
  );
};

export default InvestmentFunds;
