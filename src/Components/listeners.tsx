import ApyCacheService from "Classes/apyCache";
import { dispatch, useSelector } from "Store";
import { setBalanceLoading } from "Store/Reducers/loadings";
import { setIsInsufficientBalance } from "Store/Reducers/staking";
import { Tabs } from "Types/reducers";
import {
  fetchBalances,
  fetchRugProofComponentDetails,
  fetchPoolDetails,
  fetchStHITTotalSupply,
  fetchHitFomoData,
  fetchUserWalletBalance,
} from "Utils/fetchers";
import { BN } from "Utils/format";
import { shouldFetchAPYs } from "Utils/judgers";
import { useEffect } from "react";
import { initializeSubscriptions, unsubscribeAll } from "subs";

const Listeners = () => {
  const successTxCount = useSelector((state) => state.session.successTxCount);
  const amount = useSelector((state) => state.staking.amount);
  const walletAddress = useSelector((state) => state.app.walletAddress);
  const currentTab = useSelector((state) => state.staking.currentTab);
  const hitBalance = useSelector((state) => state.session.hitBalance);
  const stHitBalance = useSelector((state) => state.staking.stHitBalance);
  const lastAPYsUpdated = useSelector((state) => state.app.lastAPYsUpdated);

  useEffect(() => {
    initializeSubscriptions();
    return () => {
      unsubscribeAll();
    };
  }, []);

  useEffect(() => {
    fetchHitFomoData();
    fetchRugProofComponentDetails();
  }, []);

  useEffect(() => {
    (async () => {
      await ApyCacheService.loadAPYs();
      if (await shouldFetchAPYs(lastAPYsUpdated)) {
        await ApyCacheService.fetchAllAPYs();
        await ApyCacheService.loadAPYs();
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      dispatch(setBalanceLoading(true));
      await fetchBalances(walletAddress);
      await fetchUserWalletBalance(walletAddress);
      dispatch(setBalanceLoading(false));
    })();
  }, [successTxCount, walletAddress]);

  useEffect(() => {
    dispatch(
      setIsInsufficientBalance(
        new BN(amount).isGreaterThan(currentTab === Tabs.stake ? hitBalance : stHitBalance)
      )
    );
  }, [amount, currentTab, hitBalance, stHitBalance]);

  useEffect(() => {
    fetchPoolDetails();
    const interval = setInterval(async () => {
      await fetchPoolDetails();
    }, 60000);

    return () => clearInterval(interval);
  }, [successTxCount]);

  useEffect(() => {
    fetchStHITTotalSupply();
    const interval = setInterval(async () => {
      await fetchStHITTotalSupply();
    }, 60000);

    return () => clearInterval(interval);
  }, [successTxCount]);

  return <></>;
};

export default Listeners;
