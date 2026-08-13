import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SetupScreen from "./components/SetupScreen";
import GameScreen from "./components/GameScreen/GameScreen";
import ModalDialog from "./components/ModalDialog";
import {
  assignPlayerColor,
  LOCAL_STORAGE_KEY
} from "./constants/gameConstants";
import {
  shuffleArray,
  getCurrentRoundIndex,
  getActivePlayerIndexes,
  ensureValidCurrentPlayer,
  recalcGameState,
  getNextTurnIndex,
  maybeStartNewRoundAndAlignTurn,
  undoLastScore
} from "./utils/gameLogic";

export default function App() {
  const [playerNames, setPlayerNames] = useState(["", ""]);
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [winners, setWinners] = useState([]);
  const [nextPlace, setNextPlace] = useState(1);
  const [editModeCell, setEditModeCell] = useState(null);
  const [modal, setModal] = useState({ open: false });

  // Load initial state from LocalStorage on mount
  useEffect(() => {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (data) {
        const state = JSON.parse(data);
        if (
          state &&
          state.gameActive &&
          Array.isArray(state.players) &&
          state.players.length > 0
        ) {
          const { players: calcPlayers, winners: calcWinners, nextPlace: calcNext } =
            recalcGameState(state.players, state.winners || [], state.nextPlace || 1);

          setPlayers(calcPlayers);
          setWinners(calcWinners);
          setNextPlace(calcNext);
          setCurrentPlayerIndex(state.currentPlayerIndex || 0);
          setGameActive(true);
          return;
        }
      }
    } catch (err) {
      console.error("Failed to load game state from localStorage:", err);
    }
  }, []);

  // Save game state to LocalStorage
  useEffect(() => {
    if (gameActive && players.length > 0) {
      const state = {
        players,
        currentPlayerIndex,
        gameActive,
        winners,
        nextPlace
      };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
      } catch (err) {
        console.error("Failed to save state to localStorage:", err);
      }
    } else {
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch (err) {
        console.error("Failed to clear localStorage:", err);
      }
    }
  }, [players, currentPlayerIndex, gameActive, winners, nextPlace]);

  // Toggle body class "in-game"
  useEffect(() => {
    if (gameActive) {
      document.body.classList.add("in-game");
    } else {
      document.body.classList.remove("in-game");
    }
  }, [gameActive]);

  // Alert and Confirm helper promise wrappers
  const showAlert = (message, title = "Notification") => {
    return new Promise((resolve) => {
      setModal({
        open: true,
        title,
        message,
        confirmText: "OK",
        showCancel: false,
        onConfirm: () => {
          setModal({ open: false });
          resolve(true);
        }
      });
    });
  };

  const showConfirm = (message, title = "Confirmation") => {
    return new Promise((resolve) => {
      setModal({
        open: true,
        title,
        message,
        confirmText: "Yes",
        cancelText: "Cancel",
        showCancel: true,
        onConfirm: () => {
          setModal({ open: false });
          resolve(true);
        },
        onCancel: () => {
          setModal({ open: false });
          resolve(false);
        }
      });
    });
  };

  const handleRandomizeOrder = () => {
    setPlayerNames((prev) => shuffleArray(prev));
  };

  const handleStartGame = () => {
    const newPlayers = playerNames.map((name, index) => ({
      name: name.trim() || `Player ${index + 1}`,
      color: assignPlayerColor(index),
      scores: [],
      total: 0,
      misses: 0,
      eliminated: false
    }));

    if (newPlayers.length === 0) {
      showAlert("Please add at least 1 player to start the game.", "No Players");
      return;
    }

    setPlayers(newPlayers);
    setCurrentPlayerIndex(0);
    setWinners([]);
    setNextPlace(1);
    setGameActive(true);
    setEditModeCell(null);
  };

  const handleCellClick = (playerIndex, roundIndex) => {
    if (
      editModeCell &&
      editModeCell.playerIndex === playerIndex &&
      editModeCell.roundIndex === roundIndex
    ) {
      setEditModeCell(null);
    } else {
      setEditModeCell({ playerIndex, roundIndex });
    }
  };

  const handleKeyPress = (value) => {
    if (!gameActive) return;

    // Editing mode cell update
    if (editModeCell) {
      const { playerIndex: pi, roundIndex: ri } = editModeCell;
      const updatedPlayers = players.map((p, idx) => {
        if (idx === pi) {
          const newScores = [...p.scores];
          newScores[ri] = value === "X" ? "X" : parseInt(value, 10);
          return { ...p, scores: newScores };
        }
        return p;
      });

      const { players: calcPlayers, winners: calcWinners, nextPlace: calcNext } =
        recalcGameState(updatedPlayers, winners, nextPlace);

      setPlayers(calcPlayers);
      setWinners(calcWinners);
      setNextPlace(calcNext);
      setEditModeCell(null);
      return;
    }

    // Normal scoring turn
    let updatedPlayers = players.map((p) => ({ ...p, scores: [...p.scores] }));
    let roundIndex = getCurrentRoundIndex(updatedPlayers);

    if (roundIndex < 0) {
      updatedPlayers = updatedPlayers.map((p) => ({ ...p, scores: ["-"] }));
      roundIndex = 0;
    }

    updatedPlayers = updatedPlayers.map((p) => {
      if (p.scores.length <= roundIndex) {
        return { ...p, scores: [...p.scores, "-"] };
      }
      return p;
    });

    const val = value === "X" ? "X" : parseInt(value, 10);
    updatedPlayers[currentPlayerIndex].scores[roundIndex] = val;

    // Recalculate game state (totals, misses, eliminations, winners)
    let { players: calcPlayers, winners: calcWinners, nextPlace: calcNext } =
      recalcGameState(updatedPlayers, winners, nextPlace);

    // Advance turn to next active player
    let nextTurn = getNextTurnIndex(calcPlayers, currentPlayerIndex, calcWinners);

    // Check if the round is complete for all active players
    const { updatedPlayers: alignedPlayers, newTurnIndex: finalTurn } =
      maybeStartNewRoundAndAlignTurn(calcPlayers, nextTurn, calcWinners);

    setPlayers(alignedPlayers);
    setWinners(calcWinners);
    setNextPlace(calcNext);

    // Check if game active with single remaining player
    const active = getActivePlayerIndexes(alignedPlayers, calcWinners);
    if (active.length === 1 && calcWinners.length > 0) {
      const last = active[0];
      const finalWinners = [
        ...calcWinners,
        {
          playerIndex: last,
          name: alignedPlayers[last].name,
          total: alignedPlayers[last].total,
          place: calcNext
        }
      ];
      setWinners(finalWinners);
      setGameActive(false);
      showFinalResults(finalWinners);
    } else {
      setCurrentPlayerIndex(finalTurn);
    }
  };

  const handleUndo = () => {
    const { updatedPlayers, newTurnIndex } = undoLastScore(players, currentPlayerIndex);
    const { players: calcPlayers, winners: calcWinners, nextPlace: calcNext } =
      recalcGameState(updatedPlayers, winners, nextPlace);

    const validTurn = ensureValidCurrentPlayer(calcPlayers, newTurnIndex, calcWinners);

    setPlayers(calcPlayers);
    setWinners(calcWinners);
    setNextPlace(calcNext);
    setCurrentPlayerIndex(validTurn);
    setEditModeCell(null);
  };

  const showFinalResults = async (finalWinners = winners) => {
    let message = "Final Results:\n\n";
    finalWinners
      .sort((a, b) => a.place - b.place)
      .forEach((w) => {
        message += `${w.place}. ${w.name} (${w.total} points)\n`;
      });
    await showAlert(message, "🏆 Game Over!");
    setGameActive(false);
  };

  const handleEndGame = async () => {
    if (!gameActive) return;
    const confirmEnd = await showConfirm("Are you sure you want to end the game?", "End Game");
    if (!confirmEnd) return;

    let finalWinners = [...winners];
    let place = nextPlace;

    players.forEach((p, i) => {
      if (!finalWinners.some((w) => w.playerIndex === i)) {
        finalWinners.push({
          playerIndex: i,
          name: p.name,
          total: p.total,
          place: place++
        });
      }
    });

    setWinners(finalWinners);
    setNextPlace(place);
    await showFinalResults(finalWinners);
    setGameActive(false);
  };

  return (
    <div id="appRoot">
      <Header gameActive={gameActive} />
      <SetupScreen
        playerNames={playerNames}
        setPlayerNames={setPlayerNames}
        onStartGame={handleStartGame}
        onRandomizeOrder={handleRandomizeOrder}
        showAlert={showAlert}
        gameActive={gameActive}
      />
      <GameScreen
        players={players}
        currentPlayerIndex={currentPlayerIndex}
        winners={winners}
        editModeCell={editModeCell}
        onCellClick={handleCellClick}
        onKeyPress={handleKeyPress}
        onUndo={handleUndo}
        onEndGame={handleEndGame}
        gameActive={gameActive}
      />
      <Footer gameActive={gameActive} />
      <ModalDialog modal={modal} onClose={() => setModal({ open: false })} />
    </div>
  );
}
