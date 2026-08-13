import React from "react";
import { FlagIcon } from "./icons/Flags.jsx";

export const LANGUAGES = [
  { id: "fi", name: "Suomi", flag: "fi" },
  { id: "en", name: "English", flag: "en" },
  { id: "sv", name: "Svenska", flag: "sv" }
];

export default function LanguageModal({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
  t
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card language-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{t("languageModalTitle")}</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="modal-body">
          <p className="settings-subtitle">{t("languageModalSubtitle")}</p>

          <div className="language-grid">
            {LANGUAGES.map((lang) => {
              const isSelected = currentLanguage === lang.id;
              return (
                <div
                  key={lang.id}
                  className={`language-card ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    onSelectLanguage(lang.id);
                    onClose();
                  }}
                >
                  <div className="language-flag-wrapper">
                    <FlagIcon lang={lang.flag} size={48} />
                  </div>
                  <span className="language-card-name">{lang.name}</span>
                  {isSelected && <span className="language-check-badge">✓</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn primary" onClick={onClose}>
            {t("doneBtn")}
          </button>
        </div>
      </div>
    </div>
  );
}
