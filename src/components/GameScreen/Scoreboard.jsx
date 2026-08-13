import React, { useEffect, useRef } from "react";
import { getCurrentRoundIndex } from "../../utils/gameLogic";
import { EditPenIcon } from "../icons/Icons";

export default function Scoreboard({
  players = [],
  currentPlayerIndex = 0,
  winners = [],
  editModeCell,
  onCellClick,
  gameActive,
  t
}) {
  const scrollContainerRef = useRef(null);
  const activeTurnCellRef = useRef(null);

  const safePlayers = Array.isArray(players) ? players : [];
  const safeWinners = Array.isArray(winners) ? winners : [];

  const numRounds = Math.max(
    ...safePlayers.map((p) => (p && Array.isArray(p.scores) ? p.scores.length : 0)),
    0
  );
  const activeRound = getCurrentRoundIndex(safePlayers);

  const getT = (key, params, fallback) => (t ? t(key, params) : fallback);

  useEffect(() => {
    if (activeTurnCellRef.current && scrollContainerRef.current) {
      try {
        const cellRect = activeTurnCellRef.current.getBoundingClientRect();
        const containerRect = scrollContainerRef.current.getBoundingClientRect();

        const targetLeft =
          scrollContainerRef.current.scrollLeft +
          (cellRect.left - containerRect.left) -
          containerRect.width / 2 +
          cellRect.width / 2;
        const targetTop =
          scrollContainerRef.current.scrollTop +
          (cellRect.top - containerRect.top) -
          containerRect.height / 2 +
          cellRect.height / 2;

        if (typeof scrollContainerRef.current.scrollTo === "function") {
          scrollContainerRef.current.scrollTo({
            left: Math.max(0, targetLeft),
            top: Math.max(0, targetTop),
            behavior: "smooth"
          });
        } else {
          scrollContainerRef.current.scrollLeft = Math.max(0, targetLeft);
          scrollContainerRef.current.scrollTop = Math.max(0, targetTop);
        }
      } catch (err) {
        console.warn("Auto-scroll failed silently:", err);
      }
    }
  }, [currentPlayerIndex, numRounds, safePlayers]);

  return (
    <section
      className="scoreboard card score-scroll-container"
      id="scoreScrollContainer"
      ref={scrollContainerRef}
    >
      <div id="scoreTable">
        {/* Header Row */}
        <div className="score-row header-row">
          <div className="round-header">{getT("roundHeader", {}, "#")}</div>
          {safePlayers.map((p, idx) => {
            if (!p) return null;
            const isActive =
              idx === currentPlayerIndex &&
              !p.eliminated &&
              !safeWinners.some((w) => w.playerIndex === idx);
            const w = safeWinners.find((w) => w.playerIndex === idx);
            const suffix = p.eliminated
              ? ` (${getT("eliminated", {}, "Out")})`
              : w
              ? ` (${w.place}.)`
              : "";
            const titleText = `${p.name || ""}${suffix}`;

            let headerClass = "player-name-header";
            if (isActive) headerClass += " active-player";
            if (p.eliminated) headerClass += " eliminated";

            return (
              <div
                key={idx}
                className={headerClass}
                title={titleText}
                style={{ backgroundColor: p.color }}
              >
                {p.name}
                {suffix}
              </div>
            );
          })}
        </div>

        {/* All Rounds */}
        {Array.from({ length: numRounds }).map((_, ri) => (
          <div className="score-row round" key={ri}>
            <div className="round-number">{ri + 1}</div>
            {safePlayers.map((player, pi) => {
              if (!player) return null;
              const isTurn =
                pi === currentPlayerIndex &&
                ri === activeRound &&
                !player.eliminated &&
                !safeWinners.some((w) => w.playerIndex === pi);

              const isEditing =
                editModeCell &&
                editModeCell.roundIndex === ri &&
                editModeCell.playerIndex === pi;

              let cellClass = "score-cell";
              if (isTurn) cellClass += " current-player";
              if (player.eliminated) cellClass += " eliminated";
              if (isEditing) cellClass += " editing";

              const scoreVal = player.scores ? player.scores[ri] : undefined;

              return (
                <div
                  key={pi}
                  ref={isTurn ? activeTurnCellRef : null}
                  id={isTurn ? "activeTurnCell" : undefined}
                  className={cellClass}
                  data-player-index={pi}
                  data-round-index={ri}
                  onClick={() => onCellClick(pi, ri)}
                >
                  {isEditing ? (
                    <span className="editing-cell-content">
                      <span>{scoreVal ?? "-"}</span>
                      <EditPenIcon size={12} className="edit-pen-icon" />
                    </span>
                  ) : (
                    scoreVal ?? "-"
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Totals Row */}
        <div className="score-row total-row">
          <div className="total-label">{getT("totalLabel", {}, "Total")}</div>
          {players.map((p, pi) => {
            const isActiveTotal =
              pi === currentPlayerIndex &&
              !p.eliminated &&
              !winners.some((w) => w.playerIndex === pi);

            let totalClass = "total-cell";
            if (isActiveTotal) totalClass += " active-total";
            if (p.eliminated) totalClass += " eliminated";

            return (
              <div key={pi} className={totalClass}>
                {p.total}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
