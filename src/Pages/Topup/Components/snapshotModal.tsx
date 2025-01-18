import DialogStructure from "Components/dialogStructure";
import DistributionTable from "./distributionTable";
import { useSelector } from "Store";

const SnapshotModal = () => {
  const rewardsModalData = useSelector((state) => state.session.rewardsModalData);

  return (
    <DialogStructure modalId="SnapshotModal">
      {rewardsModalData && (
        <>
          <p className="text-secondary text-xl font-semibold text-center mb-3">Snapshot Saved!</p>
          <DistributionTable distribution={rewardsModalData.RewardTokenDistributions} />
        </>
      )}
    </DialogStructure>
  );
};

export default SnapshotModal;
