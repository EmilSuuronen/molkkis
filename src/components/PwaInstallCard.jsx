import React, { useState, useEffect } from "react";

export default function PwaInstallCard({ showAlert }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Check standalone mode
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;
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

  return (
    <section className="card pwa-card" id="card-mobile-app">
      <div className="card-header flex-header">
        <h2>Install Mobile App</h2>
      </div>
      <p className="pwa-text">Install Mölkkis as a mobile app for fast offline access and fullscreen scorekeeping.</p>
      <button id="installPwaBtn" className="btn secondary full-width" onClick={triggerPwaInstall}>
        Add to Home Screen
      </button>
    </section>
  );
}
