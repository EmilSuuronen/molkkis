let players = [];
let currentPlayerIndex = 0;
let gameActive = false;
let editModeCell = null;
let winners = [];
let nextPlace = 1;

const MAX_VISIBLE_ROUNDS = 5;

const playerColors = [
    "#e6194b", "#3cb44b", "#f032e6", "#ffe119",
    "#4363d8", "#f58231", "#911eb4", "#46f0f0"
];

const LOCAL_STORAGE_KEY = "molkkis_game_state";
let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    const card = document.getElementById("card-mobile-app");
    if (card) card.style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("startGameBtn").addEventListener("click", startGame);
    document.getElementById("keypad").addEventListener("click", handleKeypadClick);
    document.getElementById("undoBtn").addEventListener("click", undoLast);

    const addPlayerBtn = document.getElementById("addPlayerBtn");
    const playersListEl = document.getElementById("playersList");
    addPlayerBtn.addEventListener("click", () => {
        if (playersListEl.children.length >= 8) return;
        addPlayerRow();
    });

    const randomizeBtn = document.getElementById("randomizeOrderBtn");
    if (randomizeBtn) randomizeBtn.addEventListener("click", randomizeOrder);

    const endBtn = document.getElementById("endGameBtn");
    if (endBtn) endBtn.addEventListener("click", endGame);

    const installPwaBtn = document.getElementById("installPwaBtn");
    if (installPwaBtn) {
        installPwaBtn.addEventListener("click", triggerPwaInstall);
    }

    // Hide app card if running as installed standalone PWA
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;
    if (isStandalone) {
        const card = document.getElementById("card-mobile-app");
        if (card) card.style.display = "none";
    }

    const stateLoaded = loadGameState();
    if (!stateLoaded && playersListEl && playersListEl.children.length === 0) {
        addPlayerRow();
        addPlayerRow();
    }
});

function triggerPwaInstall() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
                const card = document.getElementById("card-mobile-app");
                if (card) card.style.display = "none";
            }
            deferredPrompt = null;
        });
    } else {
        showAlert(
            "To install Mölkkis:\n\n• iOS (Safari): Tap the Share icon and select 'Add to Home Screen'.\n• Android / Chrome: Tap the menu (⋮) and select 'Install app' or 'Add to Home Screen'.",
            "App Installation"
        );
    }
}

function showModal({ title = "Notice", message = "", confirmText = "OK", cancelText = "Cancel", showCancel = false }) {
    return new Promise((resolve) => {
        const overlay = document.getElementById("modalOverlay");
        const titleEl = document.getElementById("modalTitle");
        const bodyEl = document.getElementById("modalBody");
        const confirmBtn = document.getElementById("modalConfirmBtn");
        const cancelBtn = document.getElementById("modalCancelBtn");

        if (!overlay || !titleEl || !bodyEl || !confirmBtn || !cancelBtn) {
            if (showCancel) {
                resolve(window.confirm(message));
            } else {
                alert(message);
                resolve(true);
            }
            return;
        }

        titleEl.textContent = title;
        bodyEl.textContent = message;
        confirmBtn.textContent = confirmText;
        cancelBtn.textContent = cancelText;

        if (showCancel) {
            cancelBtn.style.display = "inline-block";
        } else {
            cancelBtn.style.display = "none";
        }

        overlay.classList.add("active");
        overlay.setAttribute("aria-hidden", "false");

        function cleanup(result) {
            overlay.classList.remove("active");
            overlay.setAttribute("aria-hidden", "true");
            confirmBtn.removeEventListener("click", onConfirm);
            cancelBtn.removeEventListener("click", onCancel);
            overlay.removeEventListener("click", onOverlayClick);
            document.removeEventListener("keydown", onKeyDown);
            resolve(result);
        }

        function onConfirm() { cleanup(true); }
        function onCancel() { cleanup(false); }
        function onOverlayClick(e) { if (e.target === overlay) cleanup(false); }
        function onKeyDown(e) {
            if (e.key === "Escape") cleanup(false);
            if (e.key === "Enter") cleanup(true);
        }

        confirmBtn.addEventListener("click", onConfirm);
        cancelBtn.addEventListener("click", onCancel);
        overlay.addEventListener("click", onOverlayClick);
        document.addEventListener("keydown", onKeyDown);

        confirmBtn.focus();
    });
}

function showAlert(message, title = "Notification") {
    return showModal({ title, message, showCancel: false });
}

function showConfirm(message, title = "Confirmation") {
    return showModal({ title, message, showCancel: true, confirmText: "Yes", cancelText: "Cancel" });
}

function saveGameState() {
    if (!gameActive) {
        clearGameState();
        return;
    }
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
}

function clearGameState() {
    try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (err) {
        console.error("Failed to clear localStorage:", err);
    }
}

function loadGameState() {
    try {
        const data = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!data) return false;
        const state = JSON.parse(data);
        if (!state || !state.gameActive || !Array.isArray(state.players) || state.players.length === 0) {
            clearGameState();
            return false;
        }
        players = state.players;
        currentPlayerIndex = state.currentPlayerIndex || 0;
        gameActive = state.gameActive;
        winners = state.winners || [];
        nextPlace = state.nextPlace || 1;

        recalcTotals();
        initKeypad();

        document.getElementById("setup").style.display = "none";
        document.getElementById("game").style.display = "block";
        const footer = document.getElementById("appFooter");
        if (footer) footer.style.display = "none";

        return true;
    } catch (err) {
        console.error("Failed to load state from localStorage:", err);
        clearGameState();
        return false;
    }
}

function assignPlayerColor(playerIndex) {
    return playerColors[playerIndex % playerColors.length];
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function randomizeOrder() {
    const playersListEl = document.getElementById("playersList");
    const rows = [...playersListEl.children];
    shuffleArray(rows);
    rows.forEach(row => playersListEl.appendChild(row));
    renumberPlaceholders();
}

function addPlayerRow(name = "") {
    const playersListEl = document.getElementById("playersList");
    const row = document.createElement("div");
    row.className = "player-row";
    row.innerHTML = `
    <input type="text" placeholder="Name" value="${name}" aria-label="Player name" maxlength="8"/>
    <div class="order-buttons">
      <button class="btn" data-dir="up" title="Move up">▲</button>
      <button class="btn" data-dir="down" title="Move down">▼</button>
    </div>
    <button class="btn remove-btn" title="Remove">✖</button>
  `;

    // Move up/down
    row.querySelectorAll(".order-buttons .btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const dir = btn.dataset.dir;
            const rows = [...playersListEl.children];
            const idx = rows.indexOf(row);
            if (dir === "up" && idx > 0) playersListEl.insertBefore(row, rows[idx - 1]);
            if (dir === "down" && idx < rows.length - 1) playersListEl.insertBefore(rows[idx + 1], row.nextSibling);
            renumberPlaceholders();
        });
    });

    // Remove
    row.querySelector(".remove-btn").addEventListener("click", () => {
        row.remove();
        renumberPlaceholders();
    });

    playersListEl.appendChild(row);
    renumberPlaceholders();
}

function renumberPlaceholders() {
    document.querySelectorAll(".player-row input[type='text']").forEach((inp, i) => {
        if (!inp.value) inp.placeholder = `Player ${i + 1}`;
    });
}

function startGame(e) {
    if (e) e.preventDefault();

    const nameInputs = document.querySelectorAll("#playersList input[type='text']");
    players = [];
    nameInputs.forEach((input, index) => {
        const name = input.value.trim() || `Player ${index + 1}`;
        const color = assignPlayerColor(index);
        players.push({
            name,
            color,
            scores: [],
            total: 0,
            misses: 0,
            eliminated: false,
        });
    });

    if (players.length === 0) {
        showAlert("Please add at least 1 player to start the game.", "No Players");
        return;
    }

    currentPlayerIndex = 0;
    gameActive = true;
    winners = [];
    nextPlace = 1;

    renderScoreboard();
    initKeypad();
    document.getElementById("setup").style.display = "none";
    document.getElementById("game").style.display = "block";
    const footer = document.getElementById("appFooter");
    if (footer) footer.style.display = "none";

    saveGameState();
}

function getCurrentRoundIndex() {
    if (players.length === 0) return -1;
    return Math.max(...players.map(p => p.scores.length - 1), -1);
}

function getActivePlayerIndexes() {
    const active = [];
    for (let i = 0; i < players.length; i++) {
        const isWinner = winners.find(w => w.playerIndex === i);
        if (!players[i].eliminated && !isWinner) active.push(i);
    }
    return active;
}

function ensureValidCurrentPlayer() {
    if (!gameActive || players.length === 0) return;
    const isCurrentActive = !players[currentPlayerIndex].eliminated &&
        !winners.find(w => w.playerIndex === currentPlayerIndex);

    if (!isCurrentActive) {
        const active = getActivePlayerIndexes();
        if (active.length > 0) {
            let found = active.find(i => i >= currentPlayerIndex);
            if (found === undefined) found = active[0];
            currentPlayerIndex = found;
        }
    }
}

function recalcTotals() {
    players.forEach(p => {
        p.total = 0;
        p.misses = 0;
        p.eliminated = false;
    });

    winners = [];
    nextPlace = 1;

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

            if (p.total === 50 && !winners.find(w => w.playerIndex === pIdx)) {
                winners.push({
                    playerIndex: pIdx,
                    name: p.name,
                    total: p.total,
                    place: nextPlace++
                });
            }
        });
    }

    ensureValidCurrentPlayer();
    renderScoreboard();

    const active = getActivePlayerIndexes();
    if (active.length === 1 && gameActive && winners.length > 0) {
        gameActive = false;
        const last = active[0];
        winners.push({
            playerIndex: last,
            name: players[last].name,
            total: players[last].total,
            place: nextPlace++
        });
        showFinalResults();
    }
}

function renderScoreboard() {
    const container = document.getElementById("scoreTable");
    if (!container) return;
    container.innerHTML = "";

    const numRounds = Math.max(...players.map(p => p.scores.length), 0);
    const activeRound = getCurrentRoundIndex();

    // Header row
    const headerRow = document.createElement("div");
    headerRow.className = "score-row header-row";

    const roundHeader = document.createElement("div");
    roundHeader.className = "round-header";
    roundHeader.textContent = "#";
    headerRow.appendChild(roundHeader);

    players.forEach((p, idx) => {
        const ph = document.createElement("div");
        ph.className = "player-name-header";
        if (idx === currentPlayerIndex && !p.eliminated && !winners.find(w => w.playerIndex === idx)) {
            ph.classList.add("active-player");
        }
        if (p.eliminated) ph.classList.add("eliminated");

        const w = winners.find(w => w.playerIndex === idx);
        const suffix = p.eliminated ? " (Out)" : (w ? ` (${w.place}.)` : "");
        ph.textContent = `${p.name}${suffix}`;
        ph.title = `${p.name}${suffix}`;
        ph.style.backgroundColor = p.color;
        headerRow.appendChild(ph);
    });
    container.appendChild(headerRow);

    // All rounds
    for (let ri = 0; ri < numRounds; ri++) {
        const rowEl = document.createElement("div");
        rowEl.className = "score-row round";

        const roundNumberEl = document.createElement("div");
        roundNumberEl.className = "round-number";
        roundNumberEl.textContent = ri + 1;
        rowEl.appendChild(roundNumberEl);

        players.forEach((player, pi) => {
            const cell = document.createElement("div");
            cell.className = "score-cell";

            const isTurn = (pi === currentPlayerIndex &&
                            ri === activeRound &&
                            !player.eliminated &&
                            !winners.find(w => w.playerIndex === pi));

            if (isTurn) {
                cell.classList.add("current-player");
                cell.id = "activeTurnCell";
            }
            if (player.eliminated) {
                cell.classList.add("eliminated");
            }

            cell.textContent = player.scores[ri] ?? "-";
            cell.dataset.playerIndex = pi;
            cell.dataset.roundIndex = ri;
            cell.addEventListener("click", () => enterEditMode(cell));
            rowEl.appendChild(cell);
        });

        container.appendChild(rowEl);
    }

    // Totals row
    const totalRow = document.createElement("div");
    totalRow.className = "score-row total-row";

    const totalLabel = document.createElement("div");
    totalLabel.className = "total-label";
    totalLabel.textContent = "Total";
    totalRow.appendChild(totalLabel);

    players.forEach(p => {
        const totalCell = document.createElement("div");
        totalCell.className = "total-cell";
        totalCell.textContent = p.total;
        totalRow.appendChild(totalCell);
    });

    container.appendChild(totalRow);

    // === Current Player Card ===
    const cpCard = document.getElementById("currentPlayerCard");
    if (gameActive && players.length > 0) {
        const player = players[currentPlayerIndex];
        if (player && !player.eliminated && !winners.find(w => w.playerIndex === currentPlayerIndex)) {
            const remaining = Math.max(50 - player.total, 0);
            cpCard.innerHTML = `
            <h3 style="color:${player.color};">${player.name}'s Turn</h3>
            <p><strong>${remaining}</strong> points to win</p>
        `;
            cpCard.style.display = "block";
        } else {
            cpCard.innerHTML = "";
            cpCard.style.display = "none";
        }
    } else {
        cpCard.innerHTML = "";
        cpCard.style.display = "none";
    }

    requestAnimationFrame(() => {
        scrollToActiveTurn();
    });
}

function scrollToActiveTurn() {
    const activeCell = document.getElementById("activeTurnCell");
    const container = document.getElementById("scoreScrollContainer");
    if (!activeCell || !container) return;

    const cellRect = activeCell.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const targetLeft = container.scrollLeft + (cellRect.left - containerRect.left) - (containerRect.width / 2) + (cellRect.width / 2);
    const targetTop = container.scrollTop + (cellRect.top - containerRect.top) - (containerRect.height / 2) + (cellRect.height / 2);

    container.scrollTo({
        left: Math.max(0, targetLeft),
        top: Math.max(0, targetTop),
        behavior: "smooth"
    });
}

function nextTurn() {
    if (!gameActive) return;

    // advance to next active player (skip eliminated & winners)
    let tries = 0;
    let nextIndex = currentPlayerIndex;
    do {
        nextIndex = (nextIndex + 1) % players.length;
        tries++;
        if (tries > players.length * 2) break; // failsafe
    } while (
        players[nextIndex].eliminated ||
        winners.find(w => w.playerIndex === nextIndex)
        );

    currentPlayerIndex = nextIndex;

    // If the just-finished round is complete for all ACTIVE players,
    // start a NEW round and align turn to the first active player.
    maybeStartNewRoundAndAlignTurn();

    renderScoreboard();
}

function maybeStartNewRoundAndAlignTurn() {
    const active = getActivePlayerIndexes();
    if (active.length === 0) return; // game will end elsewhere

    const lastRound = getCurrentRoundIndex(); // -1 if none yet
    if (lastRound < 0) return;

    const allFilled = active.every(i => {
        const v = players[i].scores[lastRound];
        return v !== undefined && v !== "-";
    });

    if (allFilled) {
        // start next round
        players.forEach(p => p.scores.push("-"));
        // first active player begins the new round
        currentPlayerIndex = active[0];
    }
}

function undoLast() {
    // Remove last entered score
    let found = false;
    for (let ri = getCurrentRoundIndex(); ri >= 0 && !found; ri--) {
        for (let pi = players.length - 1; pi >= 0; pi--) {
            const val = players[pi].scores[ri];
            if (val !== "-" && val !== undefined) {
                players[pi].scores[ri] = "-";
                currentPlayerIndex = pi;
                found = true;
                break;
            }
        }
    }

    // Remove trailing empty rounds
    let maxRound = Math.max(...players.map(p => p.scores.length - 1), -1);
    while (maxRound >= 0) {
        const isEmpty = players.every(p => p.scores[maxRound] === "-");
        if (!isEmpty) break;
        players.forEach(p => p.scores.pop());
        maxRound--;
    }

    recalcTotals();
    ensureValidCurrentPlayer();
    saveGameState();
}

function initKeypad() {
    const keypad = document.getElementById("keypad");
    keypad.innerHTML = "";
    for (let i = 1; i <= 12; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = "key";
        btn.dataset.value = i;
        keypad.appendChild(btn);
    }
    const missBtn = document.createElement("button");
    missBtn.textContent = "X";
    missBtn.className = "key";
    missBtn.id = "missBtn";
    missBtn.dataset.value = "X";
    keypad.appendChild(missBtn);
}

function handleKeypadClick(e) {
    if (!e.target.classList.contains("key")) return;
    if (!gameActive) return;

    const value = e.target.dataset.value;

    if (editModeCell) {
        const ri = parseInt(editModeCell.dataset.roundIndex);
        const pi = parseInt(editModeCell.dataset.playerIndex);
        players[pi].scores[ri] = value === "X" ? "X" : parseInt(value, 10);
        exitEditMode();
        recalcTotals();
        saveGameState();
        // editing does NOT change turn or start new round
        return;
    }

    // Normal scoring for current player
    const roundIndex = getCurrentRoundIndex();
    // Ensure the current round exists
    if (roundIndex < 0) {
        // first ever input -> start first round for all players
        players.forEach(p => p.scores.push("-"));
    }

    const useRound = getCurrentRoundIndex(); // recompute after potential push
    players.forEach(p => {
        if (p.scores.length <= useRound) p.scores.push("-");
    });

    const player = players[currentPlayerIndex];
    player.scores[useRound] = value === "X" ? "X" : parseInt(value, 10);

    recalcTotals(); // updates winners/eliminations and re-renders
    nextTurn();     // advances and maybe starts new round (based on active players)
    saveGameState();
}

function enterEditMode(cell) {
    exitEditMode();
    editModeCell = cell;
    cell.classList.add("editing");
}

function exitEditMode() {
    if (editModeCell) editModeCell.classList.remove("editing");
    editModeCell = null;
}

async function showFinalResults() {
    clearGameState();
    let message = "Final Results:\n\n";
    winners
        .sort((a, b) => a.place - b.place)
        .forEach(w => {
            message += `${w.place}. ${w.name} (${w.total} points)\n`;
        });
    await showAlert(message, "🏆 Game Over!");

    document.getElementById("setup").style.display = "block";
    document.getElementById("game").style.display = "none";
    const footer = document.getElementById("appFooter");
    if (footer) footer.style.display = "block";
}

async function endGame() {
    if (!gameActive) return;
    const confirmEnd = await showConfirm("Are you sure you want to end the game?", "End Game");
    if (!confirmEnd) return;

    gameActive = false;

    // Put any remaining non-winner players into the final order after winners
    players.forEach((p, i) => {
        if (!winners.find(w => w.playerIndex === i)) {
            winners.push({ playerIndex: i, name: p.name, total: p.total, place: nextPlace++ });
        }
    });

    await showFinalResults();

    document.getElementById("setup").style.display = "block";
    document.getElementById("game").style.display = "none";
    document.getElementById("appFooter").style.display = "block";
}
