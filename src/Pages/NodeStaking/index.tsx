import LoadingSkeleton from "./Components/loadingSkeleton";
import { useSelector } from "Store";
import { getRdt } from "subs";
import Listeners from "./Components/listeners";
import NftImage from "./Components/nftImage";
import Controls from "./Components/controls";

const NodeStaking = () => {
  const walletAddress = useSelector((state) => state.app.walletAddress);
  const balanceLoading = useSelector((state) => state.loadings.balanceLoading);

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
          ) : balanceLoading ? (
            <LoadingSkeleton />
          ) : (
            <>
              <NftImage />
              <Controls />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NodeStaking;
