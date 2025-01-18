import { RewardTokenDistribution } from "Types/token";

const DistributionTable = ({ distribution }: { distribution: RewardTokenDistribution[] }) => {
  return (
    <table className="table-auto w-full">
      <thead>
        <tr>
          <th className="px-4 py-2">NFT Id</th>
          <th className="px-4 py-2">Share</th>
        </tr>
      </thead>
      <tbody>
        {distribution.map((item) => (
          <tr key={item.id}>
            <td className="border px-4 py-2">{item.id}</td>
            <td className="border px-4 py-2">{item.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DistributionTable;
