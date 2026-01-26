import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ProtocolMetadata } from "hooks/apis/protocol-metadata/types";

interface CommonUiForModalsProps {
  initialValues?: ProtocolMetadata | null;
  onSubmit: (values: any) => void;
  isLoading: boolean;
  isEdit?: boolean;
  onClose: () => void;
}

const CommonUiForModals = ({
  initialValues,
  onSubmit,
  isLoading,
  isEdit = false,
  onClose,
}: CommonUiForModalsProps) => {
  const [formData, setFormData] = useState({
    name: "",
    platform_name: "",
    logo_image: "",
    account: "",
    apyid: "",
    description: "",
  });

  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name || "",
        platform_name: initialValues.platform_name || "",
        logo_image: initialValues.logo_image || "",
        account: initialValues.account || "",
        apyid: initialValues.apyid || "",
        description: initialValues.description || "",
      });
    } else {
      setFormData({
        name: "",
        platform_name: "",
        logo_image: "",
        account: "",
        apyid: "",
        description: "",
      });
    }
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.platform_name.trim()) {
      toast.error("Platform Name is required");
      return;
    }
    if (!formData.logo_image.trim()) {
      toast.error("Logo URL is required");
      return;
    }
    if (!formData.account.trim()) {
      toast.error("Account Address is required");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-2">
      <h3 className="text-lg font-bold text-center text-accent">
        {isEdit ? "Edit Protocol" : "Add Protocol"}
      </h3>

      <div className="form-control w-full text-accent">
        <label className="label">
          <span className="label-text text-accent">Name</span>
        </label>
        <input
          type="text"
          name="name"
          placeholder="e.g. Ociswap"
          className="input input-bordered w-full bg-base-200 disabled:text-accent"
          value={formData.name}
          onChange={handleChange}
          disabled={isEdit}
        />
      </div>

      <div className="form-control w-full text-accent">
        <label className="label">
          <span className="label-text text-accent">Platform</span>
        </label>
        <input
          type="text"
          name="platform_name"
          placeholder="e.g. Ociswap"
          className="input input-bordered w-full bg-base-200"
          value={formData.platform_name}
          onChange={handleChange}
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text text-accent">Logo URL</span>
        </label>
        <input
          type="text"
          name="logo_image"
          placeholder="https://..."
          className="input input-bordered w-full bg-base-200"
          value={formData.logo_image}
          onChange={handleChange}
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text text-accent">Account Address</span>
        </label>
        <input
          type="text"
          name="account"
          placeholder="component_rdx..."
          className="input input-bordered w-full bg-base-200 font-mono text-sm"
          value={formData.account}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-accent">APY ID (Optional)</span>
          </label>
          <input
            type="text"
            name="apyid"
            placeholder=""
            className="input input-bordered w-full bg-base-200"
            value={formData.apyid}
            onChange={handleChange}
          />
        </div>

        <div className="form-control w-full text-accent">
          <label className="label">
            <span className="label-text text-accent">Position</span>
          </label>
          <input
            type="text"
            name="description"
            placeholder=""
            className="input input-bordered w-full bg-base-200"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="modal-action mt-6">
        <button type="button" className="btn btn-ghost" onClick={onClose} disabled={isLoading}>
          Cancel
        </button>
        <button
          type="submit"
          className={`btn btn-accent ${isLoading ? "loading" : ""}`}
          disabled={isLoading}
        >
          {isEdit ? "Update Protocol" : "Add Protocol"}
        </button>
      </div>
    </form>
  );
};

export default CommonUiForModals;
