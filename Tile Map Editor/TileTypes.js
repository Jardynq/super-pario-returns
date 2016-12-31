var tileTypes = [
      {
            description: "Sky Background",
            id: 0,
            color: "#527DFF",
            hasCollision: false,
      },
      {
            description: "Dirt Foreground",
            id: 1,
            color: "#632712",
            hasCollision: true,
      },
      {
            description: "Grass Foreground",
            id: 2,
            color: "#458B00",
            hasCollision: true,
      },
      {     
            description: "Dirt Background",
            id: 3,
            color: "#1C0D07",
            hasCollision: false,
      },
      {
            description: "Grass Background",
            id: 4,
            color: "#1C3603",
            hasCollision: false,
      },
];
setActiveTile = function (object, x, y) {
      for (i = 0; i < tileTypes.length; i++) {
            if (object === i) {
                  return new Tile.ColorTile(tileTypes[i].color, x, y, tileTypes[i].hasCollision, tileTypes[i].id);
            }
      }
};