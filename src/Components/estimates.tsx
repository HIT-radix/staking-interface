import { useSelector } from "Store";
import { StakingTokens, Tabs } from "Types/reducers";
import { exactAmountInDecimals, formatTokenAmount } from "Utils/format";
import { useMemo } from "react";
import { Tooltip } from "./tooltip";
import { calculateStHitWorthInHIT } from "Utils/judgers";

const Estimates = () => {
  const currentTab = useSelector((state) => state.staking.currentTab);
  const isInSufficientBalance = useSelector((state) => state.staking.isInSufficientBalance);
  const amount = useSelector((state) => +state.staking.amount);
  const stakedHIT = useSelector((state) => +state.staking.stakedHIT);
  const stHIT_totalSupply = useSelector((state) => +state.staking.stHIT_totalSupply);

  const estimatedAmount = useMemo(() => {
    return currentTab === Tabs.stake
      ? stHIT_totalSupply * (amount / stakedHIT)
      : calculateStHitWorthInHIT(amount, stakedHIT, stHIT_totalSupply);
  }, [amount, currentTab, stHIT_totalSupply, stakedHIT]);
  return (
    <div
      className="flex items-center justify-between text-sm mt-1 mb-3"
      style={{ opacity: isInSufficientBalance ? 0 : 1 }}
    >
      <p className="text-secondary">You'll recieve</p>
      <Tooltip text={exactAmountInDecimals(estimatedAmount, 4)}>
        <p className="text-secondary">
          ~ {formatTokenAmount(estimatedAmount)}{" "}
          {currentTab === Tabs.stake ? StakingTokens.StHIT : StakingTokens.HIT}
        </p>
      </Tooltip>
    </div>
  );
};

export default Estimates;
