import React, { useState, useEffect } from "react";

export default function PwaInstallCard({ showAlert, t }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      navigator.standalone;
    if (isStandalone) {
      setVisible(false);
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setVisible(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  if (!visible) return null;

  const triggerPwaInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          setVisible(false);
        }
        setDeferredPrompt(null);
      });
    } else {
      showAlert(
        "To install Mölkkis:\n\n• iOS (Safari): Tap the Share icon and select 'Add to Home Screen'.\n• Android / Chrome: Tap the menu (⋮) and select 'Install app' or 'Add to Home Screen'.",
        "App Installation"
      );
    }
  };

  const getT = (key, fallback) => (t ? t(key) : fallback);

  return (
    <section className="card card-pwa-install" id="card-mobile-app">
      <div className="pwa-card-header">
        <h2 className="pwa-card-title">{getT("appAvailableTitle", "App Available!")}</h2>
      </div>

      <div className="pwa-card-body">
        <div className="pwa-app-icon-wrapper">
          <img src="./icons/icon-192.png" className="pwa-app-icon" alt="Mölkkis App Icon" />
          <span className="pwa-app-label">Mölkkis</span>
        </div>

        <div className="pwa-app-info">
          <p className="pwa-app-desc">
            {getT(
              "appAvailableText",
              "On a cottage with bad internet? Install the mobile app for offline use."
            )}
          </p>
        </div>
      </div>

      <div className="pwa-card-actions">
        <button id="installPwaBtn" className="btn-install-pwa" onClick={triggerPwaInstall}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>{getT("installAppBtn", "Install App")}</span>
        </button>
      </div>
    </section>
  );
}
