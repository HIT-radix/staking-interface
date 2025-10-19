import { ChangeEvent, useEffect, useMemo, useState } from "react";

import Decimal from "decimal.js";

import nft from "Assets/Images/nft.jpg";
import InfoTile from "Components/infoTile";
import { HEDGE_FUND_UNIT_RESOURCE_ADDRESS } from "Constants/address";
import { AMOUNT_INPUT_REGEX } from "Constants/misc";
import { useSelector } from "Store";
import { cn, formatDollarAmount, formatTokenAmount } from "Utils/format";
import { validateDecimalPlaces } from "Utils/judgers";
import { getFundUnitValue, withdrawFromHedgeFund } from "Utils/txSenders";

const HedgeFund = () => {
  const earnedFundUnits = useSelector(
    (state) => state.session.userWallet.fungible?.[HEDGE_FUND_UNIT_RESOURCE_ADDRESS]?.amount || "0"
  );
  const walletAddress = useSelector((state) => state.app.walletAddress);
  const txInProgress = useSelector((state) => state.loadings.txInProgress);

  const [isValueLoading, setIsValueLoading] = useState(true);
  const [fundUnitUsdValue, setFundUnitUsdValue] = useState<Decimal | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchFundUnitValue = async () => {
      setIsValueLoading(true);
      try {
        const response = await getFundUnitValue();
        if (!isMounted) return;

        if (response?.net_value) {
          setFundUnitUsdValue(new Decimal(response.net_value));
        } else {
          setFundUnitUsdValue(null);
        }
      } catch (error) {
        if (isMounted) {
          setFundUnitUsdValue(null);
        }
      } finally {
        if (isMounted) {
          setIsValueLoading(false);
        }
      }
    };

    fetchFundUnitValue();

    return () => {
      isMounted = false;
    };
  }, []);

  const earnedFundUnitsDecimal = useMemo(() => {
    try {
      return new Decimal(earnedFundUnits || "0");
    } catch (error) {
      return new Decimal(0);
    }
  }, [earnedFundUnits]);

  const totalFundUnitUsdValue = useMemo(() => {
    if (!fundUnitUsdValue) {
      return null;
    }

    try {
      return fundUnitUsdValue.mul(earnedFundUnitsDecimal);
    } catch (error) {
      return null;
    }
  }, [earnedFundUnitsDecimal, fundUnitUsdValue]);

  const formattedUsdValue = useMemo(() => {
    if (!fundUnitUsdValue) {
      return "-";
    }

    const usdValue = totalFundUnitUsdValue ?? new Decimal(0);
    const usdNumber = usdValue.toNumber();
    return formatDollarAmount(Number.isFinite(usdNumber) ? usdNumber : 0);
  }, [fundUnitUsdValue, totalFundUnitUsdValue]);

  const fundUnitPriceTooltip = useMemo(() => {
    if (!fundUnitUsdValue) {
      return undefined;
    }

    const perUnitNumber = fundUnitUsdValue.toNumber();
    return `Per fund unit: ${formatDollarAmount(
      Number.isFinite(perUnitNumber) ? perUnitNumber : 0
    )}`;
  }, [fundUnitUsdValue]);

  const formattedFundUnits = useMemo(() => {
    const numericEarnedUnits = earnedFundUnitsDecimal.toNumber();
    return formatTokenAmount(Number.isFinite(numericEarnedUnits) ? numericEarnedUnits : 0);
  }, [earnedFundUnitsDecimal]);

  const normalizedWithdrawAmount = useMemo(() => {
    if (!withdrawAmount) {
      return "";
    }

    if (withdrawAmount.endsWith(".")) {
      return withdrawAmount.slice(0, -1);
    }

    return withdrawAmount;
  }, [withdrawAmount]);

  const withdrawAmountDecimal = useMemo(() => {
    if (!normalizedWithdrawAmount) {
      return new Decimal(0);
    }

    try {
      return new Decimal(normalizedWithdrawAmount);
    } catch (error) {
      return new Decimal(0);
    }
  }, [normalizedWithdrawAmount]);

  const isAmountGreaterThanBalance = useMemo(() => {
    return withdrawAmountDecimal.gt(earnedFundUnitsDecimal);
  }, [earnedFundUnitsDecimal, withdrawAmountDecimal]);

  const withdrawUsdValue = useMemo(() => {
    if (!fundUnitUsdValue) {
      return null;
    }

    try {
      return fundUnitUsdValue.mul(withdrawAmountDecimal);
    } catch (error) {
      return null;
    }
  }, [fundUnitUsdValue, withdrawAmountDecimal]);

  const formattedWithdrawUsdValue = useMemo(() => {
    if (!fundUnitUsdValue) {
      return "-";
    }

    const usdValue = withdrawUsdValue ?? new Decimal(0);
    const usdNumber = usdValue.toNumber();

    return formatDollarAmount(Number.isFinite(usdNumber) ? usdNumber : 0);
  }, [fundUnitUsdValue, withdrawUsdValue]);

  const isWithdrawDisabled = useMemo(() => {
    return (
      txInProgress || !walletAddress || withdrawAmountDecimal.lte(0) || isAmountGreaterThanBalance
    );
  }, [isAmountGreaterThanBalance, txInProgress, walletAddress, withdrawAmountDecimal]);

  const withdrawButtonLabel = useMemo(() => {
    if (!walletAddress) {
      return "Connect Wallet";
    }

    if (txInProgress) {
      return "Processing...";
    }

    if (!withdrawAmount || withdrawAmountDecimal.lte(0)) {
      return "Enter an amount";
    }

    if (isAmountGreaterThanBalance) {
      return "Insufficient balance";
    }

    return "Withdraw";
  }, [
    isAmountGreaterThanBalance,
    txInProgress,
    walletAddress,
    withdrawAmount,
    withdrawAmountDecimal,
  ]);

  const handleWithdrawAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.trim();

    if (!text) {
      setWithdrawAmount("");
      return;
    }

    if (text.match(AMOUNT_INPUT_REGEX)) {
      if (validateDecimalPlaces(text, 18)) {
        setWithdrawAmount(text);
      }
    } else {
      setWithdrawAmount("");
    }
  };

  const handleWithdrawClick = async () => {
    if (isWithdrawDisabled || !normalizedWithdrawAmount) {
      return;
    }

    const success = await withdrawFromHedgeFund(normalizedWithdrawAmount);

    if (success) {
      setWithdrawAmount("");
    }
  };

  return (
    <div className="w-full mb-4">
      <InfoTile
        title="Your Earned Fund Units:"
        value={
          <div>
            <div className="flex items-center">
              <img src={nft} alt="hit-logo" className="w-7 h-7 rounded-full" />
              <p className="text-2xl font-bold ml-1" title={earnedFundUnits}>
                {formattedFundUnits}
                <span className="text-lg ml-2 " title={fundUnitPriceTooltip}>
                  ({formattedUsdValue})
                </span>
              </p>
            </div>
          </div>
        }
        isLoading={isValueLoading}
        tooltip={fundUnitPriceTooltip}
      />
      <div className="mt-6">
        <label className="text-secondary text-sm font-semibold" htmlFor="hedge-fund-withdraw">
          Withdraw Fund Units
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2">
          <input
            id="hedge-fund-withdraw"
            value={withdrawAmount}
            onChange={handleWithdrawAmountChange}
            placeholder="0.0"
            className="input bg-base-200 text-accent focus:outline-none focus:border-accent flex-1"
            type="text"
          />
          <button
            type="button"
            onClick={handleWithdrawClick}
            className={cn(
              "btn bg-accent hover:bg-accent text-base-100 w-full sm:w-auto",
              isWithdrawDisabled ? "text-white bg-accent/30 hover:bg-accent/30" : ""
            )}
            // disabled={isWithdrawDisabled}
          >
            {withdrawButtonLabel}
          </button>
        </div>
        <p className="text-secondary text-sm mt-2" title={formattedWithdrawUsdValue}>
          ~{formattedWithdrawUsdValue}
        </p>
        {isAmountGreaterThanBalance && withdrawAmountDecimal.gt(0) ? (
          <p className="text-error text-xs mt-1">Insufficient fund units available.</p>
        ) : null}
      </div>
    </div>
  );
};

export default HedgeFund;
