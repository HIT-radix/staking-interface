import { memo } from "react";
import { Edit2 } from "lucide-react";

import { ProtocolMetadata } from "hooks/apis/protocol-metadata/types";
import { conciseAddress } from "Utils/format";

interface ProtocolRowProps {
  protocol: ProtocolMetadata;
  onEdit: (protocol: ProtocolMetadata) => void;
}

const ProtocolRow = memo(({ protocol, onEdit }: ProtocolRowProps) => {
  return (
    <tr className="hover:bg-base-200 transition-colors duration-200">
      <td className="pl-6">
        <div className="avatar placeholder">
          <div className="bg-base-100 rounded-xl w-10 h-10 ring-1 ring-base-300 ring-offset-base-100 ring-offset-1 p-1">
            {protocol.logo_image ? (
              <img
                src={protocol.logo_image}
                alt={protocol.name}
                className="object-contain w-full h-full rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/40x40?text=?";
                }}
              />
            ) : (
              <span className="text-xs">{protocol.name.substring(0, 2).toUpperCase()}</span>
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
      <td className="font-mono text-xs opacity-70 text-accent" title={protocol.account}>
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
          onClick={() => onEdit(protocol)}
          title="Edit Protocol"
        >
          <Edit2 className="h-4 w-4 text-accent" />
        </button>
      </td>
    </tr>
  );
});

ProtocolRow.displayName = "ProtocolRow";

export default ProtocolRow;
