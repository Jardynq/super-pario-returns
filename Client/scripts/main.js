// Global Variables
var canvas = null;
var ctx = null;

var map = null;

// DEBUG
var tileRenderer = null;
// DEBUG


var socket = new WebSocket("ws:localhost.dev/");
socket.onmessage = onMessage;
socket.onopen = firstInit;

/**
 * Main game loop
 * 
 */
function step () {
      
    Render.renderAll(ctx);

    window.requestAnimationFrame(step); // Request next frame

}




/**
 * Initialises the canvas ands send a pcket to the server
 * First init to run, right after you connect to the server then it will send a packet (map request)
 * 
 */
function firstInit () {
      canvas = document.getElementById("game-canvas");
      ctx = canvas.getContext("2d");
      fixCanvas();

      window.addEventListener("resize", fixCanvas); 

      sendPacket("map");
}

/**
 * Initialises the map and game
 * Second init to run, right after you recieve the packet (map) from the server
 * 
 */
function secondInit (tileMap) {
      map = new TileMap.Map(tileMap);

      // Generates our tilemap
      map.generateMap();
    
      // Initialises gameRoom
      //gameRoom.init(map);

      // DEBUG
      tileRenderer = new Render.TileRenderer(map);
      tileRenderer.addToRenderQueue();
      // DEBUG

      step(); // Starts main loop
}

// Adapts canvas to screen size
function fixCanvas () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight; // HD
}