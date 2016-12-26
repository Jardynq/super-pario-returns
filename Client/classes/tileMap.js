TileMap = (function () {
      var ns = {};

      ns.Map = function Map (tiles, tilesize) {
            this.tiles = tiles;
            this.tilesize = tilesize;
            this.width = null;
      };
      ns.Map.prototype.generateMap = function () {
            // Formats the map we got from the server

            // Temporary tiles where there are no commas
            var temp = this.tiles.split(",");

            for (var i = 0; i < temp.length; i++) {
                 if (temp[i] === "|") {
                       this.width = i;
                       this.tiles = this.tiles.split(/[\|,]+/);
                       break;
                 } 
            }

            // Generates the map
            for (var g = 0; g < this.tiles.length; g++) {
                  var tile = this.tiles[g];
                  var x =  g % this.width;   

                  // Fills the appropriate tile

                  if (tile === "0") { // Sky
                        this.tiles[g] = new Tile.ColorTile("blue", x, (g - x) / this.width, false);
                        continue;
                  }
                  if (tile === "1") { // Ground
                        this.tiles[g] = new Tile.ColorTile("black", x, (g - x) / this.width, true);
                        continue;
                  }
            }
      };

      return ns;
})();
  
  
  
  
  
  
      // Getting a precise tile
      /* ns.Map.prototype.getTile = function (x, y) {
            x = Math.floor(x);
            y = Math.floor(y);

            if (this.tiles[x + (y * this.width)] === undefined) {
                  return null;
            }

            return this.tiles[x + (y * this.width)];
      };*/