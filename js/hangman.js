const startGameButton = document.getElementById("startGameButton");
const resetGameButton = document.getElementById("resetGameButton");
const attemptsLeftDisplay = document.getElementById("attemptsLeft");
const playerModeSelect = document.getElementById("playerMode");

// Get modal elements
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
const closeModalButton = document.getElementById("closeModalButton");

let wordList = ["apple", "banana", "orange", "strawberry", "watermelon"];
let currentWord;
let guessedLetters = [];
let maxAttempts = {};
let incorrectAttempts = {};
let gameStarted = false;
let playerName = "";
let playerNames = [];
let currentPlayerIndex = 0;

function getRandomWord() {
  return wordList[Math.floor(Math.random() * wordList.length)];
}

function startNewGame() {
  let selectedMode = playerModeSelect.value;
  if (selectedMode === "single") {
    playerName = document.getElementById("playerName").value.trim();
    currentWord = getRandomWord();
    guessedLetters = [];
    incorrectAttempts[playerName] = 0;
    maxAttempts[playerName] = 6;
    gameStarted = true;
    updateAttemptsLeftDisplay();
    displayWord();
    updatePlayerTurnDisplay();
  } else if (selectedMode === "multi") {
    playerNames.push(document.getElementById("player1Name").value.trim());
    playerNames.push(document.getElementById("player2Name").value.trim());
    currentPlayerIndex = 0;
    currentWord = getRandomWord();
    guessedLetters = [];
    playerNames.forEach(name => {
      incorrectAttempts[name] = 0;
      maxAttempts[name] = 6;
    });
    gameStarted = true;
    updateAttemptsLeftDisplay();
    displayWord();
    updatePlayerTurnDisplay();
  }
}

function switchPlayer(letter) {
    const currentPlayer = getCurrentPlayer();
    if (!currentWord.includes(letter)) {
        currentPlayerIndex = (currentPlayerIndex + 1) % playerNames.length;
    }
}

function getCurrentPlayer() {
  return playerModeSelect.value === "single" ? playerName : playerNames[currentPlayerIndex];
}

function checkGameStatus(letter) {
  const currentPlayer = getCurrentPlayer();
  if (incorrectAttempts[currentPlayer] >= maxAttempts[currentPlayer]) {
    endGame(false);
  } else if (currentWord.split("").every((letter) => guessedLetters.includes(letter))) {
    endGame(true);
  } else {
    const initialIncorrectAttempts = incorrectAttempts[currentPlayer];
    if (!currentWord.includes(letter)) {
      switchPlayer(letter);
    }
    if (initialIncorrectAttempts === incorrectAttempts[currentPlayer]) {
      // If the incorrect attempts count hasn't changed, the player guessed correctly, so don't switch
      updatePlayerTurnDisplay();
    }
    updateAttemptsLeftDisplay();
  }
}

function resetGame() {
  gameStarted = false;
  resetGameButton.style.display = "none";
  document.getElementById("wordDisplay").textContent = "";
  playerNames = [];
}

function updateAttemptsLeftDisplay() {
  const currentPlayer = getCurrentPlayer();
  attemptsLeftDisplay.textContent = (maxAttempts[currentPlayer] - incorrectAttempts[currentPlayer]).toString();
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

function updatePlayerTurnDisplay() {
  const currentPlayer = getCurrentPlayer();
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

document.addEventListener("keypress", (event) => {
  if (gameStarted && event.key.length === 1 && event.key.match(/[a-z]/i)) {
    const letter = event.key.toLowerCase();
    const currentPlayer = getCurrentPlayer();
    if (!guessedLetters.includes(letter)) {
      guessedLetters.push(letter);
      if (!currentWord.includes(letter)) {
        incorrectAttempts[currentPlayer]++;
        updateAttemptsLeftDisplay();
      }
      displayWord();
      checkGameStatus(letter); // Pass the guessed letter as an argument
    }
  }
});

playerModeSelect.addEventListener("change", () => {
  togglePlayerInputs();
});

startGameButton.addEventListener("click", () => {
  if (!gameStarted) {
    startNewGame();
    resetGameButton.style.display = "block";
  }
});

function endGame(win) {
  gameStarted = false; // Stop further game actions
  let message;
  const currentPlayer = getCurrentPlayer();
  if (win) {
    message = `Congratulations ${currentPlayer}! You guessed the word correctly.`;
  } else {
    message = `Sorry, ${currentPlayer}, you lost. The word was: ${currentWord}`;
  }
  alert(message);
  const modal = document.getElementById("modal");
  if (modal) {
    modal.style.display = "none";
  }
  resetGame();
}


resetGameButton.addEventListener("click", () => {
    resetGame();
});

// Close modal when close button is clicked
closeModalButton.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close modal when clicking outside the modal content
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
