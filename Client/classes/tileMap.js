TileMap = (function () {
      var ns = {};

      ns.Map = function Map (reader, tilesize) {
            this.tilesize = tilesize;
            this.width = null;
            this.height = null;
            this.tiles = [];
            
            this.generateMap(reader);
      };
      ns.Map.prototype.generateMap = function (reader) {
            this.width = reader.getUint8(1, true);

            // Parses the byte array
            for (var i = 2; i < reader.byteLength; i++) {
                  var tile = reader.getUint8(i, true);
                  var x = (i - 2) % this.width;
                  var y = (i - 2 - x) / this.width;

                  if (tile === 0) { // Sky
                        this.tiles[i - 2] = new Tile.ColorTile(x, y, false, "0");
                        continue;
                  } else if (tile == 1) { // Dirt
                        this.tiles[i - 2] = new Tile.ColorTile(x, y, true, "1");
                        continue;
                  } else if (tile == 2) { // Grass
                        this.tiles[i - 2] = new Tile.ColorTile(x, y, true, "2");
                        continue;
                  }
            }

            // Sets the height var
            this.height = this.tiles.length / this.width;
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
      ns.Map.prototype.getTileAt = function (x, y) {
            x = Math.floor(x / this.tilesize);
            y = Math.floor(y / this.tilesize);
            
            return this.getTile(x, y);
      };

      return ns;
})();