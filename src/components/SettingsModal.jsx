import React from "react";

export const THEMES = [
  {
    id: "default",
    name: "Default (Legacy Blue)",
    desc: "Midnight Slate with Vibrant Blue (#3877d3)",
    swatches: ["#0d1117", "#161b22", "#3877d3", "#2563eb", "#60a5fa"]
  },
  {
    id: "forest",
    name: "Forest Green",
    desc: "Pine Teal, Sea Green & Dry Sage",
    swatches: ["#121619", "#2d4739", "#09814a", "#bcb382", "#e5c687"]
  },
  {
    id: "kawai",
    name: "Kawai",
    desc: "Pastel Pink, Rose & Lavender",
    swatches: ["#1a1218", "#281a24", "#ff6b9d", "#f7aef8", "#ffd1dc"]
  },
  {
    id: "blackout",
    name: "Blackout",
    desc: "Pitch Black, Gray & Crimson",
    swatches: ["#080808", "#141414", "#ff2a2a", "#a3a3a3", "#ffffff"]
  },
  {
    id: "fire",
    name: "Fire",
    desc: "Blazing Orange, Amber & Flame",
    swatches: ["#140d0b", "#211411", "#ff5500", "#ffaa00", "#ff3300"]
  }
];

export default function SettingsModal({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  onClearData
}) {
  if (!isOpen) return null;

  const activeThemeObj = THEMES.find((t) => t.id === currentTheme) || THEMES[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card settings-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Application Settings</h2>
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
          {/* Section 1: Theme Dropdown */}
          <h3 className="settings-section-title">Color Theme</h3>
          <p className="settings-subtitle">Select your preferred color scheme:</p>

          <div className="theme-dropdown-wrapper">
            <select
              className="theme-select-input"
              value={currentTheme}
              onChange={(e) => onSelectTheme(e.target.value)}
              aria-label="Select color theme"
            >
              {THEMES.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>

          {/* Active Theme Preview Card */}
          {activeThemeObj && (
            <div className="theme-active-preview-card">
              <div className="theme-card-header">
                <span className="theme-name">{activeThemeObj.name}</span>
                <span className="theme-check-badge">✓ Active Theme</span>
              </div>
              <span className="theme-desc">{activeThemeObj.desc}</span>
              <div className="theme-swatches">
                {activeThemeObj.swatches.map((color, i) => (
                  <span
                    key={i}
                    className="swatch-dot"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Data & Storage Clear Option */}
          <div className="settings-danger-zone">
            <h3 className="settings-section-title danger-title">Data & Storage</h3>
            <p className="settings-subtitle">Clear all local storage and cached memory:</p>
            <button
              type="button"
              className="btn btn-clear-data"
              onClick={onClearData}
            >
              Clear Storage & Cache
            </button>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
