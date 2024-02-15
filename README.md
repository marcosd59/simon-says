# simon-says-game

### <b><a href="https://bardirl.github.io/simon-says-game">¡Juega aquí!</a></b> 🟢 🔴 🔵 🟡

<p>¡Esta es mi versión del clásico juego de Simon Says! <em>Supera los 12 niveles y presume ante tus amigos.</em></p>
<p>El diseño de este proyecto proyecto le pertenece a <a href="https://github.com/megbuch/simon-says-game">megbuch<a/> y se uso como base para este proyecto. Está codificado en HTML5, CSS3 y JavaScript básico. A este juego se le agrego control por voz para hacerlo mas accesible y divertido.
​</p>

<h3>Cómo jugar</h3>
<ul>
   <li>Haz clic en el botón "JUGAR" para comenzar el juego.</li>
   <li>Se reproducirá la secuencia del ordenador.</li>
   <li>Una vez finalizada la secuencia del ordenador, es el turno del usuario. Haga clic en los mosaicos en el orden en que se mostraron.</li>
   <li>Si la secuencia coincide con la de la computadora, pasarás a la siguiente ronda. Cada ronda agregará una ficha más a la secuencia.</li>
</ul>

<h3>Screenshots</h3>
 
![1](./img/screenshots/Captura%20de%20pantalla%202024-02-15%20073050.png)
![2](./img/screenshots/Captura%20de%20pantalla%202024-02-15%20073139.png)

<b>Pantalla Ganadora</b>

![4](https://user-images.githubusercontent.com/115611931/211066876-1bc143b7-fe2f-4089-998f-97bd7b05e9d8.png)

<b>Pantalla Perdedora</b>

![5](./img/screenshots/Captura%20de%20pantalla%202024-02-15%20073207.png)

<h3>Control por voz</h3>

1. AAU, I want to click a button to start the game.

```js
startButton.addEventListener("click", startGame);
startButton.classList.add("hidden");
info.innerText = "Watch the sequence carefully!";
level = 0;
```

2. AAU, I want every level up to add one tile to the computer sequence.

```js
sequence.push(getRandomColor());
playSequence(sequence);
```

3. AAU, I want a randomly generated computer sequence to play.

```js
const randomColor = tiles[Math.floor(Math.random() * tiles.length)];
return randomColor;
```

4. AAU, I want the computer's sequence to illuminate tiles and play a corresponding sound at a timed interval.

```js
function playSequence(sequence) {
  sequence.forEach((color, index) => {
    setTimeout(() => {
      activateTile(color);
    }, index * 650);
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
```

5. AAU, I want to click the tiles, only when it is my turn.

```js
function userTurn() {
  board.classList.remove("unclickable");
  info.innerText = "Your turn!";
}
```

6. AAU, I want my clicks' values be stored.

```js
board.addEventListener("click", (event) => {
  const { tile } = event.target.dataset;
  if (tile) handleClick(tile);
});

userSequence.push(tile);
```

7. AAU, If my sequence is wrong at any point, then I want the game to end.

```js
for (let i = 0; i < userSequence.length; i++) {
  if (userSequence[i] !== sequence[i]) {
    reset();
    return;
  }
}
```

8. AAU, If I enter the correct sequence, then I want to level up. If I have beaten a specific number of rounds, then I want to win the game.

```js
if (userSequence.length === sequence.length) {
  if (level === 5) {
    winGame();
  } else {
    info.innerText = "You're doing great! Keep it up!";
    setTimeout(levelUp, 1200);
    return;
  }
}
```

9. AAU, I want to see the screen change upon a win and a loss. I want my high score to be recorded. I also want to be able to replay.

```js
//loss
const sound = document.querySelector(`[data-sound='game-over']`);
sound.play();

document.body.style.background = "linear-gradient(to top, #EA8F8F, #C12727)";
info.innerText = "Game over! 😈 Play again?";

//win
const sound = document.querySelector(`[data-sound='game-win']`);
sound.play();

document.body.style.background = "linear-gradient(to top, #BEF1CB, #60BC77)";
info.innerText = "Amazing work! 🤩 You win!";

//reset
sequence = [];
userSequence = [];
level = 0;

//start button appears, board unclickable
startButton.classList.remove("hidden");
board.classList.add("unclickable");
```

10. AAU, I want my high score to be updated and recorded.

```js
if (highScore < level) {
  highScore = level;
}

highScoreText.innerText = highScore;
```
