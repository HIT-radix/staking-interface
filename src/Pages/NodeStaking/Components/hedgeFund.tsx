import { ChangeEvent, useEffect, useMemo, useState } from "react";

import Decimal from "decimal.js";

import nft from "Assets/Images/fund-unit.jpg";
import InfoTile from "Components/infoTile";
import { HEDGE_FUND_UNIT_RESOURCE_ADDRESS } from "Constants/address";
import { AMOUNT_INPUT_REGEX } from "Constants/misc";
import { useSelector } from "Store";
import { cn, formatDollarAmount, formatTokenAmount } from "Utils/format";
import { validateDecimalPlaces } from "Utils/judgers";
import { getFundUnitValue, withdrawFromHedgeFund } from "Utils/txSenders";
import redirectIcon from "Assets/Images/share.png";

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

    return "Redeem";
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
    <div className="w-full">
      <div
        className="btn bg-accent w-full hover:bg-accent mb-1"
        onClick={() =>
          window.open(
            "https://dashboard.radixdlt.com/network-staking/validator_rdx1swez5cqmw4d6tls0mcldehnfhpxge0mq7cmnypnjz909apqqjgx6n9/stake",
            "_blank"
          )
        }
      >
        Stake XRD to earn FUs, $HIT, $FOMO, $DCKS
        {/* <span>
          <img src={redirectIcon} alt="redirectIcon" className="w-4" />
        </span> */}
      </div>
      <InfoTile
        title="Your Earned Fund Units:"
        value={
          <div className="w-full">
            <div className="flex items-center">
              <img src={nft} alt="hit-logo" className="w-7 h-7 rounded-full" />
              <p className="text-2xl font-bold ml-1" title={earnedFundUnits}>
                {formattedFundUnits}
                <span className="text-lg ml-2 " title={fundUnitPriceTooltip}>
                  ({formattedUsdValue})
                </span>
              </p>
            </div>

            <div className="collapse collapse-arrow mt-2">
              <input type="checkbox" />
              <div className="collapse-title min-h-0 py-0 pl-0 flex items-center text-sm font-semibold opacity-80">
                Redeem Fund Units
              </div>

              <div className="collapse-content px-0">
                <div className="flex flex-col items-center gap-2">
                  <input
                    id="hedge-fund-withdraw"
                    value={withdrawAmount}
                    onChange={handleWithdrawAmountChange}
                    placeholder="0.0"
                    className="input bg-base-200 text-accent focus:outline-none focus:border-accent w-full font-bold"
                    type="text"
                  />
                  <p
                    className="text-sm opacity-80 w-full font-bold"
                    title={formattedWithdrawUsdValue}
                  >
                    ~{formattedWithdrawUsdValue}
                  </p>
                  <button
                    type="button"
                    onClick={handleWithdrawClick}
                    className={cn(
                      "btn bg-base-100 hover:bg-base-200 text-accent w-full border-none",
                      isWithdrawDisabled ? "opacity-50" : ""
                    )}
                    // disabled={isWithdrawDisabled}
                  >
                    {withdrawButtonLabel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
        isLoading={isValueLoading}
        tooltip={fundUnitPriceTooltip}
      />
    </div>
  );
};

export default HedgeFund;
