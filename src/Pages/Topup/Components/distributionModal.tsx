import { useSelector } from "Store";
import { assignNodeStakingRewards } from "Utils/txSenders";
import cross from "Assets/Svgs/cross.svg";

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
    <dialog id="DistributionModal" className="modal text-accent">
      <div className="modal-box max-h-[60vh] bg-base-content">
        <div className="flex justify-end mb-2">
          <img
            src={cross}
            alt="cross"
            className="w-3 h-3 cursor-pointer"
            onClick={() =>
              (document.getElementById("DistributionModal") as HTMLDialogElement).close()
            }
          />
        </div>
        {rewardsModalData && (
          <>
            <p className="text-secondary text-xl font-semibold text-center mb-3">
              ${rewardsModalData.tokenSymbol} Rewards Distribution
            </p>
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">NFT Id</th>
                  <th className="px-4 py-2">Share</th>
                </tr>
              </thead>
              <tbody>
                {rewardsModalData.RewardTokenDistributions.map((item) => (
                  <tr key={item.id}>
                    <td className="border px-4 py-2">{item.id}</td>
                    <td className="border px-4 py-2">{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
      </div>
    </dialog>
  );
};

export default DistributionModal;
