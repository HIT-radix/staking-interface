import { useMemo } from "react";

import { StakingTokens, Tabs, Tabs as TabsType } from "Types/reducers";
import { useSelector } from "Store";
import { BtnCSS } from "Constants/css";
// import CachedService from "Classes/cachedService";
// import { STHIT_RESOURCE_ADDRESS, HIT_RESOURCE_ADDRESS } from "Constants/address";
// import { parseUnits } from "Utils/format";
// import { ConfirmationModal } from "./ConfirmationModal";
import { getSelectedBalance } from "Utils/fetchers";
// import { MeshTransaction } from "Utils/program";

export const ActionBtnStake = () => {
  const amount = useSelector((state) => state.staking.amount);
  const currentTab = useSelector((state) => state.staking.currentTab);
  const isInSufficientBalance = useSelector((state) => state.staking.isInSufficientBalance);

  const txInProgress = useSelector((state) => state.loadings.txInProgress);

  const isDisabled = useMemo(
    () =>
      txInProgress || isInSufficientBalance || getSelectedBalance() === 0 || Number(amount) === 0,
    [txInProgress, isInSufficientBalance, amount]
  );

  const handleClick = () => {
    if (!isDisabled) {
      // handle stake/unstake function
      // (document.getElementById("ConfirmationModal_stake_Id") as HTMLDialogElement).showModal();
    }
  };

  const handleActionBtn = async () => {};
  return (
    <div
      onClick={handleClick}
      className={`${BtnCSS} ${
        false ? "cursor-not-allowed opacity-30" : "cursor-pointer opacity-100"
      }`}
    >
      {currentTab === TabsType.stake ? "Stake " : currentTab === TabsType.unstake ? "Unstake " : ""}
    </div>
  );
};
