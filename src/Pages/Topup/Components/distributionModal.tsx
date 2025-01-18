import { useSelector } from "Store";
import { assignNodeStakingRewards } from "Utils/txSenders";
import DialogStructure from "Components/dialogStructure";
import DistributionTable from "./distributionTable";

const DistributionModal = () => {
  const rewardsModalData = useSelector((state) => state.session.rewardsModalData);

  const onDistributeClick = async () => {
    if (!rewardsModalData) return;
    await assignNodeStakingRewards(
      rewardsModalData.amount,
      rewardsModalData.RewardTokenDistributions,
      rewardsModalData.tokenSymbol,
      rewardsModalData.tokenAddress
    );
    (document.getElementById("DistributionModal") as HTMLDialogElement).close();
  };

  return (
    <DialogStructure modalId="DistributionModal">
      {rewardsModalData && (
        <>
          <p className="text-secondary text-xl font-semibold text-center mb-3">
            ${rewardsModalData.tokenSymbol} Rewards Distribution
          </p>
          <DistributionTable distribution={rewardsModalData.RewardTokenDistributions} />
        </>
      )}
      <div className="flex justify-center mt-5">
        <button
          className="btn bg-accent text-base-100 hover:bg-accent/50"
          onClick={onDistributeClick}
        >
          Distribute!
        </button>
      </div>
    </DialogStructure>
  );
};

export default DistributionModal;
