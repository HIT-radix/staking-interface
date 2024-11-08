// import InfoTile from "Components/infoTile";
import { useEffect } from "react";
import { fetchValidatorInfo } from "Utils/fetchers";

const NodeManager = () => {
  useEffect(() => {
    (async () => {
      await fetchValidatorInfo();
    })();
  }, []);

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
