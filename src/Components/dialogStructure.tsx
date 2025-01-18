import { ReactNode } from "react";

import cross from "Assets/Svgs/cross.svg";

const DialogStructure = ({ children, modalId }: { children: ReactNode; modalId: string }) => {
  return (
    <dialog id={modalId} className="modal text-accent">
      <div className="modal-box max-h-[60vh] bg-base-content">
        <div className="flex justify-end mb-2">
          <img
            src={cross}
            alt="cross"
            className="w-3 h-3 cursor-pointer"
            onClick={() => (document.getElementById(modalId) as HTMLDialogElement).close()}
          />
        </div>
        {children}
      </div>
    </dialog>
  );
};

export default DialogStructure;
