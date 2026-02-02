import { useMemo } from "react";
import { useGetFormattedInvestmentsInfo } from "hooks/apis/common";
import investBg from "Assets/Images/investment-bg.jpeg";
import TotalValueDisplay from "./components/TotalValueDisplay";
import TotalFundChart from "./components/TotalFundChart";
import AllocationDonutChart from "./components/AllocationDonutChart";
import PositionsTable from "./components/PositionsTable";

const InvesmentFunds = () => {
  const { data: investmentsInfo, isLoading: loading } = useGetFormattedInvestmentsInfo();

  const investments = useMemo(() => investmentsInfo?.fundsDetails || [], [investmentsInfo]);
  const totalFunds = useMemo(() => investmentsInfo?.totalFunds || "0", [investmentsInfo]);

  return (
    <div className="relative w-full min-h-screen">
      <img
        src={investBg}
        alt="Invest Background"
        className="absolute inset-0 w-full h-full object-cover filter brightness-50 opacity-30"
      />
      <div className="relative max-w-screen-xl mx-auto w-full pt-4 px-4 pb-20">
        {/* Top Section: Total Value */}
        <div className="my-8 md:my-12">
          <TotalValueDisplay totalFunds={totalFunds} loading={loading} />
        </div>

        {/* Bottom Section: Allocation & Table */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 order-1 lg:order-2 flex flex-col">
            <h3 className="text-white text-lg font-bold mb-4 px-1">Asset Allocation</h3>
            <AllocationDonutChart investments={investments} loading={loading} />
          </div>
          <div className="lg:col-span-3 order-2 lg:order-1 flex flex-col">
            <h3 className="text-white text-lg font-bold mb-4 px-1">Hedge Fund Positions</h3>
            <PositionsTable investments={investments} loading={loading} />
          </div>
        </div>

        {/* Middle Section: Historic Chart */}
        <div className="mt-6 md:mt-8">
          <TotalFundChart />
        </div>
      </div>
    </div>
  );
};

export default InvesmentFunds;
