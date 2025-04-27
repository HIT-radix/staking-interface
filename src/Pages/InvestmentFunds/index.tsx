import { useState, useEffect, useMemo } from "react";
import Chart from "react-apexcharts";
import rootInvestor from "Classes/investments/root";
import surgeInvestor from "Classes/investments/surge";
import weftInvestor from "Classes/investments/weft";
import Skeleton from "react-loading-skeleton";
import { fetchFelixWalletBalance } from "Utils/fetchers";
import c9Investor from "Classes/investments/stab";
import investBg from "Assets/Images/investment-bg.jpeg";
import AnimatedNumbers from "react-animated-numbers";
import ExpandableRow from "./components/expandableRow";
import { InvestmentInfo } from "Types/misc";

const InvesmentFunds = () => {
  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState<InvestmentInfo[]>([]);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const isFetched = await fetchFelixWalletBalance();
        if (isFetched) {
          const allInvestments = await Promise.all([
            weftInvestor.getInvestment(),
            rootInvestor.getInvestment(),
            surgeInvestor.getInvestment(),
            c9Investor.getInvestment(),
          ]);
          setInvestments(allInvestments);
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
      return total + parseFloat(investment.total);
    }, 0);
  }, [investments]);

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
                        fontSize: 80,
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
                      animateToNumber={Number(totalFunds.toFixed(2))}
                      fontStyle={{
                        fontSize: 80,
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
                <Chart
                  options={{
                    labels: ["Weft Finance", "Root Finance", "Surge Finance", "CaviarNine"],
                    dataLabels: {},
                    legend: {
                      show: true,
                      labels: { colors: "#fff" },
                    },
                  }}
                  series={[
                    +investments[0].total,
                    +investments[1].total,
                    +investments[2].total,
                    +investments[3].total,
                  ]}
                  type="donut"
                  width="380"
                />
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
                      <th className="w-[50%]">DeFi Platform</th>
                      <th>Value</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {investments.map((investment, index) => (
                      <ExpandableRow key={index} {...investment} />
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
