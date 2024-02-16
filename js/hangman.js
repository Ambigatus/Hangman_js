const startGameButton = document.getElementById("startGameButton");
const resetGameButton = document.getElementById("resetGameButton");
const attemptsLeftDisplay = document.getElementById("attemptsLeft");
const playerModeSelect = document.getElementById("playerMode");

let wordList = ["apple", "banana", "orange", "strawberry", "watermelon"];
let currentWord;
let guessedLetters = [];
let maxAttempts = {};
let incorrectAttempts = {};
let gameStarted = false;
let playerName = "";
let player1Name = "";
let player2Name = "";
let playerNames = []
let currentPlayer = "";
let currentPlayerIndex = 0;


function getRandomWord() {
    return wordList[Math.floor(Math.random() * wordList.length)];
}

function startNewGame() {
    let selectedMode = document.getElementById("playerMode").value;
    if (selectedMode === "single") {
        playerName = document.getElementById("playerName").value;
        currentWord = getRandomWord();
        guessedLetters = [];
        incorrectAttempts[playerName] = 0;
        maxAttempts[playerName] = 6;
        gameStarted = true;
        updateAttemptsLeftDisplay();
        displayWord();
    } else if (selectedMode === "multi") {
        playerNames.push(document.getElementById("player1Name").value.trim());
        playerNames.push(document.getElementById("player2Name").value.trim());
        currentPlayerIndex = 0;
        currentWord = getRandomWord();
        guessedLetters = [];
        incorrectAttempts[playerNames[0]] = 0;
        incorrectAttempts[playerNames[1]] = 0;
        maxAttempts[playerNames[0]] = 6;
        maxAttempts[playerNames[1]] = 6;
        gameStarted = true;
        updateAttemptsLeftDisplay();
        displayWord();
        updatePlayerTurnDisplay();
    }
}

function switchPlayer(letter) {
    if (!currentWord.includes(letter)) {
        currentPlayerIndex = (currentPlayerIndex + 1) % playerNames.length;
        currentPlayer = playerNames[currentPlayerIndex];
    }
}

function checkGameStatus() {
    if (incorrectAttempts[currentPlayer] >= maxAttempts[currentPlayer]) {
        endGame(false);
    } else if (currentWord.split("").every((letter) => guessedLetters.includes(letter))) {
        endGame(true);
    } else {
        switchPlayer();
        updatePlayerTurnDisplay();
    }
}

function resetGame() {
    gameStarted = false;
    resetGameButton.style.display = "none";
    document.getElementById("wordDisplay").textContent = "";
    currentPlayerIndex = 0;
    playerNames = [];
}

function updateAttemptsLeftDisplay() {
    attemptsLeftDisplay.textContent = maxAttempts[currentPlayer] - incorrectAttempts[currentPlayer];
}

function displayWord() {
    const wordDisplay = document.getElementById("wordDisplay");
    let displayedWord = "";
    for (const letter of currentWord) {
        if (guessedLetters.includes(letter)) {
            displayedWord += letter;
        } else {
            displayedWord += "_";
        }
        displayedWord += " ";
    }
    wordDisplay.textContent = displayedWord;
}

playerModeSelect.addEventListener("change", () => {
    togglePlayerInputs();
});

startGameButton.addEventListener("click", () => {
    if (!gameStarted) {
        startNewGame();
        resetGameButton.style.display = "block"; // Показ кнопки сброса при начале игры
    }
});

resetGameButton.addEventListener("click", () => {
    resetGame();
});

document.addEventListener("keydown", (event) => {
    if (gameStarted && event.keyCode >= 65 && event.keyCode <= 90) {
        const letter = event.key.toLowerCase();
        if (!guessedLetters.includes(letter)) {
            guessedLetters.push(letter);
            if (!currentWord.includes(letter)) {
                incorrectAttempts[currentPlayer]++;
                updateAttemptsLeftDisplay();
            }
            displayWord();
            checkGameStatus();
        }
    }
});

function endGame(win) {
    let selectedMode = document.getElementById("playerMode").value;
    if (selectedMode === "single")
    {
      if (win) {
        alert(`Congratulations ${playerName}! You guessed the word correctly.`);
      } else {
        alert(`Sorry, ${playerName}, you lost. The word was: ${currentWord}`);
      }
    }
    else if (selectedMode === "multi")
    {
      if (win) {
        alert(`Congratulations ${currentPlayer}! You guessed the word correctly.`);
      } else {
        alert(`Sorry, ${currentPlayer}, you lost. The word was: ${currentWord}`);
      }
    }
    resetGame();
}

function updatePlayerTurnDisplay() {
    document.getElementById("playerTurn").textContent = `Current player: ${currentPlayer}`;
}

function togglePlayerInputs() {
    const selectedMode = playerModeSelect.value;
    const player1Input = document.getElementById("player1Input");
    const player2Input = document.getElementById("player2Input");
    const playerNameInput = document.getElementById("playerName");
    if (selectedMode === "multi") {
        player1Input.style.display = "block";
        player2Input.style.display = "block";
        playerNameInput.style.display = "none";
    } else {
        player1Input.style.display = "none";
        player2Input.style.display = "none";
        playerNameInput.style.display = "block";
    }
}

togglePlayerInputs();
