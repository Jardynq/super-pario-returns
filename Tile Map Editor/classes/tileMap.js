TileMap = (function () {
      var ns = {};

      ns.Map = function Map (width, height, tilesize) {
            this.tilesize = tilesize;
            this.width = width;
            this.height = height;
            this.tiles = [];
      };
      ns.Map.prototype.generateMap = function (chosenStartTile) {
            for (var y = 0; y < this.height; y++) {
                  for (var x = 0; x < this.width; x++) {

                        if (chosenStartTile === "0") { // Sky
                              this.tiles[x + (y * this.width)] = new Tile.ColorTile("#4876FF", x, y, "0");
                              continue;                              
                        } else if (chosenStartTile === "1") { // Dirt
                              this.tiles[x + (y * this.width)] = new Tile.ColorTile("#5E2612", x, y, "1");
                              continue;                              
                        } else if (chosenStartTile === "2") { // Grass
                              this.tiles[x + (y * this.width)] = new Tile.ColorTile("#458B00", x, y, "2");
                              continue;                              
                        } else if (chosenStartTile === "3") { // Dirt Background
                              this.tiles[x + (y * this.width)] = new Tile.ColorTile("#261109", x, y, "3");
                              continue;                              
                        } else if (chosenStartTile === "4") { // Grass Background
                              this.tiles[x + (y * this.width)] = new Tile.ColorTile("#2C5702", x, y, "4");
                              continue;                              
                        }
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

                        if (tile === "0") { // Sky
                              this.tiles[x + (y * this.width)] = new Tile.ColorTile("#4876FF", x, y, "0");
                              continue;                              
                        } else if (tile === "1") { // Ground
                              this.tiles[x + (y * this.width)] = new Tile.ColorTile("#5E2612", x, y, "1");
                              continue;
                        } else if (tile === "2") { // Ground
                              this.tiles[x + (y * this.width)] = new Tile.ColorTile("#458B00", x, y, "2");
                              continue;
                        } else if (tile=== "3") { // Dirt Background
                              this.tiles[x + (y * this.width)] = new Tile.ColorTile("#261109", x, y, "3");
                              continue;                              
                        } else if (tile === "4") { // Grass Background
                              this.tiles[x + (y * this.width)] = new Tile.ColorTile("#2C5702", x, y, "4");
                              continue;                              
                        }
                  }
            }
            console.log(this.width);
            console.log(this.height);
            console.log(this.tiles);
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