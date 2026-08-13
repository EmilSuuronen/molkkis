import React, { useEffect } from "react";

export default function ExitGameModal({
  isOpen,
  onClose,
  onSaveAndExit,
  onDiscard,
  t
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getT = (key, fallback) => (t ? t(key) : fallback);

  return (
    <div
      className="modal-overlay active exit-game-modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-card exit-game-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="exit-modal-header">
          <div className="exit-modal-icon-wrapper">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </div>
          <h3 className="modal-title">
            {getT("exitGameModalTitle", "Lopetetaanko peli?")}
          </h3>
        </div>

        <p className="exit-modal-message">
          {getT(
            "exitGameModalMessage",
            "Haluatko tallentaa pelin aiempiin peleihin myöhempää jatkamista varten vai hylätä sen kokonaan?"
          )}
        </p>

        <div className="exit-modal-actions">
          <button
            type="button"
            className="btn primary btn-exit-save"
            onClick={onSaveAndExit}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            <span>{getT("saveAndExitBtn", "Tallenna ja lopeta")}</span>
          </button>

          <button
            type="button"
            className="btn danger ghost btn-exit-discard"
            onClick={onDiscard}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
            <span>{getT("discardGameBtn", "Hylkää peli")}</span>
          </button>

          <button
            type="button"
            className="btn ghost btn-exit-cancel"
            onClick={onClose}
          >
            <span>{getT("cancelBtn", "Peruuta")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
