TileMap = (function () {
      var ns = {};

      ns.Map = function Map (tileData, tilesize) {
            this.tileData = tileData;
            this.tilesize = tilesize;
            this.width = null;
            this.height = null;
            this.tiles = [];
      };
      ns.Map.prototype.generateMap = function () {
            // Formats the map we got from the server

            var rows = this.tileData.split('|');

            // Get the width of the map
            this.width = rows[0].split(',').length;

            // Generate the map from the supplied string
            for (var y = 0; y < rows.length; y++) {
            var columns = rows[y].split(',');
                  for (var x = 0; x < columns.length; x++) {
                        var tileData = columns[x];
                        if (tileData == "0") { // Sky
                              this.tiles[y * this.width + x] = new Tile.ColorTile("blue", x, y, false);
                        }
                        if (tileData == "1") { // Ground
                              this.tiles[y * this.width + x] = new Tile.ColorTile("black", x, y, true);
                        }
                        if (tileData == "2") { // Debug
                              this.tiles[y * this.width + x] = new Tile.ColorTile("yellow", x, y, true);
                              console.log(this.tiles[y * this.width + x]);
                        }
                  }
            }

            // Sets the height var
            this.height = this.tiles.length / this.width;
      };
      
      // Getting a precise tile
      ns.Map.prototype.getTile = function (x, y) {
            x = Math.floor(x);
            y = Math.floor(y);

            if (this.tiles[x + (y * this.width)] === undefined) {
                  return null;
            }

            // If x is larger than the width of the map then this makes sure it does not overflow and go down to zero
            if (x >= this.width) {
                  return this.tiles[(this.width - 1) + (y * this.width)];
            } else {
                  return this.tiles[x + (y * this.width)];
            }
      };

      return ns;
})();