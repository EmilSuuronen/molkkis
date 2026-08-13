import React, { useEffect, useRef } from "react";
import { getCurrentRoundIndex } from "../../utils/gameLogic";
import { EditPenIcon } from "../icons/Icons";

export default function Scoreboard({
  players,
  currentPlayerIndex,
  winners,
  editModeCell,
  onCellClick,
  gameActive,
  t
}) {
  const scrollContainerRef = useRef(null);
  const activeTurnCellRef = useRef(null);

  const numRounds = Math.max(...players.map((p) => p.scores.length), 0);
  const activeRound = getCurrentRoundIndex(players);

  const getT = (key, params, fallback) => (t ? t(key, params) : fallback);

  useEffect(() => {
    if (activeTurnCellRef.current && scrollContainerRef.current) {
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

      scrollContainerRef.current.scrollTo({
        left: Math.max(0, targetLeft),
        top: Math.max(0, targetTop),
        behavior: "smooth"
      });
    }
  }, [currentPlayerIndex, numRounds, players]);

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
          {players.map((p, idx) => {
            const isActive =
              idx === currentPlayerIndex &&
              !p.eliminated &&
              !winners.some((w) => w.playerIndex === idx);
            const w = winners.find((w) => w.playerIndex === idx);
            const suffix = p.eliminated
              ? ` (${getT("eliminated", {}, "Out")})`
              : w
              ? ` (${w.place}.)`
              : "";
            const titleText = `${p.name}${suffix}`;

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
            {players.map((player, pi) => {
              const isTurn =
                pi === currentPlayerIndex &&
                ri === activeRound &&
                !player.eliminated &&
                !winners.some((w) => w.playerIndex === pi);

              const isEditing =
                editModeCell &&
                editModeCell.roundIndex === ri &&
                editModeCell.playerIndex === pi;

              let cellClass = "score-cell";
              if (isTurn) cellClass += " current-player";
              if (player.eliminated) cellClass += " eliminated";
              if (isEditing) cellClass += " editing";

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
                      <span>{player.scores[ri] ?? "-"}</span>
                      <EditPenIcon size={12} className="edit-pen-icon" />
                    </span>
                  ) : (
                    player.scores[ri] ?? "-"
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
