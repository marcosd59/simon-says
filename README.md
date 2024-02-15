# simon-says-game

### <b><a href="https://bardirl.github.io/simon-says-game">¡Juega aquí!</a></b> 🟢 🔴 🔵 🟡

<p>¡Esta es mi versión del clásico juego de Simon Says! <em>Supera los 12 niveles y presume ante tus amigos.</em></p>
<p>El diseño de este proyecto proyecto le pertenece a <a href="https://github.com/megbuch/simon-says-game">megbuch<a/> y se uso como base para este proyecto. Está codificado en HTML5, CSS3 y JavaScript básico. A este juego se le agrego control por voz para hacerlo mas accesible y divertido.
​</p>

<h3>Cómo jugar</h3>
<ul>
   <li>Haz clic en el botón "JUGAR" para comenzar el juego.</li>
   <li>Se reproducirá la secuencia del ordenador.</li>
   <li>Una vez finalizada la secuencia del ordenador, es el turno del usuario.</li>
   <li>Haga clic en los mosaicos en el orden en que se mostraron.</li>
   <li>Si la secuencia coincide con la de la computadora, pasarás a la siguiente ronda. Cada ronda agregará un mosaico más a la secuencia.</li>
</ul>

<h3>Screenshots</h3>
 
![1](./img/screenshots/Captura%20de%20pantalla%202024-02-15%20073050.png)
![2](./img/screenshots/Captura%20de%20pantalla%202024-02-15%20073139.png)

<b>Pantalla Ganadora</b>

![3](./img/screenshots/Captura%20de%20pantalla%202024-02-15%20075946.png)

<b>Pantalla Perdedora</b>

![4](./img/screenshots/Captura%20de%20pantalla%202024-02-15%20073207.png)

<h3>Control por voz</h3>

En esta versión del clásico juego de Simon Dice, se ha incorporado una funcionalidad de control por voz para mejorar la interacción y hacer el juego aún más atractivo y moderno. A continuación se describen los pasos que se siguieron para implementar esta característica:

1. **Implementación del Reconocimiento de Voz**:

   Se ha utilizado la API de Web Speech para el reconocimiento de voz, permitiendo al usuario decir los colores en lugar de hacer clic.
   ```js
   if (!("webkitSpeechRecognition" in window)) {
     alert("Tu navegador no soporta la API de reconocimiento de voz. Prueba con Google Chrome.");
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
       }
     };
   }
   ```
2. **Traducción de Colores de Español a Inglés**:

   Para que el juego procese correctamente los colores dichos en español, se implementó una función de traducción.
   ```js
   function translateColorToEnglish(colorInSpanish) {
     const translation = {
       verde: "green",
       rojo: "red",
       amarillo: "yellow",
       azul: "blue",
     };
     return translation[colorInSpanish] || colorInSpanish;
   }
   ```

3. **Procesamiento de Secuencias de Colores Dicha**:
   Se añadió la capacidad de procesar una secuencia completa de colores dicha por el usuario, ajustando la secuencia a la longitud actual del juego.

   ```js
   function processColorSequence(spokenPhrase) {
     const spokenColors = spokenPhrase
       .split(" ")
       .map((color) => translateColorToEnglish(color));
     if (spokenColors.length > sequence.length) {
       info.innerText =
         "Demasiados colores. La secuencia solo tiene " +
         sequence.length +
         " colores.";
       return;
     }
     spokenColors.forEach((color, index) => {
       setTimeout(() => {
         if (tiles.includes(color)) {
           handleClick(color);
           info.innerText = "Secuencia: " + spokenPhrase.toUpperCase();
         } else {
           info.innerText = "Color no reconocido: " + color.toUpperCase();
         }
       }, index * 1000);
     });
   }
