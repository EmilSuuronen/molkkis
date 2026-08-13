import React from "react";
import CurrentPlayerCard from "./CurrentPlayerCard";
import Scoreboard from "./Scoreboard";
import Keypad from "./Keypad";

export default function GameScreen({
  players,
  currentPlayerIndex,
  winners,
  editModeCell,
  onCellClick,
  onKeyPress,
  onUndo,
  onEndGame,
  gameActive
}) {
  if (!gameActive) return null;

  const currentPlayer = players[currentPlayerIndex];

  return (
    <main id="game" className="screen" style={{ display: "flex" }}>
      <CurrentPlayerCard
        player={currentPlayer}
        gameActive={gameActive}
        onEndGame={onEndGame}
      />
      <Scoreboard
        players={players}
        currentPlayerIndex={currentPlayerIndex}
        winners={winners}
        editModeCell={editModeCell}
        onCellClick={onCellClick}
        gameActive={gameActive}
      />
      <Keypad
        onKeyPress={onKeyPress}
        onUndo={onUndo}
      />
    </main>
  );
}
