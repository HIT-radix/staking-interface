import { useMemo } from "react";

import { useSelector } from "Store";
import InfoTile from "Components/infoTile";
import { StakingTokens } from "Types/reducers";
import { formatTokenAmount } from "Utils/format";
import { calculateStHitWorthInHIT } from "Utils/judgers";

const yearly_hit_reward = 50000000000; // reward in one week

const StakingInfos = () => {
  const stakedHIT = useSelector((state) => state.staking.stakedHIT);
  const poolDataLoading = useSelector((state) => state.loadings.poolDataLoading);
  const stHitDataLoading = useSelector((state) => state.loadings.stHitDataLoading);
  const lockedHITRewards = useSelector((state) => state.staking.lockedHITRewards);
  const stHIT_totalSupply = useSelector((state) => state.staking.stHIT_totalSupply);
  const componentDataLoading = useSelector((state) => state.loadings.componentDataLoading);

  const apy = useMemo(() => ((yearly_hit_reward / +stakedHIT) * 100).toFixed(2), [stakedHIT]);

  // const apy = useMemo(
  //   () => ((Math.pow(1 + weekly_hit_reward / +stakedHIT, 365 / 7) - 1) * 100).toFixed(2),
  //   [stakedHIT]
  // );

  return (
    <div className="grid grid-cols-12 w-full mb-5 gap-3">
      <div className="col-span-12 sm:col-span-6 flex items-center justify-center ">
        <InfoTile title="Staking APY%" value={apy + "%"} isLoading={poolDataLoading} />
      </div>
      <div className="col-span-12 sm:col-span-6 flex items-center justify-center">
        <InfoTile
          title="Total Staked"
          value={formatTokenAmount(+stakedHIT) + " " + StakingTokens.HIT}
          isLoading={poolDataLoading}
        />
      </div>
      <div className="col-span-12 sm:col-span-6 flex items-center justify-center ">
        <InfoTile
          title="Total Locked Rewards"
          value={formatTokenAmount(+lockedHITRewards) + " " + StakingTokens.HIT}
          isLoading={componentDataLoading}
        />
      </div>
      <div className="col-span-12 sm:col-span-6 flex items-center justify-center ">
        <InfoTile
          title="StHIT Price"
          value={
            calculateStHitWorthInHIT("1", stakedHIT, stHIT_totalSupply).toFixed(4) +
            " " +
            StakingTokens.HIT
          }
          isLoading={poolDataLoading || stHitDataLoading}
        />
      </div>
    </div>
  );
};

export default StakingInfos;
