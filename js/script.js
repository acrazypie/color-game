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

    const gridSize = Math.min(Math.floor(level / 2) + 2, 7);
    const totalItems = gridSize * gridSize;

    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    const colorDelta = Math.max(10, 80 - level * 3);

    const baseR = Math.floor(Math.random() * (256 - colorDelta));
    const baseG = Math.floor(Math.random() * (256 - colorDelta));
    const baseB = Math.floor(Math.random() * (256 - colorDelta));
    const baseColor = `rgb(${baseR}, ${baseG}, ${baseB})`;

    let oddR = baseR,
        oddG = baseG,
        oddB = baseB;
    const channelToChange = Math.floor(Math.random() * 3); // 0=R, 1=G, 2=B

    if (channelToChange === 0) oddR += colorDelta;
    else if (channelToChange === 1) oddG += colorDelta;
    else oddB += colorDelta;

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
