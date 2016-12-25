var GameRoom = function () {
      // Request map from server
      Socket.registerHandler("map", this, this.loadMap);
      Socket.sendPacket("map");

      this.render = new Render.Render(64);
      this.tileRenderer = null;
};

GameRoom.prototype.loadMap = function (tileData) {
      this.map = new TileMap.Map(tileData);

      // Generates our tilemap
      this.map.generateMap();

      if (this.tileRenderer !== null) {
            this.tileRenderer.removeFromRenderQueue(this.render.renderQueue);
      }
      this.tileRenderer = new Render.TileRenderer(this.map);
      this.tileRenderer.addToRenderQueue(this.render.renderQueue);
};

GameRoom.prototype.step = function () {
      
};

GameRoom.prototype.renderAll = function (ctx) {
      this.render.renderAll(ctx);
};