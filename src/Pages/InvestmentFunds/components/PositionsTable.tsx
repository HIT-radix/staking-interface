import React from "react";
import Skeleton from "react-loading-skeleton";
import { ExternalLink } from "lucide-react";
import { useSelector } from "Store";
import ApyCacheService from "Classes/apyCache";
import { formatDollarAmount } from "Utils/format";
import { radixDashboardBaseUrl } from "Constants/misc";

interface InvestmentItem {
  platform: string;
  position: string;
  value: string | number;
  logo: string;
  account: string;
  apyId: string;
  [key: string]: any;
}

interface PositionsTableProps {
  investments: InvestmentItem[];
  loading: boolean;
}

const PositionsTable: React.FC<PositionsTableProps> = ({ investments, loading }) => {
  const apyFetching = useSelector((state: any) => state.loadings.apyFetching);

  if (loading || apyFetching) {
    return (
      <div className="w-full bg-[#000400] bg-opacity-70 rounded-xl p-4 border border-white/20 min-h-[300px]">
        <div className="mb-4">
          <Skeleton height={40} baseColor="#242d20" highlightColor="#A0D490" />
        </div>
        <Skeleton
          count={5}
          height={50}
          baseColor="#242d20"
          highlightColor="#A0D490"
          className="mb-2"
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-neutral/40 backdrop-blur-md rounded-xl border border-white/10 shadow-lg overflow-hidden h-full">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="text-white bg-white/5">
            <tr className="border-b border-white/10">
              <th className="bg-transparent text-sm font-bold uppercase py-3 pl-4">#</th>
              <th className="bg-transparent text-sm font-bold uppercase py-3">Platform</th>
              <th className="bg-transparent text-sm font-bold uppercase py-3">Position</th>
              <th className="bg-transparent text-sm font-bold uppercase py-3">APY</th>
              <th className="bg-transparent text-sm font-bold uppercase py-3 pr-4 text-right">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {investments.map((investment, index) => (
              <tr
                key={index}
                className="text-white border-b border-white/10 hover:bg-white/5 transition-colors"
              >
                <th className="pl-4 font-normal text-white/60">{index + 1}</th>
                <td className="font-semibold">{investment.platform}</td>
                <td className="font-semibold">
                  <div className="flex items-center justify-start gap-2">
                    <img src={investment.logo} alt="logo" className="w-6 h-6 rounded-full" />
                    <a
                      href={`${radixDashboardBaseUrl}/account/${investment.account}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 hover:text-[#8af8c7] transition-colors"
                    >
                      {investment.position}
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  </div>
                </td>
                <td className="font-semibold text-accent font-mono">
                  {(() => {
                    const apy = ApyCacheService?.allAPYs?.[investment.apyId];
                    return typeof apy === "number" && !isNaN(apy) ? `${apy.toFixed(2)}%` : "-";
                  })()}
                </td>
                <td className="font-semibold text-right pr-4 font-mono">
                  {formatDollarAmount(+investment.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {investments.length === 0 && !loading && (
        <div className="p-8 text-center text-white/50">No investments found.</div>
      )}
    </div>
  );
};

export default PositionsTable;
