import React, { useState } from "react";

export const THEME_CONFIGS = [
  {
    id: "default",
    nameKey: "themeDefault",
    descKey: "themeDefaultDesc",
    swatches: ["#0d1117", "#161b22", "#3877d3", "#2563eb", "#60a5fa"]
  },
  {
    id: "forest",
    nameKey: "themeForest",
    descKey: "themeForestDesc",
    swatches: ["#121619", "#2d4739", "#09814a", "#bcb382", "#e5c687"]
  },
  {
    id: "kawai",
    nameKey: "themeKawai",
    descKey: "themeKawaiDesc",
    swatches: ["#1a1218", "#281a24", "#ff6b9d", "#f7aef8", "#ffd1dc"]
  },
  {
    id: "blackout",
    nameKey: "themeBlackout",
    descKey: "themeBlackoutDesc",
    swatches: ["#080808", "#141414", "#ff2a2a", "#a3a3a3", "#ffffff"]
  },
  {
    id: "fire",
    nameKey: "themeFire",
    descKey: "themeFireDesc",
    swatches: ["#140d0b", "#211411", "#ff5500", "#ffaa00", "#ff3300"]
  }
];

export default function SettingsModal({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  onClearData,
  t
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const getT = (key, fallback) => (t ? t(key) : fallback);

  const activeThemeObj = THEME_CONFIGS.find((cfg) => cfg.id === currentTheme) || THEME_CONFIGS[0];

  const handleSelect = (themeId) => {
    onSelectTheme(themeId);
    setIsDropdownOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card settings-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{getT("settingsTitle", "Application Settings")}</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close settings"
          >
            &times;
          </button>
        </div>

        <div className="modal-body">
          {/* Section 1: Custom Styled Theme Dropdown */}
          <h3 className="settings-section-title">{getT("themeSectionTitle", "Color Theme")}</h3>
          <p className="settings-subtitle">{getT("themeSectionSubtitle", "Select your preferred color scheme:")}</p>

          <div className="custom-dropdown-container">
            <button
              type="button"
              className={`custom-dropdown-trigger ${isDropdownOpen ? "open" : ""}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
            >
              <div className="trigger-content">
                <span className="trigger-title">{getT(activeThemeObj.nameKey, activeThemeObj.id)}</span>
                <div className="trigger-swatches">
                  {activeThemeObj.swatches.map((color, i) => (
                    <span
                      key={i}
                      className="swatch-dot mini"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <svg
                className={`chevron-icon ${isDropdownOpen ? "open" : ""}`}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="custom-dropdown-menu" role="listbox">
                {THEME_CONFIGS.map((theme) => {
                  const isSelected = currentTheme === theme.id;
                  return (
                    <div
                      key={theme.id}
                      className={`custom-dropdown-item ${isSelected ? "selected" : ""}`}
                      onClick={() => handleSelect(theme.id)}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <div className="item-info">
                        <div className="item-header">
                          <span className="item-name">{getT(theme.nameKey, theme.id)}</span>
                          {isSelected && <span className="item-check">✓</span>}
                        </div>
                        <span className="item-desc">{getT(theme.descKey, "")}</span>
                      </div>
                      <div className="item-swatches">
                        {theme.swatches.map((color, i) => (
                          <span
                            key={i}
                            className="swatch-dot mini"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Data & Storage Clear Option */}
          <div className="settings-danger-zone">
            <h3 className="settings-section-title danger-title">{getT("dataSectionTitle", "Data & Storage")}</h3>
            <p className="settings-subtitle">{getT("dataSectionSubtitle", "Clear all local storage and cached memory:")}</p>
            <button
              type="button"
              className="btn btn-clear-data"
              onClick={onClearData}
            >
              {getT("clearDataBtn", "Clear Storage & Cache")}
            </button>
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
