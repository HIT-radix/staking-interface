import redirectIcon from "Assets/Images/share.png";
import InfoTile from "Components/infoTile";
import { useSelector } from "Store";
import { withdrawNodeStakingRewards, withdrawNodeStakingRewardsAndStakeHIT } from "Utils/txSenders";
import hitLogo from "Assets/Images/hit-logo.png";
import fomoLogo from "Assets/Images/fomo.png";
import { useEffect, useMemo, useState } from "react";
import { fetchClaimableNodeStakingRewards } from "Utils/fetchers";
import { ClaimableRewardsInfo } from "Types/token";
import { formatTokenAmount } from "Utils/format";
import { InfoTooltip } from "Components/tooltip";

const Controls = () => {
  const [shouldRestakeHIT, setShouldRestakeHIT] = useState(false);

  const NodeStakeNFTid = useSelector((state) => state.staking.NodeStakeNFTid);
  const nodeStakingRewardsLoading = useSelector((state) => state.loadings.nodeStakingRewards);
  const successTxCount = useSelector((state) => state.session.successTxCount);

  const [claimableRewards, setClaimableRewards] = useState<ClaimableRewardsInfo>({
    HIT: "0",
    FOMO: "0",
  });

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

  const handleWithdrawRewards = (nftId: number) => {
    if (shouldRestakeHIT) {
      withdrawNodeStakingRewardsAndStakeHIT(nftId);
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
        Stake to 💚ADDIX+FOMO🐸 Node{" "}
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
                  <img src={hitLogo} alt="hit-logo" className="w-8" />
                  <p className="text-2xl font-bold ml-1" title={claimableRewards.HIT}>
                    $HIT : {formatTokenAmount(Number(claimableRewards.HIT))}
                  </p>
                </div>
                <div className="flex items-center mt-2">
                  <img src={fomoLogo} alt="hit-logo" className="w-8" />
                  <p className="text-2xl font-bold ml-1" title={claimableRewards.FOMO}>
                    $FOMO : {formatTokenAmount(Number(claimableRewards.FOMO))}
                  </p>
                </div>
              </div>
            }
            isLoading={nodeStakingRewardsLoading}
          />
          {allowWithdraw && (
            <>
              <div
                className="btn bg-accent w-full hover:bg-accent mt-1"
                onClick={() => handleWithdrawRewards(NodeStakeNFTid)}
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
                    <InfoTooltip text="Upon withdraw, HITs will be staked while you get stHIT and FOMO in your wallet" />
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
