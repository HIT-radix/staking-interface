import redirectIcon from "Assets/Images/share.png";
import InfoTile from "Components/infoTile";
import { useSelector } from "Store";
import { withdrawNodeStakingRewards, withdrawNodeStakingRewardsAndStakeHIT } from "Utils/txSenders";
import hitLogo from "Assets/Images/hit-logo.png";
import xUSDTLogo from "Assets/Images/xUSDT.png";
import newfomoLogo from "Assets/Images/fomo-new.jpg";
import { useEffect, useMemo, useState } from "react";
import { fetchClaimableNodeStakingRewards } from "Utils/fetchers";
import { ClaimableRewardsInfo } from "Types/token";
import { BN, formatDollarAmount, formatTokenAmount } from "Utils/format";
import { InfoTooltip } from "Components/tooltip";

const Controls = () => {
  const [shouldRestakeHIT, setShouldRestakeHIT] = useState(false);

  const hitPrice = useSelector((state) => state.app.hitPrice);
  const fomoPrice = useSelector((state) => state.app.fomoPrice);
  const NodeStakeNFTid = useSelector((state) => state.staking.NodeStakeNFTid);
  const nodeStakingRewardsLoading = useSelector((state) => state.loadings.nodeStakingRewards);
  const tokenDataLoading = useSelector((state) => state.loadings.tokenDataLoading);
  const successTxCount = useSelector((state) => state.session.successTxCount);
  const lockedNodeStakingHits = useSelector((state) => state.staking.lockedNodeStakingHits);
  const lockedNodeStakingFomos = useSelector((state) => state.staking.lockedNodeStakingFomos);
  const nodeStakingComponentDataLoading = useSelector(
    (state) => state.loadings.nodeStakingComponentDataLoading
  );

  const [claimableRewards, setClaimableRewards] = useState({
    HIT: "0",
    FOMO: "0",
    XUSDT: "0",
  });

  const claimableRewardsInUsd = useMemo(() => {
    if (claimableRewards.HIT && claimableRewards.FOMO && hitPrice && fomoPrice) {
      let hitInUsd =
        Number(claimableRewards.HIT) === 0
          ? undefined
          : formatDollarAmount(new BN(claimableRewards.HIT).multipliedBy(hitPrice).toNumber());

      let fomoInUsd =
        Number(claimableRewards.FOMO) === 0
          ? undefined
          : formatDollarAmount(new BN(claimableRewards.FOMO).multipliedBy(fomoPrice).toNumber());

      return {
        HIT: hitInUsd,
        FOMO: fomoInUsd,
      };
    }
    return {
      HIT: undefined,
      FOMO: undefined,
      oldFOMO: undefined,
    };
  }, [claimableRewards.HIT, claimableRewards.FOMO, hitPrice, fomoPrice]);

  useEffect(() => {
    (async () => {
      if (NodeStakeNFTid) {
        setClaimableRewards(await fetchClaimableNodeStakingRewards(NodeStakeNFTid));
      }
    })();
  }, [NodeStakeNFTid, successTxCount]);

  const allowWithdraw = useMemo(() => {
    return Number(claimableRewards.HIT) > 0 || Number(claimableRewards.FOMO) > 0;
  }, [claimableRewards]);

  const handleWithdrawRewards = (nftId: number, claimableRewards: ClaimableRewardsInfo) => {
    if (shouldRestakeHIT) {
      withdrawNodeStakingRewardsAndStakeHIT(nftId, claimableRewards);
    } else {
      withdrawNodeStakingRewards(nftId);
    }
  };

  const lockedRewards = useMemo(() => {
    const HITinUSD = new BN(lockedNodeStakingHits).multipliedBy(hitPrice).toNumber();
    const FOMOinUSD = new BN(lockedNodeStakingFomos).multipliedBy(fomoPrice).toNumber();
    // const oldFOMOinUSD = new BN(oldLockedNodeStakingFomos).multipliedBy(fomoPrice).toNumber();
    return {
      HIT: {
        amount: lockedNodeStakingHits,
        inUSD: HITinUSD === 0 ? undefined : formatDollarAmount(HITinUSD),
      },
      FOMO: {
        amount: lockedNodeStakingFomos,
        inUSD: FOMOinUSD === 0 ? undefined : formatDollarAmount(FOMOinUSD),
      },
    };
  }, [hitPrice, lockedNodeStakingFomos, lockedNodeStakingHits, fomoPrice]);

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
        Stake to 💚ADDIX+FOMO🐸 Node{" "}
        <span>
          <img src={redirectIcon} alt="redirectIcon" className="w-4" />
        </span>
      </div>
      <div className="mb-1">
        <InfoTile
          title="Total Locked Rewards in component🔒"
          value={
            <div>
              <div className="flex items-center">
                <img src={hitLogo} alt="hit-logo" className="w-5 h-5 rounded-full" />
                <p className="text-lg font-semibold ml-1" title={lockedRewards.HIT.amount}>
                  $HIT : {formatTokenAmount(+lockedRewards.HIT.amount)}{" "}
                  {lockedRewards.HIT.inUSD && (
                    <span className="text-[16px]">({lockedRewards.HIT.inUSD})</span>
                  )}
                </p>
              </div>
              <div className="flex items-center mt-2">
                <img src={newfomoLogo} alt="hit-logo" className="w-5 h-5 rounded-full" />
                <p className="text-lg font-semibold ml-1" title={lockedRewards.FOMO.amount}>
                  $FOMO : {formatTokenAmount(+lockedRewards.FOMO.amount)}{" "}
                  {lockedRewards.FOMO.inUSD && (
                    <span className="text-[16px]">({lockedRewards.FOMO.inUSD})</span>
                  )}
                </p>
              </div>
            </div>
          }
          isLoading={nodeStakingComponentDataLoading || tokenDataLoading}
          infoTooltipProps={{
            text: "Rewards that are yet to be distributed among Stakers holding above NFT.",
            infoColor: "green",
          }}
        />
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
                {Number(claimableRewards.XUSDT) > 0 ? (
                  <div className="flex items-center mt-2">
                    <img src={xUSDTLogo} alt="hit-logo" className="w-7 h-7 rounded-full" />
                    <p className="text-2xl font-bold ml-1" title={claimableRewards.XUSDT}>
                      $xUSDT : {formatTokenAmount(Number(claimableRewards.XUSDT))}{" "}
                      {claimableRewards.XUSDT && (
                        <span className="text-lg">({claimableRewards.XUSDT})</span>
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
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Controls;
