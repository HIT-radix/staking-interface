import { useCallback, useState } from "react";
import { Plus, Database, AlertCircle } from "lucide-react";
import { useProtocolMetadataList } from "hooks/apis/protocol-metadata";
import { ProtocolMetadata } from "hooks/apis/protocol-metadata/types";
import ProtocolRow from "./components/ProtocolRow";
import CreateModal from "./components/createModal";
import EditModal from "./components/editModal";
import { useSelector } from "Store";

const ProtocolsMetadata = () => {
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolMetadata | null>(null);
  const isOwner = useSelector((state) => state.staking.isOwner);

  const { data: protocols, isLoading, error } = useProtocolMetadataList();

  const handleAddProtocol = useCallback(() => {
    (document.getElementById("create_protocol_modal") as HTMLDialogElement)?.showModal();
  }, []);

  const handleEditProtocol = useCallback((protocol: ProtocolMetadata) => {
    setSelectedProtocol(protocol);
    requestAnimationFrame(() => {
      (document.getElementById("edit_protocol_modal") as HTMLDialogElement)?.showModal();
    });
  }, []);

  const handleEditClose = useCallback(() => {
    setSelectedProtocol(null);
  }, []);

  const renderRows = useCallback(() => {
    return protocols?.map((protocol) => (
      <ProtocolRow key={protocol.name} protocol={protocol} onEdit={handleEditProtocol} />
    ));
  }, [protocols, handleEditProtocol]);

  if (!isOwner) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-accent">Protocols Metadata</h1>
          <p className="text-secondary text-sm mt-1">
            Manage external protocol information and configurations
          </p>
        </div>
        <button className="btn btn-accent gap-2" onClick={handleAddProtocol}>
          <Plus className="h-5 w-5" />
          Add Protocol Info
        </button>
      </div>

      <div className="bg-base-200/40 border border-base-300 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 gap-4">
            <span className="loading loading-spinner loading-lg text-accent"></span>
            <span className="text-accent animate-pulse">Loading protocols...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-error bg-error/10 flex flex-col items-center">
            <AlertCircle className="h-12 w-12 mb-2" />
            <p className="font-semibold">Failed to load protocols metadata.</p>
            <p className="text-sm mt-1 opacity-80 text-accent">
              {(error as Error).message || "Unknown error occurred"}
            </p>
          </div>
        ) : !protocols || protocols?.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-accent">
            <Database className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">No protocols found</p>
            <p className="text-sm opacity-70">Get started by adding a new protocol info.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="table table-zebra w-full whitespace-nowrap">
              <thead className="bg-base-300/50 text-secondary uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="pl-6">Logo</th>
                  <th>Name</th>
                  <th>Platform</th>
                  <th>Position</th>
                  <th>Account</th>
                  <th>APY ID</th>
                  <th className="pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">{renderRows()}</tbody>
            </table>
          </div>
        )}
      </div>

      <CreateModal modalId="create_protocol_modal" />
      <EditModal
        modalId="edit_protocol_modal"
        protocol={selectedProtocol}
        onClose={handleEditClose}
      />
    </div>
  );
};

export default ProtocolsMetadata;
