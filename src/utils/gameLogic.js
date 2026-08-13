import { assignPlayerColor } from "../constants/gameConstants";

export function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export function getCurrentRoundIndex(players) {
    if (!players || players.length === 0) return -1;
    return Math.max(...players.map(p => p.scores.length - 1), -1);
}

export function getActivePlayerIndexes(players, winners = []) {
    const active = [];
    for (let i = 0; i < players.length; i++) {
        const isWinner = winners.some(w => w.playerIndex === i);
        if (!players[i].eliminated && !isWinner) {
            active.push(i);
        }
    }
    return active;
}

export function ensureValidCurrentPlayer(players, currentPlayerIndex, winners = []) {
    if (!players || players.length === 0) return 0;
    const isCurrentActive = !players[currentPlayerIndex]?.eliminated &&
        !winners.some(w => w.playerIndex === currentPlayerIndex);

    if (!isCurrentActive) {
        const active = getActivePlayerIndexes(players, winners);
        if (active.length > 0) {
            let found = active.find(i => i >= currentPlayerIndex);
            if (found === undefined) found = active[0];
            return found;
        }
    }
    return currentPlayerIndex;
}

export function recalcGameState(playersState, winnersState = [], nextPlaceState = 1) {
    let players = playersState.map(p => ({
        ...p,
        scores: [...p.scores],
        total: 0,
        misses: 0,
        eliminated: false
    }));

    let winners = [];
    let nextPlace = 1;

    const numRounds = Math.max(...players.map(p => p.scores.length), 0);

    for (let ri = 0; ri < numRounds; ri++) {
        players.forEach((p, pIdx) => {
            if (p.eliminated) return;

            const s = p.scores[ri];
            if (s === "X") {
                p.misses++;
                if (p.misses >= 3) {
                    p.eliminated = true;
                }
            } else if (typeof s === "number") {
                p.misses = 0;
                p.total += s;
                if (p.total > 50) {
                    p.total = 25;
                }
            }

            if (p.total === 50 && !winners.some(w => w.playerIndex === pIdx)) {
                winners.push({
                    playerIndex: pIdx,
                    name: p.name,
                    total: p.total,
                    place: nextPlace++
                });
            }
        });
    }

    return { players, winners, nextPlace };
}

export function getNextTurnIndex(players, currentPlayerIndex, winners = []) {
    if (!players || players.length === 0) return 0;
    let tries = 0;
    let nextIndex = currentPlayerIndex;
    do {
        nextIndex = (nextIndex + 1) % players.length;
        tries++;
        if (tries > players.length * 2) break;
    } while (
        players[nextIndex].eliminated ||
        winners.some(w => w.playerIndex === nextIndex)
    );
    return nextIndex;
}

export function maybeStartNewRoundAndAlignTurn(players, currentPlayerIndex, winners = []) {
    const active = getActivePlayerIndexes(players, winners);
    if (active.length === 0) {
        return { updatedPlayers: players, newTurnIndex: currentPlayerIndex };
    }

    const lastRound = getCurrentRoundIndex(players);
    if (lastRound < 0) {
        return { updatedPlayers: players, newTurnIndex: currentPlayerIndex };
    }

    const allFilled = active.every(i => {
        const v = players[i].scores[lastRound];
        return v !== undefined && v !== "-";
    });

    if (allFilled) {
        const updatedPlayers = players.map(p => ({
            ...p,
            scores: [...p.scores, "-"]
        }));
        return { updatedPlayers, newTurnIndex: active[0] };
    }

    return { updatedPlayers: players, newTurnIndex: currentPlayerIndex };
}

export function undoLastScore(players, currentPlayerIndex) {
    let updatedPlayers = players.map(p => ({ ...p, scores: [...p.scores] }));
    let newTurnIndex = currentPlayerIndex;
    let found = false;

    const currentRound = getCurrentRoundIndex(updatedPlayers);
    for (let ri = currentRound; ri >= 0 && !found; ri--) {
        for (let pi = updatedPlayers.length - 1; pi >= 0; pi--) {
            const val = updatedPlayers[pi].scores[ri];
            if (val !== "-" && val !== undefined) {
                updatedPlayers[pi].scores[ri] = "-";
                newTurnIndex = pi;
                found = true;
                break;
            }
        }
    }

    // Remove trailing empty rounds
    let maxRound = Math.max(...updatedPlayers.map(p => p.scores.length - 1), -1);
    while (maxRound >= 0) {
        const isEmpty = updatedPlayers.every(p => p.scores[maxRound] === "-");
        if (!isEmpty) break;
        updatedPlayers.forEach(p => p.scores.pop());
        maxRound--;
    }

    return { updatedPlayers, newTurnIndex };
}
