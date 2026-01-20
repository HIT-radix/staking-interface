import LoadingSkeleton from "./Components/loadingSkeleton";
import { useSelector } from "Store";
import { getRdt } from "subs";
import Listeners from "./Components/listeners";
import Controls from "./Components/controls";
import HedgeFund from "./Components/hedgeFund";
import fundUnitBg from "Assets/Images/fund-unit.jpg";

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
        className="relative flex flex-col items-center justify-center"
        style={{ minHeight: "calc(100vh - 150px - 50px)" }}
      >
        <img
          src={fundUnitBg}
          alt="Invest Background"
          className="absolute inset-0 w-full h-[85vh] object-cover filter brightness-50 opacity-30 z-0"
        />
        <div className="relative max-w-[400px] w-[90vw] flex flex-col items-center justify-center z-1">
          {!walletAddress ? (
            <div className="btn bg-accent " onClick={connectWallet}>
              Connect Wallet
            </div>
          ) : balanceLoading ? (
            <LoadingSkeleton />
          ) : (
            <>
              <HedgeFund />
              {/* <NftImage /> */}
              <Controls />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NodeStaking;
