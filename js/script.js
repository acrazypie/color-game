const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const gameOverScreen = document.getElementById("game-over-screen");

const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");

const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const finalScoreDisplay = document.getElementById("final-score");
const gridContainer = document.getElementById("grid-container");

let score = 0;
let currentTime = 60;
let currentLevel = 1;
let timerInterval = null;

/**
 * Shows only the screen selected.
 * @param {string} screenId Screen ID to show
 */
function showScreen(screenId) {
    startScreen.classList.remove("active");
    gameScreen.classList.remove("active");
    gameOverScreen.classList.remove("active");

    document.getElementById(screenId).classList.add("active");
}

/**
 * Generates a new level.
 * @param {number} level Level being played
 */
function generateLevel(level) {
    gridContainer.innerHTML = "";

    // Stepwise grid sizes: 2x2, 4x4, 6x6, 8x8
    const gridSizes = [2, 4, 6, 8];
    const gridSize =
        gridSizes[Math.min(Math.floor(level / 2), gridSizes.length - 1)];
    const totalItems = gridSize * gridSize;

    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    // Pastel colors: high RGB values with small variations
    const maxDelta = 40; // max difference for the odd tile
    const colorDelta = Math.max(10, Math.min(maxDelta, 50 - level)); // capped and min delta

    function randomPastel() {
        const r = Math.floor(Math.random() * 128 + 127);
        const g = Math.floor(Math.random() * 128 + 127);
        const b = Math.floor(Math.random() * 128 + 127);

        return [r, g, b];
    }

    const [baseR, baseG, baseB] = randomPastel();
    const baseColor = `rgb(${baseR}, ${baseG}, ${baseB})`;

    // Slightly lighter odd tile
    const oddR = Math.min(baseR + colorDelta, 255);
    const oddG = Math.min(baseG + colorDelta, 255);
    const oddB = Math.min(baseB + colorDelta, 255);
    const oddColor = `rgb(${oddR}, ${oddG}, ${oddB})`;

    const oddItemIndex = Math.floor(Math.random() * totalItems);

    for (let i = 0; i < totalItems; i++) {
        const item = document.createElement("div");
        item.classList.add("grid-item");
        item.style.borderRadius = "8px";

        if (i === oddItemIndex) {
            item.style.backgroundColor = oddColor;
            item.dataset.correct = "true";
        } else {
            item.style.backgroundColor = baseColor;
        }

        item.addEventListener("click", handleItemClick);
        gridContainer.appendChild(item);
    }
}

/**
 * Gestisce il click su un elemento della griglia.
 * @param {Event} event L'evento del click
 */
function handleItemClick(event) {
    if (event.target.dataset.correct === "true") {
        score++;
        currentLevel++;
        scoreDisplay.textContent = score;

        currentTime = Math.min(currentTime + 1, 60);
        timerDisplay.textContent = currentTime;
        generateLevel(currentLevel);
    } else {
        gameOver();
    }
}

function startGame() {
    score = 0;
    currentLevel = 1;
    currentTime = 60;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = currentTime;

    showScreen("game-screen");

    startTimer();

    generateLevel(currentLevel);
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        currentTime--;
        timerDisplay.textContent = currentTime;
        if (currentTime <= 0) {
            gameOver();
        }
    }, 1000);
}

function gameOver() {
    clearInterval(timerInterval);
    finalScoreDisplay.textContent = score;
    showScreen("game-over-screen");
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
