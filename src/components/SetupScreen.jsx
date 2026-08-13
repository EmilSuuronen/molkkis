import React, { useRef, useState } from "react";
import PwaInstallCard from "./PwaInstallCard";
import ColorPickerModal from "./ColorPickerModal";

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
  setupPlayers,
  setSetupPlayers,
  onStartGame,
  onRandomizeOrder,
  onAddPlayer,
  showAlert,
  gameActive,
  t
}) {
  const inputRefs = useRef([]);
  const [colorPickerIndex, setColorPickerIndex] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  if (gameActive) return null;

  const handleRemovePlayer = (index) => {
    setSetupPlayers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeName = (index, value) => {
    setSetupPlayers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], name: value };
      return next;
    });
  };

  const handleChangeColor = (colorHex) => {
    if (colorPickerIndex !== null && colorPickerIndex >= 0) {
      setSetupPlayers((prev) => {
        const next = [...prev];
        if (next[colorPickerIndex]) {
          next[colorPickerIndex] = { ...next[colorPickerIndex], color: colorHex };
        }
        return next;
      });
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    setSetupPlayers((prev) => {
      const next = [...prev];
      const [movedItem] = next.splice(draggedIndex, 1);
      next.splice(dropIndex, 0, movedItem);
      return next;
    });

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index === setupPlayers.length - 1) {
        onAddPlayer("", true, inputRefs);
      } else if (index >= 0 && index < setupPlayers.length - 1) {
        if (inputRefs.current[index + 1]) {
          inputRefs.current[index + 1].focus();
          inputRefs.current[index + 1].select();
        }
      }
    }
  };

  const handleStart = (e) => {
    if (e) e.preventDefault();
    if (setupPlayers.length === 0) {
      showAlert(t("minPlayersAlert"), t("playersTitle"));
      return;
    }
    onStartGame();
  };

  const activeColorPickerPlayer =
    colorPickerIndex !== null && setupPlayers[colorPickerIndex]
      ? setupPlayers[colorPickerIndex]
      : null;

  return (
    <main id="setup" className="screen active">
      {/* 1. Players Setup Card */}
      <section className="card card-players-setup">
        <div className="players-card-header">
          <div className="players-title-group">
            <h2 className="players-card-title">{t("playersTitle")}</h2>
            <span className="players-count-badge" title="Number of players">
              {setupPlayers.length}
            </span>
          </div>

          <button
            type="button"
            className="btn-shuffle-order"
            onClick={onRandomizeOrder}
            title={t("randomizeOrder")}
            aria-label={t("randomizeOrder")}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 3h5v5" />
              <path d="M4 20L21 3" />
              <path d="M21 16v5h-5" />
              <path d="M15 15l5 5" />
              <path d="M4 4l5 5" />
            </svg>
            <span>{t("randomizeOrder")}</span>
          </button>
        </div>

        <div id="playersList" className="players-list">
          {setupPlayers.map((player, index) => {
            const isDragging = draggedIndex === index;
            const isDragOver = dragOverIndex === index && draggedIndex !== index;

            return (
              <div
                className={`player-row ${isDragging ? "dragging" : ""} ${isDragOver ? "drag-over" : ""}`}
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              >
                {/* 6-Dot Grip Drag Handle */}
                <div
                  className="drag-handle"
                  title={t("turnOrderHint")}
                  aria-label="Drag to reorder"
                >
                  <svg width="12" height="18" viewBox="0 0 12 18" fill="currentColor">
                    <circle cx="3" cy="3" r="1.5" />
                    <circle cx="9" cy="3" r="1.5" />
                    <circle cx="3" cy="9" r="1.5" />
                    <circle cx="9" cy="9" r="1.5" />
                    <circle cx="3" cy="15" r="1.5" />
                    <circle cx="9" cy="15" r="1.5" />
                  </svg>
                </div>

                {/* Order Number Badge */}
                <span className="player-order-num">{index + 1}</span>

                {/* Color Selection Button */}
                <button
                  type="button"
                  className="btn-player-color-ball"
                  style={{ backgroundColor: player.color }}
                  onClick={() => setColorPickerIndex(index)}
                  title={t("colorPickerTitle")}
                  aria-label={`Change color for ${player.name || `Player ${index + 1}`}`}
                />

                {/* Seamless Inline Player Name Input */}
                <div className="player-name-field">
                  <input
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    className="player-name-input"
                    placeholder={!player.name ? t("playerPlaceholder", { num: index + 1 }) : ""}
                    value={player.name}
                    aria-label="Player name"
                    maxLength={12}
                    enterKeyHint="next"
                    onChange={(e) => handleChangeName(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                </div>

                {/* Delete Player Button */}
                <button
                  type="button"
                  className="btn-remove-player"
                  title={t("removePlayer")}
                  aria-label={`Remove ${player.name || `Player ${index + 1}`}`}
                  onClick={() => handleRemovePlayer(index)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        {/* Add Player Secondary CTA */}
        <div className="add-player-wrapper">
          <button
            type="button"
            id="addPlayerBtn"
            className="btn-add-player"
            onClick={() => onAddPlayer("", true, inputRefs)}
          >
            <span className="add-icon">+</span>
            <span>{t("addPlayer")}</span>
          </button>
        </div>

        {/* Drag Hint */}
        <div className="players-card-hint">
          <p>{t("turnOrderHint")}</p>
        </div>

        {/* Primary Start Game CTA */}
        <div className="start-game-wrapper">
          <button
            type="button"
            id="startGameBtn"
            className="btn-start-game-primary"
            onClick={handleStart}
          >
            {t("startGame")}
          </button>
        </div>
      </section>

      {/* 2. Mölkky Rules Section (Wide card on top of side-by-side row) */}
      <section className="card rules-card">
        <h2 className="rules-title">{t("rulesTitle")}</h2>
        <div className="rules-content">
          <div className="rule-item">
            <span className="rule-number">1</span>
            <div>
              <strong>{t("rule1Title")}</strong> {t("rule1Text")}
            </div>
          </div>
          <div className="rule-item">
            <span className="rule-number">2</span>
            <div>
              <strong>{t("rule2Title")}</strong>
              <ul>
                <li>{t("rule2Item1")}</li>
                <li>{t("rule2Item2")}</li>
              </ul>
            </div>
          </div>
          <div className="rule-item">
            <span className="rule-number">3</span>
            <div>
              <strong>{t("rule3Title")}</strong> {t("rule3Text")}
            </div>
          </div>
          <div className="rule-item">
            <span className="rule-number">4</span>
            <div>
              <strong>{t("rule4Title")}</strong> {t("rule4Text")}
            </div>
          </div>
          <div className="rule-item">
            <span className="rule-number">5</span>
            <div>
              <strong>{t("rule5Title")}</strong> {t("rule5Text")}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Side-by-Side Cards Row: Mölkky Setup Pin Diagram Card (Left) + PWA App Card (Right) */}
      <div className="setup-cards-row">
        {/* Mölkky Setup Pin Diagram Card (Left) */}
        <div className="card card-molkky-setup">
          <section className="molkky-board">
            <h2 className="molkky-title">{t("molkkySetupTitle")}</h2>

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

        {/* App Installation Card (Right) */}
        <PwaInstallCard showAlert={showAlert} t={t} />
      </div>

      {/* Color Picker Modal */}
      <ColorPickerModal
        isOpen={colorPickerIndex !== null}
        onClose={() => setColorPickerIndex(null)}
        selectedColor={activeColorPickerPlayer ? activeColorPickerPlayer.color : ""}
        onSelectColor={handleChangeColor}
        playerName={activeColorPickerPlayer ? activeColorPickerPlayer.name : ""}
        t={t}
      />
    </main>
  );
}
