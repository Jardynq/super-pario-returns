TileMap = (function () {
      var ns = {};

      ns.Map = function Map (width, height, tilesize) {
            this.tilesize = tilesize;
            this.width = width;
            this.height = height;
            this.tiles = [];
      };
      ns.Map.prototype.generateMap = function (tile) {
            for (var y = 0; y < this.height; y++) {
                  for (var x = 0; x < this.width; x++) {

                        this.tiles[x + (y * this.width)] = setActiveTile(tile, x, y);
                  }
            }
      };
      ns.Map.prototype.loadMap = function (data) {
            data =  data.replace(/\r\n*/g, '\n');
            var rows = data.split("\n");

            var offset = 0;
            if (rows[rows.length - 1] === "") {
                  offset = 1;
            }

            this.width = rows[0].split(",").length;
            this.height = rows.length - offset;

            for (y = 0; y < this.height; y++) {
                  var tileRow = rows[y].split(",");
                  for (x = 0; x < this.width; x++) {
                        var tile = tileRow[x];

                        this.tiles[x + (y * this.width)] = setActiveTile(parseInt(tile), x, y);
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