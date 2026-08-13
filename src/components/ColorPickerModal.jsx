import React from "react";
import { PLAYER_COLORS } from "../constants/gameConstants";

export default function ColorPickerModal({
  isOpen,
  onClose,
  selectedColor,
  onSelectColor,
  playerName = "",
  t
}) {
  if (!isOpen) return null;

  const getT = (key, fallback) => (t ? t(key) : fallback);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card color-picker-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{playerName ? `${playerName} - ${getT("colorPickerTitle", "Color")}` : getT("colorPickerTitle", "Select Color")}</h2>
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
          <p className="settings-subtitle">
            {getT("colorPickerSubtitle", "Choose a player color:")}
          </p>

          <div className="color-picker-grid">
            {PLAYER_COLORS.map((colorHex, idx) => {
              const isSelected = selectedColor === colorHex;
              return (
                <button
                  key={idx}
                  type="button"
                  className={`color-ball-btn ${isSelected ? "selected" : ""}`}
                  style={{ "--ball-color": colorHex }}
                  onClick={() => {
                    onSelectColor(colorHex);
                    onClose();
                  }}
                  title={`Color ${idx + 1}`}
                  aria-label={`Select color ${idx + 1}`}
                >
                  <span className="color-ball-inner" style={{ backgroundColor: colorHex }} />
                  {isSelected && <span className="color-ball-check">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn primary" onClick={onClose}>
            {getT("doneBtn", "Done")}
          </button>
        </div>
      </div>
    </div>
  );
}
