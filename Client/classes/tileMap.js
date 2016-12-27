TileMap = (function () {
      var ns = {};

      ns.Map = function Map (tileData, tilesize) {
            this.tileData = tileData;
            this.tilesize = tilesize;
            this.width = null;
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