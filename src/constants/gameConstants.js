export const PLAYER_COLORS = [
  "#3877d3", // 1. Vibrant Fjord Blue
  "#f14a26", // 2. Crimson Clay Red
  "#a44e3c", // 3. Forest Pine Green
  "#fbb54f", // 4. Soft Honey Gold
  "#9b51e0", // 5. Royal Purple
  "#e04884", // 6. Vibrant Rose Pink
  "#2db8b8", // 7. Arctic Turquoise
  "#e67e22", // 8. Sunburst Orange
  "#27ae60", // 9. Emerald Green
  "#b20000", // 10. Deep Cobalt Blue
  "#d35400", // 11. Burnt Sienna
  "#8e44ad", // 12. Mulberry Violet
  "#16a085", // 13. Deep Sea Teal
  "#f366a6", // 14. Bright Magenta
  "#f39c12", // 15. Warm Amber Gold
  "#00623f"  // 16. Indigo Lavender
];

export const LOCAL_STORAGE_KEY = "molkkis_game_state";
export const MAX_VISIBLE_ROUNDS = 5;

// Pick a random color from the 16 available colors
export function getRandomPlayerColor(usedColors = []) {
  const unused = PLAYER_COLORS.filter((c) => !usedColors.includes(c));
  if (unused.length > 0) {
    return unused[Math.floor(Math.random() * unused.length)];
  }
  return PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)];
}

export function assignPlayerColor(index, usedColors = []) {
  return getRandomPlayerColor(usedColors);
}
