/*
 * GAME HUB — game registry and player controller
 * Add your HTML games to GAME_LIST below.
 *
 * Important:
 * - Keep your game HTML and its assets together in the project.
 * - Paths are relative to index.html.
 * - If a game uses its own CSS, JS, images, or audio, keep those paths working.
 * - Use a local web server (VS Code Live Server) for best results.
 */

const GAME_LIST = [
  {
    id: "battle-royale-3d",
    name: "Battle Royale 3D",
    letter: "B",
    category: "Action & Survival",
    file: "games/Battle_Royale_3D_mobile.html",
    accent: "#ff4d6d",
    description: "3D battle royale action"
  },
  {
    id: "chess",
    name: "Chess",
    letter: "C",
    category: "Strategy & Board",
    file: "games/chess_mobile.html",
    accent: "#ff2222",
    description: "Classic strategic board game"
  },
  {
    id: "cyber-runner-3d",
    name: "Cyber Runner 3D",
    letter: "C",
    category: "Action & Endless Runner",
    file: "games/cyber_runner_3d_mobile.html",
    accent: "#00e5ff",
    description: "Futuristic 3D running action"
  },
  {
    id: "dungeon-hopper",
    name: "Dungeon Hopper",
    letter: "D",
    category: "Adventure & Arcade",
    file: "games/Dungeon_Hopper_mobile.html",
    accent: "#b16cff",
    description: "Dungeon-hopping arcade adventure"
  },
  {
    id: "katana-type",
    name: "Katana Type",
    letter: "K",
    category: "Action & Typing",
    file: "games/Katana_Type_mobile.html",
    accent: "#ff5c8a",
    description: "Fast-paced typing and katana action"
  },
  {
    id: "memory",
    name: "Memory Match",
    letter: "M",
    category: "Brain & Puzzle",
    file: "games/memory.html",
    accent: "#6ce5d1",
    description: "Test your memory by matching pairs"
  },
  {
    id: "neon-drift",
    name: "Neon Drift",
    letter: "N",
    category: "Racing & Driving",
    file: "games/Neon_Drift_mobile.html",
    accent: "#00f5ff",
    description: "Neon-lit arcade drifting action"
  },
  {
    id: "puzzle",
    name: "Number Puzzle",
    letter: "P",
    category: "Brain & Puzzle",
    file: "games/puzzle.html",
    accent: "#9d9bff",
    description: "Solve number-based logic puzzles"
  },
  {
    id: "runner",
    name: "Neon Runner",
    letter: "R",
    category: "Action",
    file: "games/runner.html",
    accent: "#ff8a5b",
    description: "Fast-paced arcade running challenge"
  },
  {
    id: "snake",
    name: "Snake",
    letter: "S",
    category: "Classic Arcade",
    file: "games/snake.html",
    accent: "#c8ff3d",
    description: "Classic snake-growing arcade game"
  },
  {
    id: "sudoku",
    name: "Sudoku",
    letter: "S",
    category: "Logic & Puzzle",
    file: "games/sudoku_mobile.html",
    accent: "#ffd166",
    description: "Solve number-placement logic puzzles"
  }
];

const lobbyView = document.getElementById("lobbyView");
const playerView = document.getElementById("playerView");
const gameGrid = document.getElementById("gameGrid");
const gameCount = document.getElementById("gameCount");
const libraryCount = document.getElementById("libraryCount");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");
const gameFrame = document.getElementById("gameFrame");
const exitHandle = document.getElementById("exitHandle");
const playerLoading = document.getElementById("playerLoading");
const playerError = document.getElementById("playerError");
const errorBackButton = document.getElementById("errorBackButton");
const homeBrand = document.getElementById("homeBrand");

let activeGame = null;
let loadingTimer = null;
let frameLoadTimeout = null;

function padNumber(value) {
  return String(value).padStart(2, "0");
}

function renderGames(query = "") {
  const normalizedQuery = query.trim().toLowerCase();
  const filteredGames = GAME_LIST.filter((game) =>
    `${game.name} ${game.category} ${game.letter}`.toLowerCase().includes(normalizedQuery)
  );

  gameGrid.innerHTML = "";
  filteredGames.forEach((game, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "game-card";
    card.style.setProperty("--game-accent", game.accent || "#c8ff3d");
    card.setAttribute("aria-label", `Play ${game.name}`);
    card.innerHTML = `
      <div class="card-art">
        <span class="card-index">${padNumber(index + 1)} / ${padNumber(filteredGames.length)}</span>
        <span class="card-corner" aria-hidden="true">↗</span>
        <span class="card-letter" aria-hidden="true"></span>
      </div>
      <div class="card-info">
        <div><h3></h3><p></p></div>
        <span class="play-arrow" aria-hidden="true">↗</span>
      </div>
    `;
    card.querySelector(".card-letter").textContent = game.letter || game.name.charAt(0).toUpperCase();
    card.querySelector("h3").textContent = game.name;
    card.querySelector(".card-info p").textContent = game.description || game.category || "Arcade game";
    card.addEventListener("click", () => launchGame(game));
    gameGrid.appendChild(card);
  });

  gameCount.textContent = `${padNumber(GAME_LIST.length)} GAMES`;
  libraryCount.textContent = `/ ${padNumber(filteredGames.length)}`;
  emptyState.hidden = filteredGames.length !== 0;
}

function launchGame(game) {
  if (!game || !game.file) return;

  activeGame = game;
  playerError.hidden = true;
  playerLoading.hidden = false;
  lobbyView.hidden = true;
  playerView.hidden = false;
  document.body.classList.add("player-active");
  document.title = `${game.name} — GAME HUB`;

  // Clear the previous document before loading the selected game.
  gameFrame.onload = () => {
    playerLoading.hidden = true;
    playerError.hidden = true;
    clearTimeout(frameLoadTimeout);
  };
  gameFrame.onerror = () => showLoadError();
  gameFrame.src = game.file;

  // Browser iframes do not consistently fire onerror for missing local files,
  // so show a fallback if loading takes too long.
  clearTimeout(frameLoadTimeout);
  frameLoadTimeout = setTimeout(() => {
    if (!playerLoading.hidden) showLoadError();
  }, 12000);

  // Give the loading overlay a short minimum display time to avoid flicker.
  clearTimeout(loadingTimer);
  loadingTimer = setTimeout(() => {
    if (playerView.hidden) playerLoading.hidden = true;
  }, 450);
}

function showLoadError() {
  playerLoading.hidden = true;
  playerError.hidden = false;
}

function returnToLobby() {
  if (playerView.hidden) return;
  const previousGameName = activeGame?.name || "";

  clearTimeout(loadingTimer);
  clearTimeout(frameLoadTimeout);
  gameFrame.onload = null;
  gameFrame.onerror = null;

  // Stop audio/animation/scripts inside the game by unloading its document.
  gameFrame.src = "about:blank";
  playerView.hidden = true;
  lobbyView.hidden = false;
  playerLoading.hidden = true;
  playerError.hidden = true;
  document.body.classList.remove("player-active");
  document.title = "GAME HUB — Arcade Launcher";
  activeGame = null;

  // Keep the current search and return keyboard focus to the selected tile if possible.
  const searchValue = searchInput.value;
  renderGames(searchValue);
  const focusCard = [...gameGrid.querySelectorAll(".game-card")].find((card) =>
    card.getAttribute("aria-label") === "Play " + previousGameName
  );
  if (focusCard) focusCard.focus();
}

function exitPlayerSafely() {
  // Double-click is the primary exit gesture. Keyboard users can focus the handle
  // and press Enter or Space twice, matching the double-activation requirement.
  returnToLobby();
}

// Desktop: double-click. Touch screens: tap the corner handle twice quickly.
exitHandle.addEventListener("dblclick", (event) => {
  event.preventDefault();
  exitPlayerSafely();
});

let lastTouchActivation = 0;
exitHandle.addEventListener("pointerup", (event) => {
  if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
  const now = Date.now();
  if (now - lastTouchActivation < 550) {
    event.preventDefault();
    lastTouchActivation = 0;
    exitPlayerSafely();
  } else {
    lastTouchActivation = now;
  }
});

let lastKeyboardActivation = 0;
exitHandle.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  const now = Date.now();
  if (now - lastKeyboardActivation < 500) {
    exitPlayerSafely();
    lastKeyboardActivation = 0;
  } else {
    lastKeyboardActivation = now;
  }
});

errorBackButton.addEventListener("click", returnToLobby);
homeBrand.addEventListener("click", (event) => {
  event.preventDefault();
  if (!playerView.hidden) returnToLobby();
  else window.scrollTo({ top: 0, behavior: "smooth" });
});

searchInput.addEventListener("input", () => renderGames(searchInput.value));
document.addEventListener("keydown", (event) => {
  if (!playerView.hidden) {
    if (event.key === "Escape") {
      // Escape intentionally does not exit; use the transparent handle.
      event.preventDefault();
    }
    return;
  }
  if (event.key === "/" && document.activeElement !== searchInput) {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape" && document.activeElement === searchInput) {
    searchInput.value = "";
    renderGames("");
    searchInput.blur();
  }
});

renderGames();
