import { useEffect, useState } from "react";
import axios from "axios";
import { HIT_SERVER_URL } from "Constants/endpoints";
import { SnapshotDB } from "Types/api";
import { dispatch, useSelector } from "Store";
import { setSelectedSnapshots, setRewardsModalData } from "Store/Reducers/session";
import { StakingTokens } from "Types/reducers";
import { XUSDT_RESOURCE_ADDRESS } from "Constants/address";

const SnapshotsTable = () => {
  const [snapshots, setSnapshots] = useState<SnapshotDB[]>([]);
  const selectedRows = useSelector((state) => state.session.selectedSnapshots);
  const successTxCount = useSelector((state) => state.session.successTxCount);

  const getAllSnaps = async () => {
    const from = new Date(new Date().getFullYear(), 0, 1).getTime();
    const to = Date.now();

    const { data } = await axios.post(`${HIT_SERVER_URL}/node-staking/get-snapshots`, {
      from,
      to,
    });
    setSnapshots(data);
  };

  useEffect(() => {
    getAllSnaps();
  }, [successTxCount]);

  const handleCheckboxChange = (snapshot: SnapshotDB) => {
    dispatch(
      setSelectedSnapshots(
        selectedRows.some((ss) => ss.snapshot === snapshot.snapshot)
          ? selectedRows.filter((ss) => ss.snapshot !== snapshot.snapshot)
          : [...selectedRows, snapshot]
        // selectedRows.(index)
        //   ? selectedRows.filter((i) => i !== index)
        //   : [...selectedRows, index]
      )
    );
  };

  const isRowSelected = (snapshot: SnapshotDB) =>
    selectedRows.some((ss) => ss.snapshot === snapshot.snapshot);

  const onShowData = (snapshot: SnapshotDB) => {
    dispatch(
      setRewardsModalData({
        amount: "1",
        RewardTokenDistributions: snapshot.data,
        tokenSymbol: StakingTokens.XUSDT,
        tokenAddress: XUSDT_RESOURCE_ADDRESS,
        snapshot: snapshot.snapshot,
        timestamp: snapshot.timestamp,
      })
    );
    (document.getElementById("SnapshotDetailModal") as HTMLDialogElement).showModal();
  };

  return (
    <table className="table-auto w-full text-accent">
      <thead>
        <tr>
          <th className="px-4 py-2">
            <input
              className="checkbox checkbox-accent"
              type="checkbox"
              onChange={(e) => {
                if (e.target.checked) {
                  dispatch(setSelectedSnapshots(snapshots.map((ss) => ss)));
                } else {
                  dispatch(setSelectedSnapshots([]));
                }
              }}
              checked={selectedRows.length === snapshots.length}
            />
          </th>
          <th className="px-4 py-2">Time</th>
          <th className="px-4 py-2">Snapshot ID</th>
          <th className="px-4 py-2">Snapshot Data</th>
        </tr>
      </thead>
      <tbody>
        {snapshots.map((snapshot, index) => (
          <tr key={index} className={isRowSelected(snapshot) ? "bg-base-content/40" : ""}>
            <td
              className="border px-4 py-2 text-center cursor-pointer"
              onClick={() => handleCheckboxChange(snapshot)}
            >
              <input
                className="checkbox checkbox-accent"
                type="checkbox"
                checked={isRowSelected(snapshot)}
                onChange={() => {}}
              />
            </td>
            <td className="border px-4 py-2 text-center">
              {new Date(snapshot.timestamp).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </td>
            <td className="border px-4 py-2 text-center">{snapshot.snapshot}</td>
            <td className="border px-4 py-2 flex items-center justify-center">
              <button className="btn btn-accent" onClick={() => onShowData(snapshot)}>
                Show Data
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SnapshotsTable;
