import { Tabs } from "Components/tabs";
import { Input } from "Components/input";
import { Balance } from "Components/balance";
import { PercentageGroup } from "Components/percentageGroup";
import { ActionBtnStake } from "Components/actionBtnStake";
import Estimates from "Components/estimates";
import StakingInfos from "./stakingInfos";

const Stake = () => {
  return (
    <div
      className="flex flex-col items-center justify-center "
      style={{ minHeight: "calc(100vh - 150px)" }}
    >
      <div className="w-[95vw] max-w-[650px]">
        <StakingInfos />
        <div className="flex flex-col justify-between bg-base-content text-primary p-6 w-full rounded-lg ">
          <div className="w-full">
            <Tabs />
            <div className="bg-base-200 py-4 px-4 mt-3 rounded-lg">
              <Input />
              <Balance />
            </div>
            {/* {isInSufficientBalance ? (
          <div className="text-error text-xs font-semibold text-end mt-2">Insufficient Balance</div>
        ) : null} */}
            <Estimates />
            <PercentageGroup />
          </div>
          <ActionBtnStake />
        </div>
      </div>
    </div>
  );
};

export default Stake;
