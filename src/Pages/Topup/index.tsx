import { useState } from "react";

import Tabs from "./Components/tabs";
import HitStakingPanel from "./Components/hitStakingPanel";
import ValidatorStaking from "./Components/validatorStaking";
import Listeners from "./Components/listeners";
import { useSelector } from "Store";
import InvestmentFunds from "./Components/investmentFunds";
import HedgeFundAdmin from "./Components/hedgeFundAdmin";

const AdminPanel = () => {
  const [managementType, setStakingType] = useState<
    "Rug Proof" | "Validator" | "Investment Funds" | "Hedge Fund Admin"
  >("Rug Proof");
  const isOwner = useSelector((state) => state.staking.isOwner);

  return true ? (
    <div>
      <Listeners />
      <Tabs stakingType={managementType} setStakingType={setStakingType} />
      {managementType === "Rug Proof" ? (
        <HitStakingPanel />
      ) : managementType === "Validator" ? (
        <ValidatorStaking />
      ) : managementType === "Investment Funds" ? (
        <InvestmentFunds />
      ) : managementType === "Hedge Fund Admin" ? (
        <HedgeFundAdmin />
      ) : null}
    </div>
  ) : null;
};

export default AdminPanel;
