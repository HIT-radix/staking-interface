import { useEffect, useMemo, useState } from "react";

import Decimal from "decimal.js";

import nft from "Assets/Images/nft.jpg";
import InfoTile from "Components/infoTile";
import { HEDGE_FUND_UNIT_RESOURCE_ADDRESS } from "Constants/address";
import { useSelector } from "Store";
import { formatDollarAmount, formatTokenAmount } from "Utils/format";
import { getFundUnitValue } from "Utils/txSenders";

const HedgeFund = () => {
  const earnedFundUnits = useSelector(
    (state) => state.session.userWallet.fungible?.[HEDGE_FUND_UNIT_RESOURCE_ADDRESS]?.amount || "0"
  );

  const [isValueLoading, setIsValueLoading] = useState(true);
  const [fundUnitUsdValue, setFundUnitUsdValue] = useState<Decimal | null>(null);

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
    </div>
  );
};

export default HedgeFund;
