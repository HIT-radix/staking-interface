import { useEffect } from "react";
import {
  // fetchBotWalletBalance,
  fetchNodeStakingComponentDetails,
} from "Utils/fetchers";

const Listeners = () => {
  useEffect(() => {
    fetchNodeStakingComponentDetails();
    // fetchBotWalletBalance();
  }, []);

  return <></>;
};

export default Listeners;
