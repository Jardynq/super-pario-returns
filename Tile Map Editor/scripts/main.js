// Global Variables
var canvas = null;
var ctx = null;

var map = null;
var room = null;

var lastTickCount = new Date().getTime();
var lastFpsUpdate = new Date().getTime();

var fps = 60;

/**
 * Main game loop
 * 
 */
function step () {
      var newTickCount = new Date().getTime();
      var newFpsUpdate = new Date().getTime();

      // Fps
      if (newFpsUpdate - lastFpsUpdate > 150) {
            fps = Math.round(1000 / (newTickCount - lastTickCount));
            lastFpsUpdate = newFpsUpdate;
      }
      lastTickCount = newTickCount;

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

      var startTile = document.getElementById("inp-start-tile");
      for (i = 0; i < tileTypes.length; i++) {      
            var option = document.createElement("option");
            option.text = tileTypes[i].id +  " : " + tileTypes[i].description;
            option.value = tileTypes[i].id;

            startTile.appendChild(option);
      }

      // Create the game room
      document.getElementById("btn-new-map").addEventListener("click", function () {
            document.getElementById("UI").style.display = "none";

            var width = document.getElementById("inp-width").value;
            var height = document.getElementById("inp-height").value;
            var tilesize = document.getElementById("inp-tilesize").value;
            var chosenStartTile = document.getElementById("inp-start-tile").value;
            var map = new TileMap.Map(width, height, tilesize);

            map.generateMap(parseInt(chosenStartTile));
            room = new TileEditorRoom(map);

            // Starts the main loop
            step();
      });
      document.getElementById("map-file-input").onchange = function () {
            document.getElementById("UI").style.display = "none";
            var input = document.getElementById("map-file-input");
            if (input.files.length === 1) {
                  var file = input.files[0];
                  var reader = new FileReader();
                  reader.readAsText(file);
                  reader.onloadend = function (e) {
                        var tilesize = document.getElementById("inp-tilesize").value;
                        var map = new TileMap.Map(0, 0, tilesize);
                        map.loadMap(e.currentTarget.result);

                        room = new TileEditorRoom(map);
                        // Starts the main loop
                        step();
                  };
            }
      };
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

window.addEventListener("load", init);

// Event handlers for Input.js that is used to check which key is down or up
window.addEventListener('keydown', Input.onKeyDown);
window.addEventListener("keyup", Input.onKeyUp);