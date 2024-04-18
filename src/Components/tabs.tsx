import { dispatch, useSelector } from "Store";
import { setAmount, setCurrentTab, setPercentage } from "Store/Reducers/staking";
import { Percentage, Tabs as TabsType } from "Types/reducers";

const CommonClass = "tab text-primary font-semibold w-1/2 rounded h-[unset]";

export const Tabs = () => {
  const { currentTab } = useSelector((state) => state.staking);
  const changeTab = (tab: TabsType) => {
    dispatch(setCurrentTab(tab));
    dispatch(setPercentage(Percentage._0));
    dispatch(setAmount(""));
  };
  return (
    <div className="mb-3 bg-base-200 px-1.5 py-1.5 rounded">
      <div
        className={`${CommonClass} ${currentTab === TabsType.stake ? "bg-accent" : ""}`}
        onClick={() => changeTab(TabsType.stake)}
      >
        <p
          className={`my-1.5 ${
            currentTab === TabsType.stake ? "tab-active text-primar" : "text-secondary"
          }`}
        >
          Stake
        </p>
      </div>
      <div
        className={`${CommonClass} ${currentTab === TabsType.unstake ? "bg-accent" : ""}`}
        onClick={() => changeTab(TabsType.unstake)}
      >
        <p
          className={`my-1.5 ${
            currentTab === TabsType.unstake ? "tab-active text-primary" : "text-secondary"
          }`}
        >
          Unstake
        </p>
      </div>
    </div>
  );
};
