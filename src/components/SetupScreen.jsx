import React, { useRef, useState } from "react";
import PwaInstallCard from "./PwaInstallCard";

function LogPin({ number }) {
  const [popped, setPopped] = useState(false);

  const handlePop = (e) => {
    e.stopPropagation();
    setPopped(true);
    setTimeout(() => {
      setPopped(false);
    }, 60);
  };

  return (
    <div
      className={`log ${popped ? "popped" : ""}`}
      onClick={handlePop}
      onTouchStart={handlePop}
      role="button"
      tabIndex={0}
      aria-label={`Mölkky pin ${number}`}
    >
      {number}
    </div>
  );
}

export default function SetupScreen({
  playerNames,
  setPlayerNames,
  onStartGame,
  onRandomizeOrder,
  showAlert,
  gameActive,
  t
}) {
  const inputRefs = useRef([]);

  if (gameActive) return null;

  const handleAddPlayer = (name = "", shouldFocus = true) => {
    setPlayerNames((prev) => {
      const next = [...prev, name];
      if (shouldFocus) {
        requestAnimationFrame(() => {
          const lastIdx = next.length - 1;
          if (inputRefs.current[lastIdx]) {
            inputRefs.current[lastIdx].focus();
            inputRefs.current[lastIdx].select();
            inputRefs.current[lastIdx].scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        });
      }
      return next;
    });
  };

  const handleRemovePlayer = (index) => {
    setPlayerNames((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMove = (index, direction) => {
    setPlayerNames((prev) => {
      const next = [...prev];
      const targetIdx = direction === "up" ? index - 1 : index + 1;
      if (targetIdx < 0 || targetIdx >= next.length) return prev;
      [next[index], next[targetIdx]] = [next[targetIdx], next[index]];
      return next;
    });
  };

  const handleChangeName = (index, value) => {
    setPlayerNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index === playerNames.length - 1) {
        handleAddPlayer("", true);
      } else if (index >= 0 && index < playerNames.length - 1) {
        if (inputRefs.current[index + 1]) {
          inputRefs.current[index + 1].focus();
          inputRefs.current[index + 1].select();
        }
      }
    }
  };

  const handleStart = (e) => {
    if (e) e.preventDefault();
    if (playerNames.length === 0) {
      showAlert(t("minPlayersAlert"), t("playersTitle"));
      return;
    }
    onStartGame();
  };

  return (
    <main id="setup" className="screen active">
      {/* 1. Players Setup Card */}
      <section className="card">
        <h2>{t("playersTitle")}</h2>
        <div id="playersList" className="players-list">
          {playerNames.map((name, index) => (
            <div className="player-row" key={index}>
              <input
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                placeholder={!name ? t("playerPlaceholder", { num: index + 1 }) : ""}
                value={name}
                aria-label="Player name"
                maxLength={12}
                enterKeyHint="next"
                onChange={(e) => handleChangeName(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
              <div className="order-buttons">
                <button
                  type="button"
                  className="btn"
                  data-dir="up"
                  title="Move up"
                  onClick={() => handleMove(index, "up")}
                >
                  ▲
                </button>
                <button
                  type="button"
                  className="btn"
                  data-dir="down"
                  title="Move down"
                  onClick={() => handleMove(index, "down")}
                >
                  ▼
                </button>
              </div>
              <button
                type="button"
                className="btn remove-btn"
                title={t("removePlayer")}
                onClick={() => handleRemovePlayer(index)}
              >
                ✖
              </button>
            </div>
          ))}
        </div>

        <div className="setup-actions">
          <button
            type="button"
            id="addPlayerBtn"
            className="btn"
            onClick={() => handleAddPlayer("", true)}
          >
            {t("addPlayer")}
          </button>
          <button
            type="button"
            id="randomizeOrderBtn"
            className="btn ghost"
            onClick={onRandomizeOrder}
          >
            {t("randomizeOrder")}
          </button>
        </div>

        <div className="legend">
          <p>{t("turnOrderHint")}</p>
        </div>

        <div className="start-actions">
          <button
            type="button"
            id="startGameBtn"
            className="btn primary"
            onClick={handleStart}
          >
            {t("startGame")}
          </button>
        </div>
      </section>

      {/* 2. PWA Install Card */}
      <PwaInstallCard showAlert={showAlert} t={t} />

      {/* 3. Mölkky Setup Pin Diagram Card */}
      <div className="card">
        <section className="molkky-board">
          <h3 className="molkky-title">{t("molkkySetupTitle")}</h3>

          <div className="molkky-rows">
            {/* Row 1: 3 logs */}
            <div className="molkky-row">
              <LogPin number={7} />
              <LogPin number={9} />
              <LogPin number={8} />
            </div>

            {/* Row 2: 4 logs */}
            <div className="molkky-row">
              <LogPin number={5} />
              <LogPin number={11} />
              <LogPin number={12} />
              <LogPin number={6} />
            </div>

            {/* Row 3: 3 logs */}
            <div className="molkky-row">
              <LogPin number={3} />
              <LogPin number={10} />
              <LogPin number={4} />
            </div>

            {/* Row 4: 2 logs */}
            <div className="molkky-row">
              <LogPin number={1} />
              <LogPin number={2} />
            </div>
          </div>

          <p className="molkky-note">{t("molkkySetupNote")}</p>
        </section>
      </div>
    </main>
  );
}
