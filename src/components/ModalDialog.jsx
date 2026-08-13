import React, { useEffect, useRef } from "react";

export default function ModalDialog({ modal, onClose }) {
  if (!modal || !modal.open) return null;

  const { title = "Notice", message = "", confirmText = "OK", cancelText = "Cancel", showCancel = false, onConfirm, onCancel } = modal;
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    confirmBtnRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (onCancel) onCancel();
        else onClose();
      }
      if (e.key === "Enter") {
        if (onConfirm) onConfirm();
        else onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onConfirm, onCancel, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      if (onCancel) onCancel();
      else onClose();
    }
  };

  return (
    <div
      id="modalOverlay"
      className="modal-overlay active"
      aria-hidden="false"
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div className="modal-card">
        <h3 id="modalTitle" className="modal-title">{title}</h3>
        <div id="modalBody" className="modal-body" style={{ whiteSpace: "pre-line" }}>{message}</div>
        <div id="modalActions" className="modal-actions">
          {showCancel && (
            <button
              id="modalCancelBtn"
              className="btn ghost"
              onClick={() => {
                if (onCancel) onCancel();
                else onClose();
              }}
            >
              {cancelText}
            </button>
          )}
          <button
            id="modalConfirmBtn"
            className="btn primary"
            ref={confirmBtnRef}
            onClick={() => {
              if (onConfirm) onConfirm();
              else onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
