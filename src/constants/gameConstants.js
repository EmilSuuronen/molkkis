export const PLAYER_COLORS = [
    "#e5c185", // Birch Wood Gold
    "#d96b53", // Terracotta Clay
    "#4e9f70", // Forest Moss Green
    "#4a8fe7", // Fjord Blue
    "#b873d9", // Heather Violet
    "#e68a3e", // Warm Amber
    "#50b4be", // Arctic Teal
    "#a3b18a"  // Sage Gray-Green
];

export const LOCAL_STORAGE_KEY = "molkkis_game_state";
export const MAX_VISIBLE_ROUNDS = 5;

export function assignPlayerColor(index) {
    return PLAYER_COLORS[index % PLAYER_COLORS.length];
}
