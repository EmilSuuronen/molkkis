import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SetupScreen from "./components/SetupScreen";
import GameScreen from "./components/GameScreen/GameScreen";
import ModalDialog from "./components/ModalDialog";
import SettingsModal from "./components/SettingsModal";
import LanguageModal from "./components/LanguageModal";
import { TRANSLATIONS, getTranslation } from "./i18n/translations";
import {
  getRandomPlayerColor,
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

const THEME_STORAGE_KEY = "molkkis_theme";
const LANG_STORAGE_KEY = "molkkis_language";

export default function App() {
  const [setupPlayers, setSetupPlayers] = useState(() => {
    const c1 = getRandomPlayerColor([]);
    const c2 = getRandomPlayerColor([c1]);
    return [
      { name: "", color: c1 },
      { name: "", color: c2 }
    ];
  });

  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [winners, setWinners] = useState([]);
  const [nextPlace, setNextPlace] = useState(1);
  const [editModeCell, setEditModeCell] = useState(null);
  const [modal, setModal] = useState({ open: false });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const [currentTheme, setCurrentTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || "default";
    } catch (err) {
      return "default";
    }
  });

  const [currentLanguage, setCurrentLanguage] = useState(() => {
    try {
      return localStorage.getItem(LANG_STORAGE_KEY) || "fi";
    } catch (err) {
      return "fi";
    }
  });

  // Translation helper function
  const t = (key, params = {}) => getTranslation(currentLanguage, key, params);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
    } catch (err) {
      console.error("Failed to save theme to localStorage:", err);
    }
  }, [currentTheme]);

  // Persist language setting
  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, currentLanguage);
    } catch (err) {
      console.error("Failed to save language to localStorage:", err);
    }
  }, [currentLanguage]);

  // Load initial game state from LocalStorage on mount
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
  const showAlert = (message, title = "Notification", preventBackdropClose = true) => {
    return new Promise((resolve) => {
      setModal({
        open: true,
        title,
        message,
        confirmText: "OK",
        showCancel: false,
        preventBackdropClose,
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
        confirmText: t("confirmYesBtn"),
        cancelText: t("cancelBtn"),
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
    setSetupPlayers((prev) => shuffleArray(prev));
  };

  const handleAddPlayer = (name = "", shouldFocus = true, inputRefs = null) => {
    setSetupPlayers((prev) => {
      const usedColors = prev.map((p) => p.color);
      const nextColor = getRandomPlayerColor(usedColors);
      const next = [...prev, { name, color: nextColor }];
      if (shouldFocus && inputRefs) {
        requestAnimationFrame(() => {
          const lastIdx = next.length - 1;
          if (inputRefs.current && inputRefs.current[lastIdx]) {
            inputRefs.current[lastIdx].focus();
            inputRefs.current[lastIdx].select();
            inputRefs.current[lastIdx].scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        });
      }
      return next;
    });
  };

  const handleStartGame = () => {
    const newPlayers = setupPlayers.map((sp, index) => ({
      name: sp.name.trim() || t("playerPlaceholder", { num: index + 1 }),
      color: sp.color || getRandomPlayerColor(),
      scores: [],
      total: 0,
      misses: 0,
      eliminated: false
    }));

    if (newPlayers.length === 0) {
      showAlert(t("minPlayersAlert"), t("playersTitle"));
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
    let message = `${t("rankingsTitle")}:\n\n`;
    finalWinners
      .sort((a, b) => a.place - b.place)
      .forEach((w) => {
        message += `${w.place}. ${w.name} (${w.total} p)\n`;
      });
    await showAlert(message, `🏆 ${t("gameOverTitle")}`);
    setGameActive(false);
  };

  const handleEndGame = async () => {
    if (!gameActive) return;
    const confirmEnd = await showConfirm(
      t("endGameConfirmMessage"),
      t("endGameConfirmTitle")
    );
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

  const handleClearData = async () => {
    setIsSettingsOpen(false);
    const confirmed = await showConfirm(
      t("clearConfirmMessage"),
      t("clearConfirmTitle")
    );

    if (!confirmed) {
      setIsSettingsOpen(true);
      return;
    }

    try {
      localStorage.clear();
    } catch (err) {
      console.error("Failed to clear localStorage:", err);
    }

    if ("caches" in window) {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      } catch (err) {
        console.error("Failed to clear CacheStorage:", err);
      }
    }

    window.location.reload();
  };

  return (
    <div id="appRoot">
      <Header
        gameActive={gameActive}
        currentLanguage={currentLanguage}
        onOpenLanguage={() => setIsLanguageOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        t={t}
      />
      <SetupScreen
        setupPlayers={setupPlayers}
        setSetupPlayers={setSetupPlayers}
        onStartGame={handleStartGame}
        onRandomizeOrder={handleRandomizeOrder}
        onAddPlayer={handleAddPlayer}
        showAlert={showAlert}
        gameActive={gameActive}
        t={t}
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
        t={t}
      />
      <Footer gameActive={gameActive} />
      <ModalDialog modal={modal} onClose={() => setModal({ open: false })} />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
        onClearData={handleClearData}
        t={t}
      />
      <LanguageModal
        isOpen={isLanguageOpen}
        onClose={() => setIsLanguageOpen(false)}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
        t={t}
      />
    </div>
  );
}
