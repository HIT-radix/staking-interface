import LoadingSkeleton from "./Components/loadingSkeleton";
import { useSelector } from "Store";
import { getRdt } from "subs";
import Listeners from "./Components/listeners";
import NftImage from "./Components/nftImage";
import Controls from "./Components/controls";

const NodeStaking = () => {
  const walletAddress = useSelector((state) => state.app.walletAddress);
  const findingNodeNFT = useSelector((state) => state.loadings.findingNodeNFT);

  const connectWallet = () => {
    const rdt = getRdt();

    if (rdt) {
      rdt.walletApi.sendRequest();
    }
  };
  return (
    <>
      <Listeners />
      <div
        className="flex flex-col items-center justify-center"
        style={{ minHeight: "calc(100vh - 150px - 50px)" }}
      >
        <div className="max-w-[400px] w-[90vw] flex flex-col items-center justify-center">
          {!walletAddress ? (
            <div className="btn bg-accent " onClick={connectWallet}>
              Connect Wallet
            </div>
          ) : findingNodeNFT ? (
            <LoadingSkeleton />
          ) : (
            <>
              <NftImage />
              <Controls />
            </>
          )}

          {/* 
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
       */}
        </div>
      </div>
    </>
  );
};

export default NodeStaking;
