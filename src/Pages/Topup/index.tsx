import { useState } from "react";

import Tabs from "./Components/tabs";
import HitStakingPanel from "./Components/hitStakingPanel";
import ValidatorStaking from "./Components/validatorStaking";
import Listeners from "./Components/listeners";
import { useSelector } from "Store";

const AdminPanel = () => {
  const [stakingType, setStakingType] = useState<"Rug Proof" | "Validator">("Rug Proof");

  const isOwner = useSelector((state) => state.staking.isOwner);

  return isOwner ? (
    <div>
      <Listeners />
      <Tabs stakingType={stakingType} setStakingType={setStakingType} />
      {stakingType === "Rug Proof" ? <HitStakingPanel /> : <ValidatorStaking />}
    </div>
  ) : null;
};

export default AdminPanel;
