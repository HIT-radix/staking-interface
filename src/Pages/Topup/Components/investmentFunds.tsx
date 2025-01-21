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
import { XUSDT_RESOURCE_ADDRESS } from "Constants/address";
import { dispatch, useSelector } from "Store";
import SnapshotsTable from "./snapshotsTable";
import { depositNodeStakingRewards } from "Utils/txSenders";
import { calculateAvgShareOfSnapshots, formatTokenAmount } from "Utils/format";
import InfoTile from "Components/infoTile";

const InvestmentFunds = () => {
  const selectedRows = useSelector((state) => state.session.selectedSnapshots);
  const xusdtBalance = useSelector((state) => state.session.xusdtBalance);
  const balanceLoading = useSelector((state) => state.loadings.balanceLoading);
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
            tokenSymbol: StakingTokens.XUSDT,
            tokenAddress: XUSDT_RESOURCE_ADDRESS,
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
              title="Your xUSDT Balance"
              value={formatTokenAmount(+xusdtBalance)}
              isLoading={balanceLoading}
              tooltip={xusdtBalance}
            />
          </div>
          {/* <div className="min-w-[300px]">
            <InfoTile
              title="Total Locked xUSDTs"
              value={formatTokenAmount(0) + " " + StakingTokens.XUSDT}
              isLoading={false}
              tooltip={"0"}
            />
          </div> */}
        </div>
      </div>

      <div className="btn btn-accent mb-6 mt-3" onClick={takeSnapshot}>
        Take & Save Snapshot <Camera /> <ArrowRight /> <Save />
      </div>
      <GeneralOwnerInterface
        heading="Lock xUSDT for Future Rewards"
        placeholder="Enter xUSDT amount to lock"
        balance={xusdtBalance}
        onButtonClick={async (amount) =>
          await depositNodeStakingRewards(amount, StakingTokens.XUSDT, XUSDT_RESOURCE_ADDRESS)
        }
        btnText="Lock xUSDT tokens"
        tokenSymbol={StakingTokens.XUSDT}
      />
      <div
        onClick={() => {
          if (!enableDistribution) {
            alert("Please select a snapshot to distribute xUSDT");
          }
        }}
      >
        <div className={enableDistribution ? "" : "opacity-40 pointer-events-none "}>
          <GeneralOwnerInterface
            heading="Distribute locked xUSDT"
            placeholder="Enter xUSDT amount to distribute"
            balance={"9999999"}
            onButtonClick={async (amount) => await calculateAvgShareOfSnapshots(amount)}
            btnText="Distribute xUSDT"
            tokenSymbol={StakingTokens.XUSDT}
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
