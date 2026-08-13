import React from "react";
import { SettingsIcon } from "./icons/Icons";
import { FlagIcon } from "./icons/Flags";

export default function Header({
  gameActive,
  currentLanguage,
  onOpenLanguage,
  onOpenSettings,
  t
}) {
  if (gameActive) return null;

  return (
    <header className="app-header">
      {onOpenLanguage && (
        <button
          type="button"
          className="btn-language-header"
          onClick={onOpenLanguage}
          title={t ? t("languageModalTitle") : "Language"}
          aria-label="Select Language"
        >
          <FlagIcon lang={currentLanguage} size={22} />
        </button>
      )}

      {onOpenSettings && (
        <button
          type="button"
          className="btn-settings-header"
          onClick={onOpenSettings}
          title={t ? t("settingsTitle") : "Settings"}
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
