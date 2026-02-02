import { Tabs } from "Components/tabs";
import { Input } from "Components/input";
import { Balance } from "Components/balance";
import { PercentageGroup } from "Components/percentageGroup";
import { ActionBtnStake } from "Components/actionBtnStake";
import Estimates from "Components/estimates";
import StakingInfos from "./stakingInfos";
import investBg from "Assets/Images/investment-bg.jpeg";

const Stake = () => {
  return (
    <div className="relative w-full min-h-screen pb-20">
      {/* Background */}
      <div className="absolute inset-0 fixed">
        <img
          src={investBg}
          alt="Stake Background"
          className="w-full h-full object-cover filter brightness-[0.3]"
        />
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      </div>

      <div
        className="relative z-10 w-full flex flex-col items-center pt-10 px-4"
        style={{ minHeight: "calc(100vh - 90px)" }}
      >
        <div className="w-full max-w-[650px] space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">Staking Dashboard</h1>
            <p className="text-gray-300 mt-2">Manage your HIT staking and rewards</p>
          </div>

          <StakingInfos />

          {/* Interaction Card */}
          <div className="bg-neutral/40 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg w-full">
            <Tabs />

            <div className="py-4 px-4 mt-4 rounded-lg border border-white/5 bg-black/20">
              <Input />
              <Balance />
            </div>

            <div className="mt-4 space-y-4">
              <Estimates />
              <PercentageGroup />
            </div>

            <div className="mt-8">
              <ActionBtnStake />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stake;
