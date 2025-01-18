import { useState } from "react";

import Tabs from "./Components/tabs";
import HitStakingPanel from "./Components/hitStakingPanel";
import ValidatorStaking from "./Components/validatorStaking";
import Listeners from "./Components/listeners";
import { useSelector } from "Store";
import InvestmentFunds from "./Components/investmentFunds";

const AdminPanel = () => {
  const [managementType, setStakingType] = useState<"Rug Proof" | "Validator" | "Investment Funds">(
    "Rug Proof"
  );
  const isOwner = useSelector((state) => state.staking.isOwner);

  return isOwner ? (
    <div>
      <Listeners />
      <Tabs stakingType={managementType} setStakingType={setStakingType} />
      {managementType === "Rug Proof" ? (
        <HitStakingPanel />
      ) : managementType === "Validator" ? (
        <ValidatorStaking />
      ) : managementType === "Investment Funds" ? (
        <InvestmentFunds />
      ) : null}
    </div>
  ) : null;
};

export default AdminPanel;
