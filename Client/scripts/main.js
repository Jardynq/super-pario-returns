// Global Variables
var canvas = null;
var ctx = null;

var map = null;
var room = null;

var lastTickCount = new Date().getTime();

Socket.connect(init);

/**
 * Main game loop
 * 
 */
function step () {
      var newTickCount = new Date().getTime();
      var elapsedMilliseconds = newTickCount - lastTickCount;
      var timeScale = elapsedMilliseconds / 1000;
      lastTickCount = newTickCount;

      room.step(timeScale);
      room.renderAll(ctx);      
      window.requestAnimationFrame(step); // Request next frame
}




/**
 * Initializes the game
 * 
 */
function init () {
      canvas = document.getElementById("game-canvas");
      ctx = canvas.getContext("2d");
      fixCanvas();

      window.addEventListener("resize", fixCanvas); 

      // Create the game room
      room = new GameRoom();

      // Start the main loop
      step();
}

// Adapts canvas to screen size
function fixCanvas () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
}

// Event handlers for Input.js that is used to check which key is down or up
window.addEventListener('keydown', Input.onKeyDown);
window.addEventListener("keyup", Input.onKeyUp);