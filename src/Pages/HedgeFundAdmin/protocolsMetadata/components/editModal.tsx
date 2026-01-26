import { useCallback } from "react";
import { toast } from "react-toastify";

import DialogStructure from "Components/dialogStructure";
import { useUpdateProtocolMetadata } from "hooks/apis/protocol-metadata";
import {
  ProtocolMetadata,
  UpdateProtocolMetadataPayload,
} from "hooks/apis/protocol-metadata/types";

import CommonUiForModals from "./commonUiForModals";

interface EditModalProps {
  modalId: string;
  protocol: ProtocolMetadata | null;
  onClose: () => void;
}

const EditModal = ({ modalId, protocol, onClose }: EditModalProps) => {
  const { mutate: updateProtocol, isPending } = useUpdateProtocolMetadata();

  const handleSubmit = useCallback(
    (values: any) => {
      if (!protocol) return;

      const payload: UpdateProtocolMetadataPayload = {
        platform_name: values.platform_name,
        logo_image: values.logo_image,
        account: values.account,
        apyid: values.apyid || null,
        description: values.description || null,
      };

      updateProtocol(
        { name: protocol.name, payload },
        {
          onSuccess: () => {
            toast.success("Protocol updated successfully");
            onClose(); // Effectively closes the modal logic in parent if needed, but we also close the dialog ref
            (document.getElementById(modalId) as HTMLDialogElement)?.close();
          },
          onError: (error) => {
            console.error("Failed to update protocol", error);
            toast.error((error as Error).message || "Failed to update protocol");
          },
        }
      );
    },
    [updateProtocol, modalId, onClose, protocol]
  );

  const handleClose = useCallback(() => {
    (document.getElementById(modalId) as HTMLDialogElement)?.close();
    onClose();
  }, [modalId, onClose]);

  return (
    <DialogStructure modalId={modalId}>
      {protocol ? (
        <CommonUiForModals
          initialValues={protocol}
          onSubmit={handleSubmit}
          isLoading={isPending}
          isEdit={true}
          onClose={handleClose}
        />
      ) : (
        <div className="text-center p-4">Select a protocol to edit</div>
      )}
    </DialogStructure>
  );
};

export default EditModal;
