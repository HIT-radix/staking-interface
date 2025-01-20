import { useEffect, useState } from "react";
import axios from "axios";
import { HIT_SERVER_URL } from "Constants/endpoints";
import { SnapshotDB } from "Types/api";

const SnapshotsTable = () => {
  const [snapshots, setSnapshots] = useState<SnapshotDB[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

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
  }, []);

  const handleCheckboxChange = (index: number) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(index)
        ? prevSelectedRows.filter((i) => i !== index)
        : [...prevSelectedRows, index]
    );
  };

  const isRowSelected = (index: number) => selectedRows.includes(index);

  return (
    <table className="table-auto w-full">
      <thead>
        <tr>
          <th className="px-4 py-2">
            <input
              className="checkbox checkbox-accent"
              type="checkbox"
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedRows(snapshots.map((_, index) => index));
                } else {
                  setSelectedRows([]);
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
          <tr key={index} className={isRowSelected(index) ? "bg-base-content/40" : ""}>
            <td
              className="border px-4 py-2 text-center cursor-pointer"
              onClick={() => handleCheckboxChange(index)}
            >
              <input
                className="checkbox checkbox-accent"
                type="checkbox"
                checked={isRowSelected(index)}
                // onChange={() => handleCheckboxChange(index)}
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
              <button className="btn btn-accent" onClick={() => console.log(snapshot.data)}>
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
