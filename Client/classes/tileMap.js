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
                  } else if (tile == 3) { // Dirt Background
                        this.tiles[i - 2] = new Tile.ColorTile(x, y, false, "3");
                        continue;
                  } else if (tile == 4) { // Grass Background
                        this.tiles[i - 2] = new Tile.ColorTile(x, y, false, "4");
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

            if (x < 0 || x >= this.width ||
                y < 0 || y >= this.height||
                this.tiles[x + (y * this.width)] === undefined) {
                  return null;                  
            }
            
            return this.tiles[x + (y * this.width)];
      };

      return ns;
})();