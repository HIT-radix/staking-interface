import { useNavigate } from "react-router-dom";

const HedgeFundAdmin = () => {
  const navigate = useNavigate();

  const handleManageProtocolsClick = () => {
    navigate("/admin/hedge-fund/protocols-percentage");
  };

  const handleManageProtocolsInfoClick = () => {
    navigate("/admin/hedge-fund/protocols-metadata");
  };

  const handleViewSnapshotsClick = () => {
    navigate("/admin/hedge-fund/snapshots");
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <div className="text-2xl font-semibold text-accent">Hedge Fund Admin</div>
      <button
        className="btn bg-accent text-base-100 hover:bg-accent/70 w-full max-w-sm"
        onClick={handleManageProtocolsClick}
      >
        Manage Protocols Percentages
      </button>
      <button
        className="btn bg-accent text-base-100 hover:bg-accent/70 w-full max-w-sm"
        onClick={handleManageProtocolsInfoClick}
      >
        Manage Protocols Info
      </button>
      <button
        className="btn bg-accent text-base-100 hover:bg-accent/70 w-full max-w-sm"
        onClick={handleViewSnapshotsClick}
      >
        Manage Snapshots
      </button>
    </div>
  );
};

export default HedgeFundAdmin;
