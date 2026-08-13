import React, { useEffect } from "react";
import Scoreboard from "../GameScreen/Scoreboard";
import { formatGameDate } from "../../utils/savedGamesStorage";

export default function SavedGameMatrixModal({
  isOpen,
  onClose,
  game,
  onResumeGame,
  onDeleteGame,
  t,
  currentLanguage
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !game) return null;

  const isFinished = game.status === "finished";
  const dateStr = formatGameDate(game.timestamp, currentLanguage);
  const getT = (key, params, fallback) => (t ? t(key, params) : fallback);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Find winner if present
  const winner = game.winners && game.winners.length > 0
    ? [...game.winners].sort((a, b) => a.place - b.place)[0]
    : null;

  return (
    <div
      className="modal-overlay active saved-game-matrix-overlay"
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div className="modal-card saved-game-matrix-card">
        {/* Header */}
        <div className="saved-matrix-header">
          <div>
            <h3 className="modal-title">
              {getT("savedGameMatrixTitle", {}, "Game Scoreboard")}
            </h3>
            <span className="saved-matrix-date">
              📅 {getT("playedAt", { date: dateStr }, `Played: ${dateStr}`)}
            </span>
          </div>
          <button
            type="button"
            className="btn-close-modal"
            onClick={onClose}
            aria-label={getT("closeBtn", {}, "Close")}
            title={getT("closeBtn", {}, "Close")}
          >
            ✕
          </button>
        </div>

        {/* Status & Summary Banner */}
        <div className={`saved-matrix-banner ${isFinished ? "banner-finished" : "banner-cancelled"}`}>
          <div className="matrix-status-pills">
            <span className={`status-pill ${isFinished ? "pill-finished" : "pill-cancelled"}`}>
              {isFinished
                ? `✓ ${getT("statusFinished", {}, "Finished")}`
                : `⚠️ ${getT("statusCancelled", {}, "Cancelled")}`}
            </span>
            {isFinished && winner && (
              <span className="winner-pill">
                🏆 {getT("winnerLabel", { name: winner.name }, `Winner: ${winner.name}`)}
              </span>
            )}
          </div>

          {/* Player Summary Pills */}
          <div className="matrix-players-summary">
            {game.players && game.players.map((p, idx) => {
              const pWin = game.winners?.find((w) => w.playerIndex === idx);
              return (
                <div
                  key={idx}
                  className={`player-summary-badge ${p.eliminated ? "eliminated" : ""}`}
                  style={{ borderLeftColor: p.color || "var(--accent)" }}
                >
                  <span
                    className="summary-color-dot"
                    style={{ backgroundColor: p.color || "var(--accent)" }}
                  />
                  <span className="summary-player-name">{p.name}</span>
                  <span className="summary-player-score">{p.total} p</span>
                  {pWin && <span className="summary-rank">#{pWin.place}</span>}
                  {p.eliminated && <span className="summary-out-badge">✕</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Full Scoreboard Matrix */}
        <div className="saved-matrix-board-wrapper">
          <Scoreboard
            players={game.players || []}
            currentPlayerIndex={-1}
            winners={game.winners || []}
            editModeCell={null}
            onCellClick={() => {}}
            gameActive={false}
            t={t}
          />
        </div>

        {/* Actions Footer */}
        <div className="modal-actions modal-actions-split">
          {!isFinished && onResumeGame && (
            <button
              type="button"
              className="btn primary btn-resume-modal-action"
              onClick={() => {
                onClose();
                onResumeGame(game);
              }}
            >
              ▶ {getT("resumeGame", {}, "Resume Game")}
            </button>
          )}

          {onDeleteGame && (
            <button
              type="button"
              className="btn danger ghost"
              onClick={() => {
                onClose();
                onDeleteGame(game.id);
              }}
            >
              🗑 {getT("deleteGameBtn", {}, "Delete Game")}
            </button>
          )}

          <button type="button" className="btn ghost" onClick={onClose}>
            {getT("closeBtn", {}, "Close")}
          </button>
        </div>
      </div>
    </div>
  );
}
