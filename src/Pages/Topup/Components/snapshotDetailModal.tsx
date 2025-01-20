import DialogStructure from "Components/dialogStructure";
import DistributionTable from "./distributionTable";
import { useSelector } from "Store";

const SnapshotDetailModal = () => {
  const rewardsModalData = useSelector((state) => state.session.rewardsModalData);

  return (
    <DialogStructure modalId="SnapshotDetailModal">
      {rewardsModalData && (
        <>
          <p className="text-secondary text-xl font-semibold text-center mb-3">Snapshot Details</p>
          <p className="text-secondary text-lg text-center mb-3">
            Snapshot ID: {rewardsModalData.snapshot}
          </p>
          <p className="text-secondary text-lg text-center mb-3">
            Snapshot Time:{" "}
            {new Date(rewardsModalData.timestamp).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
          <DistributionTable distribution={rewardsModalData.RewardTokenDistributions} />
        </>
      )}
    </DialogStructure>
  );
};

export default SnapshotDetailModal;
