import React from "react";
import CurrentPlayerCard from "./CurrentPlayerCard";
import Scoreboard from "./Scoreboard";
import Keypad from "./Keypad";

export default function GameScreen({
  players = [],
  currentPlayerIndex = 0,
  winners = [],
  editModeCell,
  onCellClick,
  onKeyPress,
  onUndo,
  onEndGame,
  gameActive,
  t
}) {
  if (!gameActive || !Array.isArray(players) || players.length === 0) return null;

  const validIndex =
    currentPlayerIndex >= 0 && currentPlayerIndex < players.length
      ? currentPlayerIndex
      : 0;

  const currentPlayer = players[validIndex] || players[0];

  return (
    <main id="game" className="screen" style={{ display: "flex" }}>
      <CurrentPlayerCard
        player={currentPlayer}
        gameActive={gameActive}
        onEndGame={onEndGame}
        t={t}
      />
      <Scoreboard
        players={players}
        currentPlayerIndex={currentPlayerIndex}
        winners={winners}
        editModeCell={editModeCell}
        onCellClick={onCellClick}
        gameActive={gameActive}
        t={t}
      />
      <Keypad
        onKeyPress={onKeyPress}
        onUndo={onUndo}
        isEditing={Boolean(editModeCell)}
        t={t}
      />
    </main>
  );
}
