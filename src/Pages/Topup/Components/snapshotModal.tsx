import DialogStructure from "Components/dialogStructure";
import DistributionTable from "./distributionTable";
import { useSelector } from "Store";
import { Save } from "lucide-react";

const SnapshotModal = () => {
  const rewardsModalData = useSelector((state) => state.session.rewardsModalData);

  const onSaveClick = async () => {
    if (!rewardsModalData) return;
    (document.getElementById("SnapshotModal") as HTMLDialogElement).close();
  };
  return (
    <DialogStructure modalId="SnapshotModal">
      {rewardsModalData && (
        <>
          <p className="text-secondary text-xl font-semibold text-center mb-3">Save Snapshot</p>
          <DistributionTable distribution={rewardsModalData.RewardTokenDistributions} />
        </>
      )}
      <div className="flex justify-center mt-5">
        <button className="btn bg-accent text-base-100 hover:bg-accent/50" onClick={onSaveClick}>
          Save! <Save />
        </button>
      </div>
    </DialogStructure>
  );
};

export default SnapshotModal;
