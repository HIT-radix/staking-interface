import { HIT_RESOURCE_ADDRESS } from "Constants/address";
import { StakingTokens } from "Types/reducers";
import {
  assignNodeStakingRewards,
  depositNodeStakingRewards,
  mintNodeStakingRewardsNFTbadge,
  withdrawNodeStakingRewards,
} from "Utils/txSenders";

const NodeStaking = () => {
  return (
    <>
      <div className="btn bg-accent" onClick={mintNodeStakingRewardsNFTbadge}>
        mint new nft
      </div>
      <div
        className="btn bg-accent"
        onClick={() => depositNodeStakingRewards("12", StakingTokens.HIT, HIT_RESOURCE_ADDRESS)}
      >
        Deposit Rewards
      </div>
      <div
        className="btn bg-accent"
        onClick={() =>
          assignNodeStakingRewards(
            "7",
            [{ id: 2, amount: "7" }],
            StakingTokens.HIT,
            HIT_RESOURCE_ADDRESS
          )
        }
      >
        Assign Rewards
      </div>
      <div className="btn bg-accent" onClick={() => withdrawNodeStakingRewards(2)}>
        Withdraw Rewards
      </div>
    </>
  );
};

export default NodeStaking;
