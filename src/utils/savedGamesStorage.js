import { SAVED_GAMES_STORAGE_KEY } from "../constants/gameConstants";

/**
 * Retrieve saved games array from localStorage.
 * Always returns games sorted newest first.
 */
export function getSavedGames() {
  try {
    const raw = localStorage.getItem(SAVED_GAMES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  } catch (err) {
    console.error("Failed to load saved games from localStorage:", err);
    return [];
  }
}

/**
 * Save a new game (or update existing) into localStorage history.
 */
export function saveGameToHistory(gameData) {
  try {
    const current = getSavedGames();
    const newGame = {
      id: gameData.id || `game_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      status: gameData.status || "finished", // "finished" | "cancelled"
      players: gameData.players || [],
      winners: gameData.winners || [],
      nextPlace: gameData.nextPlace || 1,
      currentPlayerIndex: gameData.currentPlayerIndex || 0,
      winnerName: gameData.winnerName || (gameData.winners && gameData.winners[0]?.name) || null
    };

    // If game with same ID exists, update it, otherwise prepend
    const existingIndex = current.findIndex((g) => g.id === newGame.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = newGame;
    } else {
      updated = [newGame, ...current];
    }
    updated.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    localStorage.setItem(SAVED_GAMES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Failed to save game to localStorage history:", err);
    return getSavedGames();
  }
}

/**
 * Delete a saved game by ID from localStorage.
 */
export function deleteSavedGame(gameId) {
  try {
    const current = getSavedGames();
    const updated = current.filter((g) => g.id !== gameId);
    localStorage.setItem(SAVED_GAMES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Failed to delete saved game from localStorage:", err);
    return getSavedGames();
  }
}

/**
 * Format timestamp into localized date & time string.
 */
export function formatGameDate(timestamp, lang = "fi") {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const localeMap = { fi: "fi-FI", en: "en-US", sv: "sv-SE" };
  const locale = localeMap[lang] || "fi-FI";
  try {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  } catch (err) {
    return date.toLocaleString();
  }
}
