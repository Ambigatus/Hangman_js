const startGameButton = document.getElementById("startGameButton");
const resetGameButton = document.getElementById("resetGameButton");
const playerModeSelect = document.getElementById("playerMode");
const playHangmanButton = document.getElementById("playHangmanButton");
const modal = document.getElementById("myModal");
const player1Div = document.getElementById("player1");
const player1AttemptsLeftDisplay = document.getElementById("player1AttemptsLeft");
const player2Div = document.getElementById("player2");
const player2AttemptsLeftDisplay = document.getElementById("player2AttemptsLeft");
const player1NameDisplay = document.getElementById("player1NameDisplay");
const player2NameDisplay = document.getElementById("player2NameDisplay");
const soloPlayerNameDisplay = document.getElementById("soloPlayerNameDisplay");
const soloAttemptsLeftDisplay = document.getElementById("soloAttemptsLeft");

// Get modal elements
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

//Buttons for the game
closeModalButton.addEventListener("click", () => {
  modal.style.display = "none";
});
playHangmanButton.addEventListener("click", () => {
  modal.style.display = "block";
});

function getRandomWord() {
  return wordList[Math.floor(Math.random() * wordList.length)];
}

function startNewGame() {
  let selectedMode = playerModeSelect.value;
  if (selectedMode === "single") {
    document.getElementById("soloAttemptsLeft").style.display = "inline";
    playerName = document.getElementById("playerName").value;
    if (!playerName.trim()) {
      alert("Your Name field cannot be empty.");
      return;
    }
    soloPlayerNameDisplay.textContent = `Player: ${playerName}`;
    soloAttemptsLeftDisplay.textContent = "6";
    currentWord = getRandomWord();
    guessedLetters = [];
    incorrectAttempts[playerName] = 0;
    maxAttempts[playerName] = 6;
    gameStarted = true;
    updateAttemptsLeftDisplay();
    displayWord();
    updatePlayerTurnDisplay();
    document.getElementById("playerName").style.display = "none";
  } else if (selectedMode === "multi") {
    let player1Check = document.getElementById("player1Name").value.trim();
    let player2Check = document.getElementById("player2Name").value.trim();
    if (!player1Check|| !player2Check) {
      alert("Player 1 and Player 2 fields cannot be empty.");
      return;
    }
    player1Div.style.display = "block";
    player2Div.style.display = "block";
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
  document.querySelector("label[for='playerName']").style.display = "none";
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
  document.getElementById("playerName").value = '';
  player1NameDisplay.textContent = '';
  player2NameDisplay.textContent = '';
  soloPlayerNameDisplay.textContent = '';
  player1AttemptsLeftDisplay.textContent = '';
  player2AttemptsLeftDisplay.textContent = '';
  soloAttemptsLeftDisplay.textContent = '';
  document.querySelector("label[for='playerName']").style.display = "block";
}

function updateAttemptsLeftDisplay() {
  if (playerModeSelect.value === "single") {
    soloAttemptsLeftDisplay.textContent = (maxAttempts[playerName] - incorrectAttempts[playerName]).toString();
  } else {
    player1AttemptsLeftDisplay.textContent = (maxAttempts[playerNames[0]] - incorrectAttempts[playerNames[0]]).toString();
    player2AttemptsLeftDisplay.textContent = (maxAttempts[playerNames[1]] - incorrectAttempts[playerNames[1]]).toString();
  }
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
  player1NameDisplay.textContent = `Player 1: ${playerNames[0]}`;
  player2NameDisplay.textContent = `Player 2: ${playerNames[1]}`;
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
      }
      displayWord();
      checkGameStatus(letter); // Call checkGameStatus for every guessed letter
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
  player1NameDisplay.textContent = '';
  player2NameDisplay.textContent = '';
  soloPlayerNameDisplay.textContent = '';
  player1AttemptsLeftDisplay.textContent = '';
  player2AttemptsLeftDisplay.textContent = '';
  soloAttemptsLeftDisplay.textContent = '';
  document.getElementById("playerName").style.display = "block";
  resetGame();
}


resetGameButton.addEventListener("click", () => {
    resetGame();
});

// Close modal when close button is clicked
closeModalButton.addEventListener("click", () => {
  modal.style.display = "none";
  document.getElementById("playerName").value = '';
  player1NameDisplay.textContent = '';
  player2NameDisplay.textContent = '';
  soloPlayerNameDisplay.textContent = '';
  player1AttemptsLeftDisplay.textContent = '';
  player2AttemptsLeftDisplay.textContent = '';
  soloAttemptsLeftDisplay.textContent = '';
  resetGame();
});

// Close modal when clicking outside the modal content
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

function hideAttemptsLeftInitially() {
  document.getElementById("soloAttemptsLeft").style.display = "none";
}

hideAttemptsLeftInitially();