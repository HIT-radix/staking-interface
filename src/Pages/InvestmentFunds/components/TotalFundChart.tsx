import { useMemo } from "react";
import Chart from "react-apexcharts";
import Skeleton from "react-loading-skeleton";
import { useTotalFundHistoricValues } from "hooks/apis/snapshots";
import { formatDollarAmount } from "Utils/format";

const TotalFundChart = () => {
  const { data: historicData, isLoading } = useTotalFundHistoricValues();

  const chartData = useMemo(() => {
    if (!historicData) return [];
    return historicData
      .map((item) => ({
        x: new Date(item.time).getTime(),
        y: Number(item.value),
      }))
      .sort((a, b) => a.x - b.x);
  }, [historicData]);

  if (isLoading) {
    return (
      <div className="w-full h-[350px] mb-4">
        <Skeleton
          height="100%"
          baseColor="#242d20"
          highlightColor="#A0D490"
          borderRadius="0.75rem"
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-neutral/40 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-lg mb-4">
      <h3 className="text-white text-lg font-bold mb-4">Total Fund Value History</h3>
      <div className="w-full h-[350px]">
        <Chart
          type="area"
          height="100%"
          width="100%"
          series={[
            {
              name: "Total Fund Value",
              data: chartData,
            },
          ]}
          options={{
            chart: {
              type: "area",
              toolbar: { show: false },
              background: "transparent",
              fontFamily: "inherit",
            },
            theme: { mode: "dark" },
            stroke: { curve: "smooth", width: 2, colors: ["#8af8c7"] },
            fill: {
              type: "gradient",
              gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.05,
                stops: [0, 100],
              },
              colors: ["#8af8c7"],
            },
            dataLabels: { enabled: false },
            xaxis: {
              type: "datetime",
              tooltip: { enabled: false },
              axisBorder: { show: false },
              axisTicks: { show: false },
              labels: { style: { colors: "#aaa" } },
            },
            yaxis: {
              labels: {
                formatter: (val) => formatDollarAmount(val, 0),
                style: { colors: "#aaa" },
              },
            },
            grid: {
              borderColor: "#ffffff20",
              strokeDashArray: 5,
              xaxis: { lines: { show: false } },
            },
            tooltip: {
              theme: "dark",
              y: {
                formatter: (val) => formatDollarAmount(val),
              },
            },
            colors: ["#8af8c7"],
          }}
        />
      </div>
    </div>
  );
};

export default TotalFundChart;
