import { useEffect } from "react";

import { useSelector } from "Store";
import { getRdt } from "subs";
import { fetchNodeStakingComponentDetails, findNodeStakeNFT } from "Utils/fetchers";

const Listeners = () => {
  const walletAddress = useSelector((state) => state.app.walletAddress);
  const successTxCount = useSelector((state) => state.session.successTxCount);

  useEffect(() => {
    const rdt = getRdt();
    if (walletAddress && rdt) {
      findNodeStakeNFT(walletAddress);
    }
  }, [walletAddress, successTxCount]);

  useEffect(() => {
    fetchNodeStakingComponentDetails();
  }, []);

  return <></>;
};

export default Listeners;
