import { Tabs } from "Components/tabs";
import { Input } from "Components/input";
import { Balance } from "Components/balance";
import { PercentageGroup } from "Components/percentageGroup";
import { ActionBtnStake } from "Components/actionBtnStake";

const Stake = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col justify-between bg-base-content text-primary p-6 w-[95vw] max-w-[650px] rounded-lg mt-20">
        <div className="w-full">
          <Tabs />
          <div className="bg-base-200 py-4 px-4 mt-3 rounded-lg">
            <Input />
            <Balance />
          </div>
          {/* {isInSufficientBalance ? (
          <div className="text-error text-xs font-semibold text-end mt-2">Insufficient Balance</div>
        ) : null} */}
          <PercentageGroup />
        </div>
        <ActionBtnStake />
      </div>
    </div>
  );
};

export default Stake;
