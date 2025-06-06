import { ChevronDown } from "lucide-react";
import { useCallback, useState } from "react";
import { InvestmentInfo } from "Types/misc";
import { formatDollarAmount } from "Utils/format";

const ExpandableRow = ({ index, platform, total, breakdown }: InvestmentInfo) => {
  const [isExpanded, setIsExpanded] = useState(breakdown.length > 0 ? true : false);

  const renderRows = useCallback(() => {
    return breakdown.map(({ asset, value, logo }, index) => (
      <tr className="text-white border-b border-white/20 bg-[#000400] bg-opacity-70" key={index}>
        <th>{index + 1}</th>
        <td className="font-semibold">
          <div className="flex items-center justify-start gap-2">
            <img src={logo} alt="logo" className="w-7 h-7 rounded-full" /> {asset}
          </div>
        </td>
        <td className="font-semibold">{formatDollarAmount(+value)}</td>
        <td></td>
      </tr>
    ));
  }, [breakdown]);

  return (
    <>
      <tr className="text-white border-b border-white/20 bg-[#000400] bg-opacity-70">
        <th>{index}</th>
        <td className="font-semibold">{platform}</td>
        <td className="font-semibold">{formatDollarAmount(+total)}</td>
        <td>
          {breakdown.length > 0 && (
            <ChevronDown
              className={`text-accent transform transition-transform cursor-pointer ${
                isExpanded ? "rotate-180" : "rotate-0"
              }`}
              onClick={() => setIsExpanded(!isExpanded)}
            />
          )}
        </td>
      </tr>
      <tr className="text-white border-b border-white/20 bg-[#000400] bg-opacity-70">
        <td colSpan={4} className={`transition-[padding] duration-500 ${isExpanded ? "" : "p-0"}`}>
          <div
            className={`grid transition-[grid-template-rows] duration-500 overflow-hidden ${
              isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <table className="table max-h-0 overflow-hidden bg-secondary bg-opacity-40 rounded-none">
              <thead className="text-white ">
                <tr className="">
                  <th></th>
                  <th className=" w-[50%]">Asset</th>
                  <th>Value</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{renderRows()}</tbody>
            </table>
          </div>
        </td>
      </tr>
    </>
  );
};

export default ExpandableRow;
