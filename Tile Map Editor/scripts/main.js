// Global Variables
var canvas = null;
var ctx = null;

var map = null;
var room = null;

var tileTypes = {
      "0": ("blue", 0, 0, "0"),
      "1": ("black", 0, 0, "1"),
};

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
      document.getElementById("btn-new-map").addEventListener("click", function () {
            document.getElementById("UI").style.display = "none";

            var width = document.getElementById("inp-width").value;
            var height = document.getElementById("inp-height").value;
            var tilesize = document.getElementById("inp-tilesize").value;
            var chosenStartTile = document.getElementById("inp-start-tile").value;
            var map = new TileMap.Map(width, height, tilesize);

            map.generateMap(chosenStartTile);
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

/**
 * Set attributes for html elements
 * 
 */
function setAttributes(el, options) {
      Object.keys(options).forEach(function(attr) {
            el.setAttribute(attr, options[attr]);
      });
}

window.addEventListener("load", init);

// Event handlers for Input.js that is used to check which key is down or up
window.addEventListener('keydown', Input.onKeyDown);
window.addEventListener("keyup", Input.onKeyUp);