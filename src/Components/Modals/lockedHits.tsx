import InfoTile from "Components/infoTile";
import { TOTAL_HIT_SUPPLY } from "Constants/misc";
import { useSelector } from "Store";
import { StakingTokens } from "Types/reducers";
import { calculatePercentage, formatTokenAmount } from "Utils/format";
import shareIcon from "Assets/Images/share.png";
import { useMemo } from "react";

const LockedHitsModal = () => {
  const lockedHITRewards = useSelector((state) => state.staking.lockedHITRewards);
  const stakedHIT = useSelector((state) => state.staking.stakedHIT);
  const poolDataLoading = useSelector((state) => state.loadings.poolDataLoading);
  const rugProofComponentDataLoading = useSelector(
    (state) => state.loadings.rugProofComponentDataLoading
  );

  const totalLockedPercentage = useMemo(
    () => calculatePercentage(+lockedHITRewards + +stakedHIT, TOTAL_HIT_SUPPLY),
    [lockedHITRewards, stakedHIT]
  );
  return (
    <dialog id="my_modal_2" className="modal">
      <div className="modal-box bg-base-200 border-2 border-white">
        <p className="text-white text-center mb-2 text-5xl font-light">{totalLockedPercentage}</p>
        <p className="text-white text-center mb-3 text-lg font-semibold">HITs Locked 🔒</p>
        <div className="flex flex-col gap-y-3">
          <InfoTile
            title="Rug Proof Staking - Locked Rewards"
            value={
              <div className="flex items-center justify-between">
                <p className="flex items-center border-b-2 border-b-primary border-spacing-0 cursor-pointer text-sm sm:text-lg">
                  Tx <img className="w-3 h-3" src={shareIcon} alt="shareIcon" />
                </p>
                <p className="text-xl sm:2text-xl md:text-3xl">
                  {formatTokenAmount(+lockedHITRewards) + " " + StakingTokens.HIT}
                </p>
                <p className="text-xl sm:2text-xl md:text-3xl">
                  {calculatePercentage(+lockedHITRewards, TOTAL_HIT_SUPPLY)}
                </p>
              </div>
            }
            isLoading={rugProofComponentDataLoading}
          />
          <InfoTile
            title="Rug Proof Staking - Staked HITS"
            value={
              <div className="flex items-center justify-between">
                <p className="flex items-center border-b-2 border-b-primary border-spacing-0 text-sm sm:text-lg opacity-0">
                  Tx <img className="w-3 h-3" src={shareIcon} alt="shareIcon" />
                </p>
                <p className="text-xl sm:2text-xl md:text-3xl">
                  {formatTokenAmount(+stakedHIT) + " " + StakingTokens.HIT}
                </p>
                <p className="text-xl sm:2text-xl md:text-3xl">
                  {calculatePercentage(+stakedHIT, TOTAL_HIT_SUPPLY)}
                </p>
              </div>
            }
            isLoading={poolDataLoading}
          />
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default LockedHitsModal;
