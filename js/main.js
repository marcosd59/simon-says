const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

let sequence = [];
let userSequence = [];
let level;
let highScore = 0;

const board = document.querySelector(".board");
const startButton = document.getElementById("play");
const info = document.getElementById("info");
const highScoreText = document.getElementById("high-score");
const levelText = document.getElementById("level");

const tiles = ["green", "red", "yellow", "blue"];

// Función para traducir colores de español a inglés
function translateColorToEnglish(colorInSpanish) {
  const translation = {
    verde: "green",
    rojo: "red",
    amarillo: "yellow",
    azul: "blue",
  };
  return translation[colorInSpanish] || colorInSpanish;
}

if (!("webkitSpeechRecognition" in window)) {
  alert(
    "Tu navegador no soporta la API de reconocimiento de voz. Prueba con Google Chrome."
  );
} else {
  var recognition = new webkitSpeechRecognition();
  recognition.lang = "es-ES";
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onresult = function (event) {
    var last = event.results.length - 1;
    var colorInSpanish = event.results[last][0].transcript.trim().toLowerCase();
    var colorInEnglish = translateColorToEnglish(colorInSpanish);

    if (tiles.includes(colorInEnglish)) {
      handleClick(colorInEnglish);
      info.innerText = "Color: " + colorInSpanish;
    } else {
      info.innerText = "Color no reconocido: " + colorInSpanish;
      console.log("Color no reconocido: " + colorInSpanish);
    }
  };

  recognition.onerror = function (event) {
    info.innerText = "Error en el reconocimiento de voz: " + event.error;
    console.log("Error en el reconocimiento de voz: ", event.error);
  };
}

recognition.onresult = function (event) {
  var last = event.results.length - 1;
  var spokenPhrase = event.results[last][0].transcript.trim().toLowerCase();
  processColorSequence(spokenPhrase);
};

function processColorSequence(spokenPhrase) {
  const spokenColors = spokenPhrase
    .split(" ")
    .map((color) => translateColorToEnglish(color));

  // Limitar la secuencia a la longitud actual del juego
  if (spokenColors.length > sequence.length) {
    info.innerText =
      "Demasiados colores. La secuencia solo tiene " +
      sequence.length +
      " colores.";
    return;
  }

  // Procesar la secuencia dicha
  spokenColors.forEach((color, index) => {
    setTimeout(() => {
      if (tiles.includes(color)) {
        handleClick(color);
        info.innerText = "Secuencia: " + spokenPhrase.toUpperCase();
        console.log("Color: " + color.toUpperCase());
      } else {
        console.log("Color no reconocido: " + color.toUpperCase());
        info.innerText = "Color no reconocido: " + color.toUpperCase();
      }
    }, index * 1000); // Retraso entre colores
  });
}

startButton.addEventListener("click", startGame);
board.addEventListener("click", (event) => {
  const { tile } = event.target.dataset;
  if (tile) handleClick(tile);
});

function startGame() {
  startButton.classList.add("hidden");
  info.innerText = "¡Mira la secuencia con atención!";
  level = 0;
  document.body.style.background = "linear-gradient(to top, #87b7ff, #6f7cf5)";
  levelUp();
}

function levelUp() {
  level = level + 1;
  userSequence = [];
  board.classList.add("unclickable");
  info.innerText = "¡Mira la secuencia!";
  levelText.innerText = level;

  sequence.push(getRandomColor());
  playSequence(sequence);

  setTimeout(() => {
    userTurn();
  }, level * 700 + 200);
}

function getRandomColor() {
  const randomColor = tiles[Math.floor(Math.random() * tiles.length)];
  console.log("Color aleatorio: ", randomColor);
  return randomColor;
}

function playSequence(sequence) {
  sequence.forEach((color, index) => {
    setTimeout(() => {
      activateTile(color);
    }, index * 700);
  });
}

function activateTile(color) {
  const tile = document.querySelector(`[data-tile='${color}']`);
  const sound = document.querySelector(`[data-sound='${color}']`);

  tile.classList.remove("inactive");
  sound.play();

  setTimeout(() => {
    tile.classList.add("inactive");
  }, 300);
}

function userTurn() {
  board.classList.remove("unclickable");
  info.innerText = "¡Tu turno! Haz clic o di el color.";
  recognition.start(); // Iniciar el reconocimiento de voz
}

function handleClick(tile) {
  userSequence.push(tile);
  activateTile(tile); // Esta función se encarga de iluminar el color
  const sound = document.querySelector(`[data-sound='${tile}']`);
  sound.play();

  for (let i = 0; i < userSequence.length; i++) {
    if (userSequence[i] !== sequence[i]) {
      recognition.stop(); // Detener el reconocimiento de voz
      reset();
      return;
    }
  }

  if (userSequence.length === sequence.length) {
    recognition.stop(); // Detener el reconocimiento de voz
    if (level === 12) {
      winGame();
    } else {
      info.innerText = "¡Lo estás haciendo genial! ¡Avanza!";
      setTimeout(levelUp, 1300);
      return;
    }
  }
}

function reset() {
  const sound = document.querySelector(`[data-sound='game-over']`);
  sound.play();

  if (highScore < level) {
    highScore = level;
  }

  sequence = [];
  userSequence = [];
  level = 0;

  startButton.classList.remove("hidden");
  board.classList.add("unclickable");

  document.body.style.background = "linear-gradient(to top, #EA8F8F, #C12727)";
  info.innerText = "¡Juego terminado! 😈 ¿Jugar de nuevo?";
  highScoreText.innerText = highScore;
}

function winGame() {
  const sound = document.querySelector(`[data-sound='game-win']`);
  sound.play();

  if (highScore < level) {
    highScore = level;
  }

  sequence = [];
  userSequence = [];
  level = 0;

  startButton.classList.remove("hidden");
  board.classList.add("unclickable");

  document.body.style.background = "linear-gradient(to top, #BEF1CB, #60BC77)";
  info.innerText = "¡Increíble trabajo! 🤩 ¡Tú ganas!";
  highScoreText.innerText = highScore;
}
