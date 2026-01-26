import { Plus, Edit2, Database, AlertCircle } from "lucide-react";
import { useProtocolMetadataList } from "hooks/apis/protocol-metadata";
import { ProtocolMetadata } from "hooks/apis/protocol-metadata/types";
import { conciseAddress } from "Utils/format";

const ProtocolsMetadata = () => {
  const secret = process.env.REACT_APP_HEDGE_FUND_ADMIN_SECRET;

  const {
    data: protocols,
    isLoading,
    error,
  } = useProtocolMetadataList({
    secret,
    enabled: !!secret,
  });

  const handleAddProtocol = () => {
    // Placeholder for add functionality
  };

  const handleEditProtocol = (protocol: ProtocolMetadata) => {
    // Placeholder for edit functionality
  };

  if (!secret) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="alert alert-error">
          <span>Admin secret is not configured (REACT_APP_HEDGE_FUND_ADMIN_SECRET).</span>
        </div>
      </div>
    );
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
              <tbody className="text-sm">
                {protocols?.map((protocol) => (
                  <tr
                    key={protocol.name}
                    className="hover:bg-base-200 transition-colors duration-200"
                  >
                    <td className="pl-6">
                      <div className="avatar placeholder">
                        <div className="bg-base-100 rounded-xl w-10 h-10 ring-1 ring-base-300 ring-offset-base-100 ring-offset-1 p-1">
                          {protocol.logo_image ? (
                            <img
                              src={protocol.logo_image}
                              alt={protocol.name}
                              className="object-contain w-full h-full rounded-lg"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://placehold.co/40x40?text=?";
                              }}
                            />
                          ) : (
                            <span className="text-xs">
                              {protocol.name.substring(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="font-semibold text-accent">{protocol.name}</td>
                    <td className="text-accent">
                      <span className="badge badge-outline badge-md">{protocol.platform_name}</span>
                    </td>
                    <td
                      className="w-48 max-w-xs truncate opacity-80 text-accent"
                      title={protocol.description ?? ""}
                    >
                      {protocol.description || (
                        <span className="italic text-accent text-center">No description</span>
                      )}
                    </td>
                    <td
                      className="font-mono text-xs opacity-70 text-accent"
                      title={protocol.account}
                    >
                      {conciseAddress(protocol.account, 4, 4)}
                    </td>
                    <td>
                      {protocol.apyid ? (
                        <div className="badge badge-ghost badge-sm font-mono opacity-70 text-accent">
                          {protocol.apyid}
                        </div>
                      ) : (
                        <span className="text-accent italic text-center">-</span>
                      )}
                    </td>
                    <td className="pr-6 text-right">
                      <button
                        className="btn btn-ghost btn-sm btn-square hover:text-accent hover:bg-accent/10"
                        onClick={() => handleEditProtocol(protocol)}
                        title="Edit Protocol"
                      >
                        <Edit2 className="h-4 w-4 text-accent" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProtocolsMetadata;
