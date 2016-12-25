// Global Variables
var canvas = null;
var ctx = null;

var map = null;
var room = null;

Socket.connect(init);

/**
 * Main game loop
 * 
 */
function step () {
      room.step();
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
      canvas.height = window.innerHeight; // HD
}

