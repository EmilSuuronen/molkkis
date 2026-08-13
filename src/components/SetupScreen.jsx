import React, { useRef, useEffect } from "react";
import PwaInstallCard from "./PwaInstallCard";

export default function SetupScreen({
  playerNames,
  setPlayerNames,
  onStartGame,
  onRandomizeOrder,
  showAlert,
  gameActive
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
    e.preventDefault();
    if (playerNames.length === 0) {
      showAlert("Please add at least 1 player to start the game.", "No Players");
      return;
    }
    onStartGame();
  };

  return (
    <main id="setup" className="screen">
      <PwaInstallCard showAlert={showAlert} />

      <section className="card">
        <div className="card-header flex-header">
          <h2>Players</h2>
          <button
            type="button"
            id="randomizeOrderBtn"
            className="btn ghost small-btn"
            title="Randomize turn order"
            onClick={onRandomizeOrder}
          >
            🔀 Shuffle
          </button>
        </div>

        <div id="playersList" className="players-list">
          {playerNames.map((name, index) => (
            <div className="player-row" key={index}>
              <input
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                placeholder={!name ? `Player ${index + 1}` : ""}
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
                title="Remove"
                onClick={() => handleRemovePlayer(index)}
              >
                ✖
              </button>
            </div>
          ))}
        </div>

        <div className="button-group horizontal">
          <button
            type="button"
            id="addPlayerBtn"
            className="btn secondary"
            onClick={() => handleAddPlayer("", true)}
          >
            + Add Player
          </button>
          <button
            type="button"
            id="startGameBtn"
            className="btn primary"
            onClick={handleStart}
          >
            Start Game
          </button>
        </div>
      </section>

      {/* Accordion Mölkky Rules Section */}
      <section className="card rules-card">
        <details className="rules-details">
          <summary className="card-header rules-summary">
            <h2>Mölkky Rules & Scoring</h2>
            <span className="details-chevron">▼</span>
          </summary>
          <div className="rules-content">
            <div className="rule-item">
              <span className="rule-number">1</span>
              <div>
                <strong>Setup & Throw:</strong> Place pins 1–12 in a cluster 3–4 meters from the throwing line. Throw the Mölkky wooden pin underhand.
              </div>
            </div>
            <div className="rule-item">
              <span className="rule-number">2</span>
              <div>
                <strong>Scoring Points:</strong>
                <ul>
                  <li><strong>1 pin knocked down:</strong> Score the number printed on that pin (1–12 points).</li>
                  <li><strong>Multiple pins (2+):</strong> Score the total count of fallen pins (e.g. 4 pins = 4 points).</li>
                </ul>
              </div>
            </div>
            <div className="rule-item">
              <span className="rule-number">3</span>
              <div>
                <strong>50 Points to Win:</strong> The first player to reach <em>exactly 50 points</em> wins!
              </div>
            </div>
            <div className="rule-item">
              <span className="rule-number">4</span>
              <div>
                <strong>Bust Penalty (&gt;50 pts):</strong> If your total exceeds 50, your score drops back down to <strong>25 points</strong>.
              </div>
            </div>
            <div className="rule-item">
              <span className="rule-number">5</span>
              <div>
                <strong>3 Misses Elimination:</strong> Missing all pins 3 times in a row ("X") results in elimination from the game.
              </div>
            </div>
          </div>
        </details>
      </section>
    </main>
  );
}
