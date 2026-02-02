import React from "react";
import Chart from "react-apexcharts";
import Skeleton from "react-loading-skeleton";

interface InvestmentItem {
  platform: string;
  position: string;
  value: string | number;
  [key: string]: any;
}

interface AllocationDonutChartProps {
  investments: InvestmentItem[];
  loading: boolean;
}

const AllocationDonutChart: React.FC<AllocationDonutChartProps> = ({ investments, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <Skeleton
          baseColor="#242d20"
          highlightColor="#A0D490"
          width="100%"
          height="300px"
          style={{ opacity: 0.5, maxWidth: "380px", borderRadius: "50%" }}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center bg-neutral/40 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-lg h-full">
      <div className="w-full max-w-[500px]">
        <Chart
          options={{
            labels: investments.map((item) => `${item.platform} - ${item.position}`),
            dataLabels: {
              formatter: function (val, opts) {
                return Number(val).toFixed(2) + "%";
              },
            },
            legend: {
              show: true,
              position: "bottom",
              labels: { colors: "#FFF" },
              itemMargin: { horizontal: 10, vertical: 5 },
            },
            colors: [
              "#1f3648",
              "#8af8c7",
              "#9f83bc",
              "#571eaf",
              "#66ddfb",
              "#DD8A00",
              "#f8e96d",
              "#F4B400",
              "#A86A2C",
              "#A86A2C",
            ],
            tooltip: {
              enabled: true,
              y: {
                formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
                  // Show value with 2 decimals and a $ sign
                  return `$${Number(value).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`;
                },
                title: {
                  formatter: function (seriesName, opts) {
                    // Show the label as title
                    return seriesName;
                  },
                },
              },
            },
            plotOptions: {
              pie: {
                donut: {
                  labels: {
                    show: true,
                    total: {
                      show: false, // We show total elsewhere
                      showAlways: false,
                      label: "Total",
                      color: "#ffffff",
                    },
                  },
                },
              },
            },
            stroke: { show: false }, // Cleaner look
          }}
          series={investments.map((item) => +item.value)}
          type="donut"
          width="100%"
        />
      </div>
    </div>
  );
};

export default AllocationDonutChart;
