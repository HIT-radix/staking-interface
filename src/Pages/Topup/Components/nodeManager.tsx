import InfoTile from "Components/infoTile";
import React from "react";

const NodeManager = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="min-w-[300px]">
        {/* <InfoTile
          title="Your HIT Balance"
          value={formatTokenAmount(+hitBalance)}
          isLoading={balanceLoading}
          tooltip={hitBalance}
        /> */}
      </div>
    </div>
  );
};

export default NodeManager;
