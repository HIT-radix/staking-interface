import { useCallback } from "react";
import { toast } from "react-toastify";

import DialogStructure from "Components/dialogStructure";
import { useCreateProtocolMetadata } from "hooks/apis/protocol-metadata";
import { CreateProtocolMetadataPayload } from "hooks/apis/protocol-metadata/types";

import CommonUiForModals from "./commonUiForModals";

interface CreateModalProps {
  modalId: string;
}

const CreateModal = ({ modalId }: CreateModalProps) => {
  const { mutate: createProtocol, isPending } = useCreateProtocolMetadata();

  const closeModal = useCallback(() => {
    (document.getElementById(modalId) as HTMLDialogElement)?.close();
  }, [modalId]);

  const handleSubmit = useCallback(
    (values: any) => {
      const payload: CreateProtocolMetadataPayload = {
        name: values.name,
        platform_name: values.platform_name,
        logo_image: values.logo_image,
        account: values.account,
        apyid: values.apyid || null,
        description: values.description || null,
      };

      createProtocol(payload, {
        onSuccess: () => {
          toast.success("Protocol created successfully");
          closeModal();
        },
        onError: (error) => {
          console.error("Failed to create protocol", error);
          toast.error((error as Error).message || "Failed to create protocol");
        },
      });
    },
    [createProtocol, closeModal]
  );

  return (
    <DialogStructure modalId={modalId}>
      <CommonUiForModals
        onSubmit={handleSubmit}
        isLoading={isPending}
        isEdit={false}
        onClose={closeModal}
      />
    </DialogStructure>
  );
};

export default CreateModal;
