import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import rootInvestor from "Classes/investments/root";
import surgeInvestor from "Classes/investments/surge";
import weftInvestor from "Classes/investments/weft";
import InfoTile from "Components/infoTile";
import { formatDollarAmount } from "Utils/format";
import Skeleton from "react-loading-skeleton";
import { fetchFelixWalletBalance } from "Utils/fetchers";
import c9Investor from "Classes/investments/stab";
import investBg from "Assets/Images/investment-bg.jpeg";
import AnimatedNumbers from "react-animated-numbers";

const InvesmentFunds = () => {
  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState({
    weft: 0,
    surge: 0,
    root: 0,
    c9: 0,
  });

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const isFetched = await fetchFelixWalletBalance();
        if (isFetched) {
          const [weftInvestment, surgeInvestment, rootInvestment, caviarNineInvestment] =
            await Promise.all([
              weftInvestor.getInvestment(),
              surgeInvestor.getInvestment(),
              rootInvestor.getInvestment(),
              c9Investor.getInvestment(),
            ]);
          setInvestments({
            weft: +weftInvestment,
            surge: +surgeInvestment,
            root: +rootInvestment,
            c9: +caviarNineInvestment,
          });
        }
      } catch (err) {
        console.error("Error fetching investments", err);
      }
      setLoading(false);
    };

    fetchInvestments();
  }, []);

  const totalFunds = investments.weft + investments.surge + investments.root + investments.c9;

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
              <div
              // className="flex items-center justify-center"
              >
                <p className="text-white text-center text-xl font-bold ">
                  FOMO $HIT Fund Market Value
                </p>
                {!loading && (
                  <div
                    className="flex items-center justify-center "
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, rgba(255,215,0,0.5) 20%, transparent 80%)",
                      overflow: "visible",
                      // filter: "blur(8px)",
                    }}
                  >
                    <p style={{ fontSize: 80, color: "white", fontWeight: "bold" }}>$</p>
                    <AnimatedNumbers
                      includeComma
                      transitions={(index) => ({
                        type: "spring",
                        duration: 5,
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
            {/* <div className="flex items-center justify-center">
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
                  series={[investments.weft, investments.root, investments.surge, investments.c9]}
                  type="donut"
                  width="380"
                />
              )}
            </div> */}
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
                  series={[investments.weft, investments.root, investments.surge, investments.c9]}
                  type="donut"
                  width="380"
                />
              )}
            </div>
            <div className="order-2 md:order-1 overflow-x-auto">
              <table className="table">
                <thead className="bg-white text-primary">
                  <tr>
                    <th></th>
                    <th>DeFi Platform</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-white border-b border-white/20 bg-[#000400] bg-opacity-70">
                    <th>1</th>
                    <td className="font-semibold">Weft Finance</td>
                    <td className="font-semibold">
                      {loading ? (
                        <Skeleton
                          baseColor="#242d20"
                          highlightColor="#A0D490"
                          width="40px"
                          style={{ opacity: 0.5 }}
                        />
                      ) : (
                        formatDollarAmount(investments.weft)
                      )}
                    </td>
                  </tr>
                  <tr className="text-white border-b border-white/20 bg-[#000400] bg-opacity-70">
                    <th>2</th>
                    <td className="font-semibold">Root Finance</td>
                    <td className="font-semibold">
                      {loading ? (
                        <Skeleton
                          baseColor="#242d20"
                          highlightColor="#A0D490"
                          width="40px"
                          style={{ opacity: 0.5 }}
                        />
                      ) : (
                        formatDollarAmount(investments.root)
                      )}
                    </td>
                  </tr>
                  <tr className="text-white border-b border-white/20 bg-[#000400] bg-opacity-70">
                    <th>3</th>
                    <td className="font-semibold">Surge Finance</td>
                    <td className="font-semibold">
                      {loading ? (
                        <Skeleton
                          baseColor="#242d20"
                          highlightColor="#A0D490"
                          width="40px"
                          style={{ opacity: 0.5 }}
                        />
                      ) : (
                        formatDollarAmount(investments.surge)
                      )}
                    </td>
                  </tr>
                  <tr className="text-white border-b border-white/20 bg-[#000400] bg-opacity-70">
                    <th>4</th>
                    <td className="font-semibold">CaviarNine</td>
                    <td className="font-semibold">
                      {loading ? (
                        <Skeleton
                          baseColor="#242d20"
                          highlightColor="#A0D490"
                          width="40px"
                          style={{ opacity: 0.5 }}
                        />
                      ) : (
                        formatDollarAmount(investments.c9)
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvesmentFunds;
