import { useEffect, useMemo } from "react";
import Skeleton from "react-loading-skeleton";

import { dispatch, useSelector } from "Store";
import { StakingTokens, Tabs } from "Types/reducers";
import WalletIcon from "Assets/Svgs/wallet.svg";
import { exactAmountInDecimals, formatDollarAmount, formatTokenAmount } from "Utils/format";
import { Tooltip } from "./tooltip";
import { fetchBalances, getSelectedBalance } from "Utils/fetchers";
import { setBalanceLoading } from "Store/Reducers/loadings";

export const Balance = () => {
  const successTxCount = useSelector((state) => state.session.successTxCount);
  const currentTab = useSelector((state) => state.staking.currentTab);
  const hitPrice = useSelector((state) => state.app.hitPrice);
  const walletAddress = useSelector((state) => state.app.walletAddress);
  const balanceLoading = useSelector((state) => state.loadings.balanceLoading);
  const tokenDataLoading = useSelector((state) => state.loadings.tokenDataLoading);

  useEffect(() => {
    (async () => {
      dispatch(setBalanceLoading(true));
      await fetchBalances(walletAddress);
      dispatch(setBalanceLoading(false));
    })();
  }, [successTxCount, walletAddress]);

  const amountToShow = getSelectedBalance();

  const usdPriceToShow = useMemo(() => hitPrice, [hitPrice]);

  const currentToken = useMemo(
    () => (currentTab === Tabs.stake ? StakingTokens.HIT : StakingTokens.StHIT),
    [currentTab]
  );

  return (
    <div className="text-xs flex items-center justify-between">
      <p className="text-secondary">
        Available
        <span className="ml-1 font-semibold">{currentToken}</span>
      </p>
      <span className="flex ml-1 items-center">
        {balanceLoading ? (
          <Skeleton
            baseColor="#242d20"
            highlightColor="#A0D490"
            width="50px"
            style={{ opacity: 0.5 }}
          />
        ) : (
          <>
            <img src={WalletIcon} alt="WalletIcon" className="mb-1" />
            <Tooltip text={exactAmountInDecimals(amountToShow) + " " + currentToken}>
              <p className="font-bold ml-1 text-secondary">{formatTokenAmount(amountToShow)}</p>
            </Tooltip>
            {currentTab === Tabs.stake ? (
              tokenDataLoading ? (
                <Skeleton
                  baseColor="#242d20"
                  highlightColor="#A0D490"
                  width="40px"
                  style={{ opacity: 0.5 }}
                />
              ) : (
                <Tooltip text={"$" + Number((amountToShow * usdPriceToShow).toFixed(4)).toString()}>
                  <span className="ml-1 text-secondary">
                    (~{formatDollarAmount(amountToShow * usdPriceToShow)})
                  </span>
                </Tooltip>
              )
            ) : null}
          </>
        )}{" "}
      </span>
    </div>
  );
};
