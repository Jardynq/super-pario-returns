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
            this.width = reader.getUint16(1, true);

            // Parses the byte array
            for (var i = 3; i < reader.byteLength; i++) {
                  var tile = reader.getUint8(i, true);
                  var x = (i - 3) % this.width;
                  var y = (i - 3 - x) / this.width;

                  this.tiles[x + (y * this.width)] = setActiveTile(parseInt(tile), x, y);
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