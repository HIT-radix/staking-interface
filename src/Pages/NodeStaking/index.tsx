import LoadingSkeleton from "./Components/loadingSkeleton";
import { useSelector } from "Store";
import { getRdt } from "subs";
import Listeners from "./Components/listeners";
import Controls from "./Components/controls";
import HedgeFund from "./Components/hedgeFund";
import FundUnitPriceChart from "./Components/fundUnitPriceChart";
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
        className="relative w-full flex flex-col items-center pb-20"
        style={{ minHeight: "calc(100vh - 90px)" }}
      >
        {/* Background Image - Absolute to cover content area only */}
        <div className="absolute inset-0 z-0">
          <img
            src={fundUnitBg}
            alt="Invest Background"
            className="w-full h-full object-cover filter brightness-[0.3]"
          />
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl px-4 md:px-6 lg:px-8 pt-6">
          {!walletAddress ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 text-center">
              <div className="bg-black/40 backdrop-blur-sm p-8 rounded-2xl border border-white/10 max-w-lg">
                <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
                  Hedge Fund Node Staking
                </h1>
                <p className="text-lg text-gray-200 mb-8">
                  Connect your wallet to track performance, manage investments, and claim your
                  rewards.
                </p>
                <button
                  className="btn btn-lg bg-accent hover:bg-accent text-accent-content border-none font-bold px-10 shadow-xl w-full"
                  onClick={connectWallet}
                >
                  Connect Wallet
                </button>
              </div>
            </div>
          ) : balanceLoading ? (
            <div className="flex justify-center pt-20">
              <LoadingSkeleton />
            </div>
          ) : (
            <div className="flex flex-col gap-6 w-full">
              {/* Page Title */}
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold text-white opacity-90">
                  My Investment Dashboard
                </h1>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Main Chart Area */}
                <div className="xl:col-span-2">
                  <FundUnitPriceChart />
                </div>

                {/* Right Panel: Actions & Rewards */}
                <div className="flex flex-col gap-6">
                  {/* Investment Card */}
                  <div className="bg-neutral/40 backdrop-blur-md p-5 rounded-xl border border-white/10 shadow-lg">
                    <h2 className="text-lg font-bold text-white mb-4 ml-1 opacity-90">
                      Your Holdings
                    </h2>
                    <HedgeFund />
                  </div>

                  {/* Rewards Card */}
                  <div className="bg-neutral/40 backdrop-blur-md p-5 rounded-xl border border-white/10 shadow-lg">
                    <h2 className="text-lg font-bold text-white mb-4 ml-1 opacity-90">Rewards</h2>
                    <Controls />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NodeStaking;
