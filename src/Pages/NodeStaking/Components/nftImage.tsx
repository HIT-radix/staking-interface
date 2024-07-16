import nft from "Assets/Images/nft.jpg";
import { useSelector } from "Store";
import { mintNodeStakingRewardsNFTbadge } from "Utils/txSenders";

const NftImage = () => {
  const NodeStakeNFTid = useSelector((state) => state.staking.NodeStakeNFTid);
  const txInProgress = useSelector((state) => state.loadings.txInProgress);
  return (
    <div className="relative flex items-center justify-center">
      <div
        className="bg-white p-2 rounded-md relative"
        style={{ filter: `blur(${NodeStakeNFTid ? 0 : 20}px)` }}
      >
        <img src={nft} alt="nft" className="w-full rounded" />
        <p className="text-center mt-2">NFT ID: {NodeStakeNFTid}</p>
      </div>
      {!NodeStakeNFTid && (
        <div className="btn bg-accent absolute" onClick={mintNodeStakingRewardsNFTbadge}>
          {txInProgress ? "Processing..." : "Mint NFT For Rewards"}
        </div>
      )}
    </div>
  );
};

export default NftImage;
