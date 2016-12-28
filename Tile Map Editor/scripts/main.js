// Global Variables
var canvas = null;
var ctx = null;

var map = null;
var room = null;

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

      room.loadMap();

      // Start the main loop
      step();
}

// Adapts canvas to screen size
function fixCanvas () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
}




/**
 * Dowload files
 * 
 */
function download(filename, text) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
}




/**
 * Checking for input
 * 
 */
function onKeyDown (e) {

      room.onKeyDown(e);
}
function onKeyUp (e) {
      room.onKeyUp(e);
}
function onMouseWheel (e) {
      room.onMouseWheel(e);
}
function onMouseMove (e) {
      room.onMouseMove(e);      
}
function onMouseDown (e) {
      room.onMouseDown(e);
}
function onMouseUp (e) {
      room.onMouseUp(e);
}
window.addEventListener("load", init);

// Event handlers for Input.js that is used to check which key is down or up
window.addEventListener('keydown', Input.onKeyDown);
window.addEventListener("keyup", Input.onKeyUp);

// Event handlers for the game
window.addEventListener('keydown', onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.addEventListener('wheel', onMouseWheel);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener("mousedown", onMouseDown);
window.addEventListener("mouseup", onMouseUp);