import { useEffect, useState, useMemo } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import Decimal from "decimal.js";
import Skeleton from "react-loading-skeleton";
import { useFundUnitHistoricValues } from "hooks/apis/snapshots";
import { getFundUnitValue } from "Utils/txSenders";
import nft from "Assets/Images/fund-unit.jpg";

const FundUnitPriceChart = () => {
  const [currentValue, setCurrentValue] = useState<number | null>(null);

  // Use the hook to fetch historic values
  const { data: historicData, isLoading: isHistoricDataLoading } = useFundUnitHistoricValues();

  useEffect(() => {
    let isMounted = true;
    const fetchCurrentValue = async () => {
      try {
        const response = await getFundUnitValue();
        if (isMounted && response?.net_value) {
          const val = new Decimal(response.net_value).toNumber();
          setCurrentValue(val);
        }
      } catch (e) {
        console.error("Failed to fetch current fund unit value", e);
      }
    };

    fetchCurrentValue();

    return () => {
      isMounted = false;
    };
  }, []);

  const seriesData = useMemo(() => {
    if (!historicData) return [];

    return historicData.map((item) => ({
      x: new Date(item.time).getTime(),
      y: parseFloat(item.value),
    }));
  }, [historicData]);

  const options: ApexOptions = {
    chart: {
      id: "fund-unit-price-chart",
      type: "area",
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      background: "transparent",
    },
    colors: ["#A0D490"], // Matching the accent/highlight color from skeleton
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#ffffff",
          fontFamily: "inherit",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => value.toFixed(4),
        style: {
          colors: "#ffffff",
          fontFamily: "inherit",
        },
      },
    },
    grid: {
      borderColor: "rgba(255,255,255,0.1)",
      strokeDashArray: 4,
    },
    theme: {
      mode: "dark",
    },
    tooltip: {
      theme: "dark",
      x: {
        format: "dd MMM yyyy",
      },
    },
  };

  const series = [
    {
      name: "Fund Unit Price",
      data: seriesData,
    },
  ];

  if (isHistoricDataLoading) {
    return (
      <div className="bg-accent/10 rounded-xl p-4 w-full h-[350px] flex items-center justify-center">
        <Skeleton baseColor="#242d20" highlightColor="#A0D490" width="100%" height="80%" />
      </div>
    );
  }

  return (
    <div className="bg-neutral/40 backdrop-blur-md rounded-xl p-5 w-full border border-white/10 shadow-lg">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-xl font-bold text-white opacity-90">Fund Unit Performance</h3>
        <div className="text-right">
          <span className="text-sm opacity-70 block text-white">Current NAV</span>
          <div className="flex items-center gap-2">
            <img src={nft} alt="hit-logo" className="w-7 h-7 rounded-full" />
            <span className="text-2xl font-bold text-accent whitespace-nowrap">
              ${currentValue?.toFixed(4) ?? "-"}
            </span>
          </div>
        </div>
      </div>
      <div className="w-full h-[300px]">
        <Chart options={options} series={series} type="area" height="100%" />
      </div>
    </div>
  );
};

export default FundUnitPriceChart;
