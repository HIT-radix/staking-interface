import redirectIcon from "Assets/Images/share.png";
import InfoTile from "Components/infoTile";
import { useSelector } from "Store";
import {
  withdrawAndAirdropNodeStakingRewardsInFomo,
  withdrawNodeStakingRewards,
  withdrawNodeStakingRewardsAndStakeHIT,
} from "Utils/txSenders";
import hitLogo from "Assets/Images/hit-logo.png";
import xUSDCLogo from "Assets/Images/xUSDC.png";
import newfomoLogo from "Assets/Images/fomo-new.jpg";
import reddicksLogo from "Assets/Images/reddicks.png";
import { useEffect, useMemo, useState } from "react";
import { fetchClaimableNodeStakingRewards } from "Utils/fetchers";
import { ClaimableRewardsInfo } from "Types/token";
import { BN, formatDollarAmount, formatTokenAmount } from "Utils/format";
import { InfoTooltip } from "Components/tooltip";

const Controls = () => {
  const [shouldRestakeHIT, setShouldRestakeHIT] = useState(false);
  const [shouldAirdropRewards, setShouldAirdropRewards] = useState(false);

  const hitPrice = useSelector((state) => state.app.hitPrice);
  const fomoPrice = useSelector((state) => state.app.fomoPrice);
  const reddicksPrice = useSelector((state) => state.app.reddicksPrice);
  const NodeStakeNFTid = useSelector((state) => state.staking.NodeStakeNFTid);
  const nodeStakingRewardsLoading = useSelector((state) => state.loadings.nodeStakingRewards);
  const tokenDataLoading = useSelector((state) => state.loadings.tokenDataLoading);
  const successTxCount = useSelector((state) => state.session.successTxCount);

  const [claimableRewards, setClaimableRewards] = useState({
    HIT: "0",
    FOMO: "0",
    xUSDC: "0",
    REDDICKS: "0",
  });

  const showAirdropOption = useMemo(() => NodeStakeNFTid === 48, [NodeStakeNFTid]);

  const hitRewardInUsd = useMemo(() => {
    if (!claimableRewards.HIT || !hitPrice) return undefined;
    return Number(claimableRewards.HIT) === 0
      ? undefined
      : formatDollarAmount(new BN(claimableRewards.HIT).multipliedBy(hitPrice).toNumber());
  }, [claimableRewards.HIT, hitPrice]);

  const fomoRewardInUsd = useMemo(() => {
    if (!claimableRewards.FOMO || !fomoPrice) return undefined;
    return Number(claimableRewards.FOMO) === 0
      ? undefined
      : formatDollarAmount(new BN(claimableRewards.FOMO).multipliedBy(fomoPrice).toNumber());
  }, [claimableRewards.FOMO, fomoPrice]);

  const xUsdcRewardInUsd = useMemo(() => {
    return formatDollarAmount(+claimableRewards.xUSDC);
  }, [claimableRewards.xUSDC]);

  const reddicksRewardInUsd = useMemo(() => {
    if (!claimableRewards.REDDICKS || !reddicksPrice) return undefined;
    return Number(claimableRewards.REDDICKS) === 0
      ? undefined
      : formatDollarAmount(
          new BN(claimableRewards.REDDICKS).multipliedBy(reddicksPrice).toNumber()
        );
  }, [claimableRewards.REDDICKS, reddicksPrice]);

  const claimableRewardsInUsd = useMemo(() => {
    return {
      HIT: hitRewardInUsd,
      FOMO: fomoRewardInUsd,
      oldFOMO: undefined,
      xUSDC: xUsdcRewardInUsd,
      REDDICKS: reddicksRewardInUsd,
    };
  }, [hitRewardInUsd, fomoRewardInUsd, xUsdcRewardInUsd, reddicksRewardInUsd]);

  useEffect(() => {
    (async () => {
      if (NodeStakeNFTid) {
        setClaimableRewards(await fetchClaimableNodeStakingRewards(NodeStakeNFTid));
      }
    })();
  }, [NodeStakeNFTid, successTxCount]);

  const allowWithdraw = useMemo(() => {
    return (
      Number(claimableRewards.HIT) > 0 ||
      Number(claimableRewards.FOMO) > 0 ||
      Number(claimableRewards.REDDICKS) > 0 ||
      Number(claimableRewards.xUSDC) > 0
    );
  }, [claimableRewards]);

  const handleWithdrawRewards = (nftId: number, claimableRewards: ClaimableRewardsInfo) => {
    if (shouldAirdropRewards) {
      withdrawAndAirdropNodeStakingRewardsInFomo(nftId);
    } else if (shouldRestakeHIT) {
      withdrawNodeStakingRewardsAndStakeHIT(nftId, claimableRewards);
    } else {
      withdrawNodeStakingRewards(nftId);
    }
  };

  return (
    <div className="w-full mt-3">
      <div
        className="btn bg-accent w-full hover:bg-accent mb-1"
        onClick={() =>
          window.open(
            "https://dashboard.radixdlt.com/network-staking/validator_rdx1swez5cqmw4d6tls0mcldehnfhpxge0mq7cmnypnjz909apqqjgx6n9/stake",
            "_blank"
          )
        }
      >
        Stake XRD to earn xUSDC, HIT, FOMO & DCKS
        <span>
          <img src={redirectIcon} alt="redirectIcon" className="w-4" />
        </span>
      </div>
      {NodeStakeNFTid && (
        <>
          <InfoTile
            title="Your Claimable Rewards:"
            value={
              <div>
                <div className="flex items-center">
                  <img src={hitLogo} alt="hit-logo" className="w-7 h-7 rounded-full" />
                  <p className="text-2xl font-bold ml-1" title={claimableRewards.HIT}>
                    $HIT : {formatTokenAmount(Number(claimableRewards.HIT))}{" "}
                    {claimableRewardsInUsd.HIT && (
                      <span className="text-lg">({claimableRewardsInUsd.HIT})</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center mt-2">
                  <img src={newfomoLogo} alt="hit-logo" className="w-7 h-7 rounded-full" />
                  <p className="text-2xl font-bold ml-1" title={claimableRewards.FOMO}>
                    $FOMO : {formatTokenAmount(Number(claimableRewards.FOMO))}{" "}
                    {claimableRewardsInUsd.FOMO && (
                      <span className="text-lg">({claimableRewardsInUsd.FOMO})</span>
                    )}{" "}
                  </p>
                </div>
                <div className="flex items-center mt-2">
                  <img src={reddicksLogo} alt="hit-logo" className="w-7 h-7 rounded-full" />
                  <p className="text-2xl font-bold ml-1" title={claimableRewards.REDDICKS}>
                    $REDDICKS : {formatTokenAmount(Number(claimableRewards.REDDICKS))}{" "}
                    {claimableRewardsInUsd.REDDICKS && (
                      <span className="text-lg">({claimableRewardsInUsd.REDDICKS})</span>
                    )}{" "}
                  </p>
                </div>
                {Number(claimableRewards.xUSDC) > 0 ? (
                  <div className="flex items-center mt-2">
                    <img src={xUSDCLogo} alt="hit-logo" className="w-7 h-7 rounded-full" />
                    <p className="text-2xl font-bold ml-1" title={claimableRewards.xUSDC}>
                      $xUSDC : {formatTokenAmount(Number(claimableRewards.xUSDC))}{" "}
                      {claimableRewards.xUSDC && (
                        <span className="text-lg">({claimableRewardsInUsd.xUSDC})</span>
                      )}{" "}
                    </p>
                  </div>
                ) : null}
              </div>
            }
            isLoading={nodeStakingRewardsLoading || tokenDataLoading}
          />
          {allowWithdraw && (
            <>
              <div
                className="btn bg-accent w-full hover:bg-accent mt-1"
                onClick={() => handleWithdrawRewards(NodeStakeNFTid, claimableRewards)}
              >
                Withdraw Rewards 🎉
              </div>
              <div className="flex items-center justify-start mt-0.5">
                <input
                  type="checkbox"
                  className="checkbox checkbox-accent checkbox-sm"
                  onChange={(e) => setShouldRestakeHIT(e.target.checked)}
                />
                <p className="ml-2 text-accent">
                  Withdraw and stake HIT in the same transaction?{" "}
                  <span>
                    <InfoTooltip text="Upon withdraw, HITs will be staked so you get stHIT and FOMO in your wallet" />
                  </span>{" "}
                </p>
              </div>
              {showAirdropOption && (
                <div className="flex items-center justify-start mt-0.5">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-accent checkbox-sm"
                    onChange={(e) => setShouldAirdropRewards(e.target.checked)}
                  />
                  <p className="ml-2 text-accent">
                    Withdraw and airdrop rewards in the same transaction?{" "}
                    <span>
                      <InfoTooltip text="Upon withdraw, rewards will be airdropped directly to fomo stake component." />
                    </span>{" "}
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Controls;
