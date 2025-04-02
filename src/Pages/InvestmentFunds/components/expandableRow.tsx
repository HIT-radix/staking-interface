import { ChevronDown } from "lucide-react";
import { useCallback, useState } from "react";

const ExpandableRow = ({
  index,
  platform,
  total,
  breakdown,
}: {
  platform: string;
  total: string;
  breakdown: { asset: string; value: string }[];
  index: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderRows = useCallback(() => {
    return breakdown.map(({ asset, value }, index) => (
      <tr className="text-white border-b border-white/20 bg-[#000400] bg-opacity-70" key={index}>
        <th>{index + 1}</th>
        <td className="font-semibold">{asset}</td>
        <td className="font-semibold">{value}</td>
        <td></td>
      </tr>
    ));
  }, [breakdown]);

  return (
    <>
      <tr className="text-white border-b border-white/20 bg-[#000400] bg-opacity-70">
        <th>{index}</th>
        <td className="font-semibold">{platform}</td>
        <td className="font-semibold">{total}</td>
        <td>
          <ChevronDown
            className={`text-accent transform transition-transform cursor-pointer ${
              isExpanded ? "rotate-180" : "rotate-0"
            }`}
            onClick={() => setIsExpanded(!isExpanded)}
          />
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
