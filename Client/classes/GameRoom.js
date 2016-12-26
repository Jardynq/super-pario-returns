var GameRoom = function () {
      // Request map from server
      Socket.registerHandler("map", this, this.loadMap);
      Socket.sendPacket("map");

      this.render = new Render.Render();
      this.tileRenderer = null;
      this.entityRenderer = null;

      this.entities = [];
};

GameRoom.prototype.loadMap = function (tileData) {
      this.map = new TileMap.Map(tileData, 64);

      // Generates our tilemap
      this.map.generateMap();

      // Initializes the render engine for tiles
      if (this.tileRenderer !== null) {
            this.tileRenderer.removeFromRenderQueue(this.render.renderQueue);
      }
      this.tileRenderer = new Render.TileRenderer(this.map);
      this.tileRenderer.addToRenderQueue(this.render.renderQueue);

      // Initializes the render engine for entities
      if (this.entityRenderer !== null) {
            this.entityRenderer.removeFromRenderQueue(this.render.renderQueue);
      }
      this.entityRenderer = new Render.EntityRenderer(this);
      this.entityRenderer.addToRenderQueue(this.render.renderQueue);
};

GameRoom.prototype.step = function () {
      
};

GameRoom.prototype.renderAll = function (ctx) {
      this.render.renderAll(ctx);
};

GameRoom.prototype.addToEntities = function (entity) {
      entity.index = this.entities.length;
      this.entities.push(entity);
};
GameRoom.prototype.removeFromEntities = function (entity) {
      this.entities.splice(entity.index, 1);
      for (var i = entity.index; i < this.entities.length; i++ ) {
            this.entities[i].index--;
      }
};