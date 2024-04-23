import { useSelector } from "Store";
import { StakingTokens } from "Types/reducers";
import { formatTokenAmount } from "Utils/format";
import { useMemo } from "react";
import Skeleton from "react-loading-skeleton";

const StakingInfos = () => {
  const weekly_hit_reward = 2000;

  const stakedHIT = useSelector((state) => state.staking.stakedHIT);
  const poolDataLoading = useSelector((state) => state.loadings.poolDataLoading);

  const apy = useMemo(
    () => ((Math.pow(1 + weekly_hit_reward / +stakedHIT, 365 / 7) - 1) * 100).toFixed(2),
    [stakedHIT]
  );

  return (
    <div className="grid grid-cols-12 w-full mb-3 sm:mb-12 gap-3">
      <div className="col-span-12 sm:col-span-6 flex items-center justify-center sm:pr-2">
        {+stakedHIT > 0 ? (
          <InfoTile title="Staking APY%" value={apy + "%"} isLoading={poolDataLoading} />
        ) : null}
      </div>
      <div className="col-span-12 sm:col-span-6 flex items-center justify-center sm:pl-2">
        {+stakedHIT > 0 ? (
          <InfoTile
            title="Total Staked"
            value={formatTokenAmount(+stakedHIT) + " " + StakingTokens.HIT}
            isLoading={poolDataLoading}
          />
        ) : null}
      </div>
    </div>
  );
};

const InfoTile = ({
  title,
  value,
  isLoading,
}: {
  title: string;
  value: string | number;
  isLoading: boolean;
}) => {
  return (
    <div className="bg-accent rounded-lg px-3 py-2 w-full">
      <p className="font-semibold text-sm opacity-80">{title}</p>
      {isLoading ? (
        <Skeleton
          baseColor="#242d20"
          highlightColor="#A0D490"
          width="50%"
          style={{ opacity: 0.5 }}
          height={30}
        />
      ) : (
        <p className="text-4xl mt-2">{value}</p>
      )}
    </div>
  );
};

export default StakingInfos;
