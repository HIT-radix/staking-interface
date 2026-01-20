import { useState } from "react";

import Tabs from "./Components/tabs";
import HitStakingPanel from "./Components/hitStakingPanel";
import ValidatorStaking from "./Components/validatorStaking";
import Listeners from "./Components/listeners";
import { useSelector } from "Store";
import HedgeFundAdmin from "./Components/hedgeFundAdmin";

const AdminPanel = () => {
  const [managementType, setStakingType] = useState<
    "Rug Proof" | "Airdrop Node Rewards" | "Hedge Fund Admin"
  >("Rug Proof");
  const isOwner = useSelector((state) => state.staking.isOwner);

  return isOwner ? (
    <div>
      <Listeners />
      <Tabs stakingType={managementType} setStakingType={setStakingType} />
      {managementType === "Rug Proof" ? (
        <HitStakingPanel />
      ) : managementType === "Airdrop Node Rewards" ? (
        <ValidatorStaking />
      ) : managementType === "Hedge Fund Admin" ? (
        <HedgeFundAdmin />
      ) : null}
    </div>
  ) : null;
};

export default AdminPanel;
