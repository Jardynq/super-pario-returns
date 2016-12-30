// Global Variables
var canvas = null;
var ctx = null;

var map = null;
var room = null;

var lastTickCount = new Date().getTime();
var lastFpsUpdate = new Date().getTime();

var fps = 60;

Entity.gravity = 1000;
Entity.maxFallSpeed = 1000;

Socket.connect(init);

/**
 * Main game loop
 * 
 */
function step () {
      var newTickCount = new Date().getTime();
      var newFpsUpdate = new Date().getTime();

      // timeScale
      var elapsedMilliseconds = newTickCount - lastTickCount;
      var timeScale = elapsedMilliseconds / 1000;

      // Fps
      if (newFpsUpdate - lastFpsUpdate > 150) {
            fps = Math.round(1000 / (newTickCount - lastTickCount));
            lastFpsUpdate = newFpsUpdate;
      }

      lastTickCount = newTickCount;

      // Main
      room.step(timeScale);
      room.render.renderAll(ctx);    
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
window.addEventListener('mousedown', Input.onMouseDown);
window.addEventListener("mouseup", Input.onMouseUp);
window.addEventListener("mousemove", Input.onMouseMove);