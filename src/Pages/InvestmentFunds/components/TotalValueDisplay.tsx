import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import SlotMachinEffect from "Components/slotMachinEffect";
import { cn } from "Utils/format";

interface TotalValueDisplayProps {
  totalFunds: string | number;
  loading: boolean;
}

const TotalValueDisplay: React.FC<TotalValueDisplayProps> = ({ totalFunds, loading }) => {
  const [fontSize, setFontSize] = useState(150);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setFontSize(60);
      } else if (width < 640) {
        setFontSize(80);
      } else if (width < 768) {
        setFontSize(100);
      } else if (width < 1024) {
        setFontSize(120);
      } else {
        setFontSize(150);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <p className="text-white text-center text-xl font-bold mb-2">
        <a
          className="underline hover:text-[#8af8c7] transition-colors"
          href="https://dashboard.radixdlt.com/network-staking/validator_rdx1swez5cqmw4d6tls0mcldehnfhpxge0mq7cmnypnjz909apqqjgx6n9"
          target="_blank"
          rel="noreferrer"
        >
          Stake $XRD
        </a>
        , We deploy fees into Radix DeFi, you earn fUSDC{" "}
        <span className="hidden" id="total-market-value">
          {totalFunds}
        </span>
      </p>
      {loading ? (
        <Skeleton
          width={300}
          height={100}
          baseColor="#242d20"
          highlightColor="#A0D490"
          borderRadius="1rem"
        />
      ) : (
        <div
          className="flex items-center justify-center relative"
          style={{
            overflow: "visible",
          }}
        >
          <div className="absolute inset-0 bg-yellow-500/50 blur-[60px] rounded-full" />
          <p
            className="font-paytone font-black relative z-10"
            style={{
              fontSize: fontSize > 100 ? 100 : fontSize > 80 ? 80 : 60,
              color: "white",
              fontWeight: "bold",
              lineHeight: 1,
              marginRight: "10px",
            }}
          >
            $
          </p>
          <SlotMachinEffect
            value={Number(totalFunds)}
            spinSpeedMs={119}
            settleSpeedMs={258}
            digitClassName={cn(
              "text-white font-black font-paytone relative z-10",
              // We use inline style for font size dynamically, but tailwind classes for font weight/family
              // Since slot machine takes digitClassName, we might pass a dynamic class if we had mapped them,
              // but here passing style via effect might be hard.
              // But index.tsx used `text-[100px]` etc.
              // Let's rely on the media queries in tailwind as much as possible,
              // but since we calculate fontSize for the '$', we should try to match.
              // Actually, the original code used tailwind responsive classes for the digits:
              // `text-[100px] md:text-[120px] lg:text-[150px] xl:text-[180px]`
              // I will stick to that instead of state if possible!
              "text-[60px] sm:text-[80px] md:text-[100px] lg:text-[120px] xl:text-[180px]"
            )}
          />
        </div>
      )}
      <div className="text-white/60 text-center font-bold text-xs mt-4">
        *The pot from which XRD stakers redeem their fUSD{" "}
        <a
          href="https://addix-xrd.gitbook.io/usdhit-on-radix/proof-of-usdhit/the-fomo-usdhit-hedge-fund"
          className="underline hover:text-white"
          target="_blank"
          rel="noreferrer"
        >
          Learn more
        </a>
      </div>
    </div>
  );
};

export default TotalValueDisplay;
