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
                        this.tiles[i - 2] = new Tile.ColorTile("blue", x, y, false);
                  }
                  if (tile == 1) { // Ground
                        this.tiles[i - 2] = new Tile.ColorTile("black", x, y, true);
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
      ns.Map.prototype.getTileAt = function (x, y) {
            x = Math.floor(x / this.tilesize);
            y = Math.floor(y / this.tilesize);
            
            if (this.getTile(x, y) === undefined) {
                  return null;
            }

            return this.getTile(x, y);
      };

      return ns;
})();