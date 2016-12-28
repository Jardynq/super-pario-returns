TileMap = (function () {
      var ns = {};

      ns.Map = function Map (width, height, tilesize) {
            this.tilesize = tilesize;
            this.width = width;
            this.height = height;
            this.tiles = [];
            
            this.generateMap();
      };
      ns.Map.prototype.generateMap = function () {
            for (var y = 0; y < this.height; y++) {
                  for (var x = 0; x < this.width; x++) {
                        this.tiles[x + (y * this.width)] = new Tile.ColorTile("blue", x, y, "0");
                  }
            }
      };
      ns.Map.prototype.updateTile = function(tile, newTile) {
            this.tiles[tile.x + (tile.y * this.width)] = newTile;
      };

      // Getting a precise tile
      ns.Map.prototype.getTile = function (x, y) {
            x = Math.floor(x);
            y = Math.floor(y);

            if (x < 0) {
                  x  = 0;
            }
            if (this.tiles[x + (y * this.width)] === undefined) {
                  return null;
            }

            // If x is larger than the width of the map then this makes sure it does not overflow
            if (x >= this.width) {
                  return this.tiles[(this.width - 1) + (y * this.width)];
            } else {
                  return this.tiles[x + (y * this.width)];
            }
      };

      return ns;
})();