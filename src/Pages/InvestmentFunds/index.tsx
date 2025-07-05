import { useState, useEffect, useMemo } from "react";
import Chart from "react-apexcharts";
import rootInvestor from "Classes/investments/root";
import surgeInvestor from "Classes/investments/surge";
import weftInvestor from "Classes/investments/weft";
import Skeleton from "react-loading-skeleton";
import { fetchFelixWalletBalance } from "Utils/fetchers";
import fluxInvestor from "Classes/investments/flux";
import investBg from "Assets/Images/investment-bg.jpeg";
import AnimatedNumbers from "react-animated-numbers";
import { formatDollarAmount } from "Utils/format";

type InvestmentBreakdown = {
  asset: string;
  value: string;
  logo: string;
  platform: string;
  position: string;
};

const InvesmentFunds = () => {
  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState<InvestmentBreakdown[]>([]);
  const [fontSize, setFontSize] = useState(150);
  // Store original order of investments for the chart to maintain consistency with the labels
  const [originalInvestments, setOriginalInvestments] = useState<InvestmentBreakdown[]>([]);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const isFetched = await fetchFelixWalletBalance();
        if (isFetched) {
          const allInvestments = await Promise.all([
            weftInvestor.getInvestment(),
            rootInvestor.getInvestment(),
            surgeInvestor.getInvestment(),
            fluxInvestor.getInvestment(),
          ]);

          // Flatten all investment breakdowns into a single array
          const flattenedInvestments = allInvestments.flatMap((inv) => inv.breakdown);

          // Store original order for chart data
          setOriginalInvestments(flattenedInvestments);

          // Sort investments by value in descending order
          const sortedInvestments = [...flattenedInvestments].sort(
            (a, b) => parseFloat(b.value) - parseFloat(a.value)
          );

          setInvestments(sortedInvestments);
        }
      } catch (err) {
        console.error("Error fetching investments", err);
      }
      setLoading(false);
    };

    fetchInvestments();
  }, []);

  const totalFunds = useMemo(() => {
    return investments.reduce((total, investment) => {
      return total + parseFloat(investment.value);
    }, 0);
  }, [investments]);

  // Handle responsive font size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setFontSize(100);
      } else if (width < 768) {
        setFontSize(120);
      } else if (width < 1024) {
        setFontSize(150);
      } else {
        setFontSize(180);
      }
    };

    // Set initial font size
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="relative w-full">
        <img
          src={investBg}
          alt="Invest Background"
          className="absolute inset-0 w-full h-[100vh] object-cover filter brightness-50 opacity-30"
        />
        <div className="relative max-w-screen-xl mx-auto w-full pt-4 px-2">
          <div className="grid grid-cols-1 my-10">
            <div className="flex items-center justify-center">
              <div>
                <p className="text-white text-center text-xl font-bold ">
                  FOMO $HIT Fund Market Value{" "}
                  <span className="hidden" id="total-market-value">
                    {totalFunds}
                  </span>
                </p>
                {loading ? (
                  <Skeleton width={300} height={100} baseColor="#242d20" highlightColor="#A0D490" />
                ) : (
                  <div
                    className="flex items-center justify-center"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, rgba(255,215,0,0.5) 20%, transparent 80%)",
                      overflow: "visible",
                    }}
                  >
                    <p
                      style={{
                        fontSize: fontSize > 100 ? 100 : fontSize > 80 ? 80 : 60,
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      $
                    </p>
                    <AnimatedNumbers
                      includeComma
                      transitions={() => ({
                        duration: 3,
                      })}
                      animateToNumber={Number(Number(totalFunds).toFixed(2))}
                      fontStyle={{
                        fontSize: fontSize,
                        color: "white",
                        fontWeight: "bold",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="order-1 md:order-2 flex items-center justify-center">
              {loading ? (
                <Skeleton
                  baseColor="#242d20"
                  highlightColor="#A0D490"
                  width="380px"
                  height="300px"
                  style={{ opacity: 0.5 }}
                />
              ) : (
                <div className="w-full max-w-[500px]">
                  <Chart
                    options={{
                      labels: originalInvestments.map(
                        (item) => `${item.platform} - ${item.position}`
                      ),
                      dataLabels: {
                        formatter: function (val, opts) {
                          return Number(val).toFixed(2) + "%";
                        },
                      },
                      legend: {
                        show: true,
                        labels: { colors: "#FFF" },
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
                    }}
                    series={originalInvestments.map((item) => +item.value)}
                    type="donut"
                    width="100%"
                  />
                </div>
              )}
            </div>
            <div className="order-2 md:order-1 overflow-x-auto">
              {loading ? (
                <Skeleton count={5} height={30} baseColor="#242d20" highlightColor="#A0D490" />
              ) : (
                <table className="table">
                  <thead className="text-white bg-[#000400] bg-opacity-70">
                    <tr className="border-b border-white">
                      <th></th>
                      <th>Platform</th>
                      <th>Position</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investments.map((investment, index) => (
                      <tr
                        key={index}
                        className="text-white border-b border-white/20 bg-[#000400] bg-opacity-70"
                      >
                        <th>{index + 1}</th>
                        <td className="font-semibold">{investment.platform}</td>
                        <td className="font-semibold">
                          <div className="flex items-center justify-start gap-2">
                            <img
                              src={investment.logo}
                              alt="logo"
                              className="w-4 h-4 rounded-full"
                            />
                            {investment.position}
                          </div>
                        </td>
                        <td className="font-semibold">{formatDollarAmount(+investment.value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvesmentFunds;
