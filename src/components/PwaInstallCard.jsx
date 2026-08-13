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
    <section className="card" id="card-mobile-app">
      <h2>{getT("appAvailableTitle", "App Available!")}</h2>
      <div className="div-app-icon">
        <img src="./icons/icon-192.png" className="img-app-icon" alt="app-image" />
        <b>Mölkkis</b>
      </div>
      <p style={{ margin: "8px 0 12px", textAlign: "center" }}>
        {getT(
          "appAvailableText",
          "On a cottage with bad internet? Install the mobile app for offline use."
        )}
      </p>
      <button id="installPwaBtn" className="btn primary" onClick={triggerPwaInstall}>
        {getT("installAppBtn", "Install App")}
      </button>
    </section>
  );
}
