import { useState } from "react";

import Tabs from "./Components/tabs";
import HitStakingPanel from "./Components/hitStakingPanel";
import ValidatorStaking from "./Components/validatorStaking";
import Listeners from "./Components/listeners";

const AdminPanel = () => {
  const [stakingType, setStakingType] = useState<"Rug Proof" | "Validator">("Rug Proof");

  return true ? (
    <div>
      <Listeners />
      <Tabs stakingType={stakingType} setStakingType={setStakingType} />
      {stakingType === "Rug Proof" ? <HitStakingPanel /> : <ValidatorStaking />}
    </div>
  ) : null;
};

export default AdminPanel;
