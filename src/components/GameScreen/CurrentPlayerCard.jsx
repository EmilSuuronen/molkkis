import React from "react";
import { ExitIcon } from "../icons/Icons";

export default function CurrentPlayerCard({ player, gameActive, onEndGame, t }) {
  if (!gameActive || !player || player.eliminated) return null;

  const remaining = Math.max(50 - player.total, 0);
  const pct = Math.min((player.total / 50) * 100, 100);

  const getT = (key, params, fallback) => (t ? t(key, params) : fallback);

  return (
    <div id="currentPlayerCard" className="card current-player-card">
      <div className="current-player-top">
        <div className="current-player-info">
          <h3 style={{ color: player.color }}>
            {getT("turnIndicator", { name: player.name }, `${player.name}'s Turn`)}
          </h3>
          <p>
            <strong>{remaining}</strong> {getT("pointsToWin", {}, "points to win")}
          </p>
        </div>
        {onEndGame && (
          <button
            type="button"
            className="btn-exit-game"
            onClick={onEndGame}
            title={getT("exitGameBtn", {}, "Exit game")}
            aria-label="Exit game"
          >
            <ExitIcon size={18} />
          </button>
        )}
      </div>
      <div className="turn-progress-wrapper">
        <div className="turn-progress-track">
          <div
            className="turn-progress-fill"
            style={{ width: `${pct}%`, backgroundColor: player.color }}
          />
        </div>
        <span className="turn-progress-text">{player.total}/50</span>
      </div>
    </div>
  );
}
