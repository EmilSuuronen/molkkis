import React from "react";
import { SettingsIcon } from "./icons/Icons";

export default function Header({ gameActive, onOpenSettings }) {
  if (gameActive) return null;

  return (
    <header className="app-header">
      {onOpenSettings && (
        <button
          type="button"
          className="btn-settings-header"
          onClick={onOpenSettings}
          title="Settings & Themes"
          aria-label="Settings & Themes"
        >
          <SettingsIcon size={20} />
        </button>
      )}
      <img src="./icons/icon-192.png" className="img-header" alt="Mölkkis icon" />
      <h1>Mölkkis</h1>
    </header>
  );
}
