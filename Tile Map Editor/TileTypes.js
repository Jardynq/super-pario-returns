var tileTypes = [
      {
            description: "Sky Background",
            id: 0,
            color: "#527DFF"
      },
      {
            description: "Dirt Foreground",
            id: 1,
            color: "#632712"
      },
      {
            description: "Grass Foreground",
            id: 2,
            color: "#458B00"
      },
      {     
            description: "Dirt Background",
            id: 3,
            color: "#1C0D07"
      },
      {
            description: "Grass Background",
            id: 4,
            color: "#1C3603"
      }
];
setActiveTile = function (object, x, y) {
      if (object === 0) {
            return new Tile.ColorTile(tileTypes[0].color, x, y, tileTypes[0].id);
      }
      if (object === 1) {
            return new Tile.ColorTile(tileTypes[1].color, x, y, tileTypes[1].id);
      }
      if (object === 2) {
            return new Tile.ColorTile(tileTypes[2].color, x, y, tileTypes[2].id);
      }
      if (object === 3) {
            return new Tile.ColorTile(tileTypes[3].color, x, y, tileTypes[3].id);
      }
      if (object === 4) {
            return new Tile.ColorTile(tileTypes[4].color, x, y, tileTypes[4].id);
      }
};