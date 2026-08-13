import React, { useState } from "react";
import { formatGameDate } from "../../utils/savedGamesStorage";

export default function SavedGamesSection({
  savedGames = [],
  onDeleteGame,
  onResumeGame,
  onOpenMatrix,
  t,
  currentLanguage
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getT = (key, params, fallback) => (t ? t(key, params) : fallback);

  // If no saved games exist, show placeholder card
  if (!savedGames || savedGames.length === 0) {
    return (
      <section className="card card-saved-games card-no-games">
        <div className="no-games-content">
          <div className="no-games-icon-wrapper">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
          </div>
          <h3 className="no-games-title">
            {getT("noGamesTitle", {}, "No Games Yet")}
          </h3>
          <p className="no-games-text">
            {getT("noGamesText", {}, "Play your first game and scores will automatically be saved here.")}
          </p>
        </div>
      </section>
    );
  }

  const visibleGames = isExpanded ? savedGames : savedGames.slice(0, 5);
  const hasMoreThanFive = savedGames.length > 5;

  return (
    <section className="card card-saved-games">
      <div className="saved-games-header">
        <div className="saved-games-title-group">
          <h2 className="saved-games-card-title">
            {getT("savedGamesTitle", {}, "Saved Games")}
          </h2>
          <span className="saved-games-count-badge" title="Total saved games">
            {savedGames.length}
          </span>
        </div>
      </div>

      <div className="saved-games-list">
        {visibleGames.map((game, index) => {
          const isLatest = index === 0;
          const isFinished = game.status === "finished";
          const dateFormatted = formatGameDate(game.timestamp, currentLanguage);

          // Find winner if present
          const winner = game.winners && game.winners.length > 0
            ? [...game.winners].sort((a, b) => a.place - b.place)[0]
            : null;

          return (
            <div
              key={game.id || index}
              className={`saved-game-item ${isLatest ? "latest-game-item" : ""}`}
            >
              {/* Top Row: Badges, Date & Delete Action */}
              <div className="saved-game-item-top">
                <div className="item-meta-badges">
                  {isLatest && (
                    <span className="badge-latest">
                      ⚡ {getT("latestGame", {}, "Latest Game")}
                    </span>
                  )}
                  <span className={`badge-status ${isFinished ? "status-finished" : "badge-status-cancelled"}`}>
                    {isFinished
                      ? `✓ ${getT("statusFinished", {}, "Finished")}`
                      : `⚠️ ${getT("statusCancelled", {}, "Cancelled")}`}
                  </span>
                  <span className="saved-game-date">{dateFormatted}</span>
                </div>

                <div className="item-actions">
                  <button
                    type="button"
                    className="btn-delete-saved-game"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteGame(game.id);
                    }}
                    title={getT("deleteGameTitle", {}, "Delete Game")}
                    aria-label={getT("deleteGameTitle", {}, "Delete Game")}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Main Winner/Status Banner */}
              {isFinished && winner ? (
                <div className="saved-game-winner-line">
                  <span className="winner-trophy-icon">🏆</span>
                  <span className="winner-text">
                    {getT("winnerLabel", { name: winner.name }, `Winner: ${winner.name}`)}
                  </span>
                  <span className="winner-score">({winner.total} p)</span>
                </div>
              ) : (
                <div className="saved-game-cancelled-line">
                  <span>{getT("noWinnerLabel", {}, "No winner (Cancelled)")}</span>
                </div>
              )}

              {/* Player Scores List */}
              <div className="saved-game-players-row">
                {game.players && game.players.map((p, pIdx) => {
                  const pWin = game.winners?.find((w) => w.playerIndex === pIdx);
                  return (
                    <div
                      key={pIdx}
                      className="saved-player-chip"
                      style={{ borderLeftColor: p.color || "var(--accent)" }}
                    >
                      <span
                        className="chip-color-dot"
                        style={{ backgroundColor: p.color || "var(--accent)" }}
                      />
                      <span className="chip-name">{p.name}</span>
                      <span className="chip-score">{p.total}p</span>
                      {pWin && <span className="chip-rank">#{pWin.place}</span>}
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons Row */}
              <div className="saved-game-cta-row">
                {!isFinished && onResumeGame && (
                  <button
                    type="button"
                    className="btn-resume-game-cta"
                    onClick={() => onResumeGame(game)}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span>{getT("resumeGame", {}, "Resume Game")}</span>
                  </button>
                )}
                <button
                  type="button"
                  className="btn-view-matrix-cta"
                  onClick={() => onOpenMatrix(game)}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="3" y1="15" x2="21" y2="15" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                    <line x1="15" y1="3" x2="15" y2="21" />
                  </svg>
                  <span>{getT("viewScoreboard", {}, "View Scoreboard")}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expand / Collapse Button if > 5 games */}
      {hasMoreThanFive && (
        <div className="saved-games-expand-wrapper">
          <button
            type="button"
            className="btn-expand-saved-games"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span>
              {isExpanded
                ? getT("showFewerGames", {}, "Show less")
                : getT("showAllGames", { count: savedGames.length }, `Show all (${savedGames.length})`)}
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease"
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
