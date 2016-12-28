var GameRoom = function () {
      // Register socket handlers
      Socket.registerHandler(Socket.PACKET_TYPES.map, this, this.loadMap);
      Socket.registerHandler(Socket.PACKET_TYPES.entity, this, this.updateEntities);
      Socket.registerHandler(Socket.PACKET_TYPES.join, this, this.onJoin);
      Socket.registerHandler(Socket.PACKET_TYPES.ping, this, this.ping);

      this.render = new Render.Render();
      this.tileRenderer = null;
      this.entityRenderer = null;

      this.entities = {};

      this.mouseX = null;
      this.mouseY = null;

      this.player = null;
};
// Main step function
GameRoom.prototype.step = function (timeScale) {
      for (var id in this.entities) {
            this.entities[id].step(timeScale);
      }

      this.updateScreenOffset();
};

// Packet handler functions
GameRoom.prototype.loadMap = function (reader) {
      this.map = new TileMap.Map(reader, 50);

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
GameRoom.prototype.updateEntities = function (reader) {
      var amount = reader.getUint16(9, true);

      var offset = 11;
      for (i = 0; i < amount; i++) {
            // The length in bytes of this entity
            var entityLength = reader.getUint8(offset, true);
            var entityData = reader.buffer.slice(offset, offset + entityLength + 1);
            var entityView = new DataView(entityData);
            var id = entityView.getUint16(1, true);
            offset += entityData.byteLength;

            if (this.entities[id] === undefined) {
                  var type = entityView.getUint8(2, true);
                  var entity;

                  if (type === Entity.ENTITY_TYPES.player) {
                        entity = new PlayerEntity(entityView);
                  } else {
                        throw "Unknown entity recieved. Type is: " + type;
                  }

                  entity.id = id;
                  this.addToEntities(entity);
            } else {
                  this.entities[id].update(entityView);
            }
      }
};
GameRoom.prototype.onJoin = function (reader) {
      Entity.gravity = reader.getFloat32(1, true);
      Entity.maxFallSpeed = reader.getFloat32(5, true);
      this.player = this.entities[reader.getUint16(9, true)];
      this.player.setMain();
};
GameRoom.prototype.ping = function (reader) {
      Socket.sendPacket(reader.buffer);
};



// Rendering functions
GameRoom.prototype.renderAll = function (ctx) {
      this.render.renderAll(ctx);
};
GameRoom.prototype.updateScreenOffset = function () {
      if (this.player !== null) {
            // Sets player as centrum
            this.render.offsetX = -this.player.x + canvas.width * (0.5 / this.render.zoom);
            this.render.offsetY = -this.player.y + canvas.height * (0.5 / this.render.zoom);
      }

      // View space position limits
      if (-this.render.offsetX <= 0) {
            this.render.offsetX = -0;
      } else if (-this.render.offsetX * this.render.zoom >= this.map.width * this.map.tilesize * this.render.zoom - canvas.width) {
            this.render.offsetX = -(this.map.width * this.map.tilesize * this.render.zoom - canvas.width) / this.render.zoom;
      }
      if (-this.render.offsetY <= 0) {
            this.render.offsetY = -0;
      } else if (-this.render.offsetY * this.render.zoom >= this.map.tiles.length / this.map.width * this.map.tilesize * this.render.zoom - canvas.height) {
            this.render.offsetY = -(this.map.tiles.length / this.map.width * (this.map.tilesize * this.render.zoom) - canvas.height) / this.render.zoom;
      }

};

// Entity functions
GameRoom.prototype.addToEntities = function (entity) {
      this.entities[entity.id] = entity;
};
GameRoom.prototype.removeFromEntities = function (entity) {
      delete this.entities[entity.id];
};

// Inputs
GameRoom.prototype.onKeyDown = function (e) {

};
GameRoom.prototype.onKeyUp = function (e) {      
      
};
GameRoom.prototype.onMouseWheel = function (e) {
        // Max zoom
        if (this.render.zoom >= 2.25) {
            this.render.zoom = 2.25;
        } else if (this.render.zoom <= 0.75) {
            this.render.zoom = 0.75;
        }

        if (e.wheelDelta > 0) {
            this.render.zoom += 0.075;
        } else if (e.wheelDelta < 0) {
            this.render.zoom -= 0.075;
        }    
      
};
GameRoom.prototype.onMouseMove = function (e) {
      this.mouseX = e.x;
      this.mouseY = e.y;
};