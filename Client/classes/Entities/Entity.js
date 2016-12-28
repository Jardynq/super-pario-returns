var Entity = function (reader) {
      this.width = null;
      this.height = null;

      this.onGround = false;

      this.update(reader);
};
Entity.prototype = Object.create(Render.RenderObject.prototype); // Entity inherits RenderObject
Entity.prototype.constructor = Entity;
Entity.prototype.render = function (ctx, render) {
      ctx.beginPath();
      ctx.rect((this.x - this.width * 0.5 + render.offsetX) * render.zoom, (this.y - this.height * 0.5 + render.offsetY) * render.zoom, this.width * render.zoom, this.height * render.zoom);
      ctx.fillStyle = this.color;

      ctx.stroke();      
      ctx.fill();
};

Entity.prototype.update = function (reader) {
      if (this.x === undefined) {
            this.x = this.y = 200;
            this.ySpeed = this.xSpeed = 0;
      }
      this.x = reader.getInt16(4, true);
      this.y = reader.getInt16(6, true);

      this.xSpeed = reader.getFloat32(8, true);
      this.ySpeed = reader.getFloat32(12, true);
};

Entity.prototype.step = function (timeScale) {
      if (this.hasGravity) {
            this.ySpeed = Math.min(this.ySpeed + Entity.gravity * timeScale, Entity.maxFallSpeed);
      }

      this.onGround = false;

      this.x += this.xSpeed * timeScale;
      this.handleCollision(true);
      this.y += this.ySpeed * timeScale;
      this.handleCollision(false);
};

Entity.prototype.handleCollision = function (x) {
            speed = x ? this.xSpeed : this.ySpeed;

            var collisionTiles = [
                  room.map.getTileAt(this.x - this.width * 0.5 + 0.3, this.y - this.height * 0.5 + 0.3),
                  room.map.getTileAt(this.x + this.width * 0.5 - 0.3, this.y - this.height * 0.5 + 0.3),
                  room.map.getTileAt(this.x - this.width * 0.5 + 0.3, this.y + this.height * 0.5 - 0.3),
                  room.map.getTileAt(this.x + this.width * 0.5 - 0.3, this.y + this.height * 0.5 - 0.3)
            ];

            for (var i = 0; i < collisionTiles.length; i++) {
                  var tile = collisionTiles[i];
                  if (tile !== null && tile.hasCollision) {
                        if (x) {
                              if (speed > 0) {
                                    this.x = tile.x * room.map.tilesize - this.width * 0.5;
                              } else if (speed < 0) {
                                    this.x = tile.x * room.map.tilesize + room.map.tilesize + this.width * 0.5;
                              }
                              this.xSpeed = 0;
                        } else {
                              if (speed > 0) {
                                    this.y = tile.y * room.map.tilesize - this.height * 0.5;
                                    this.onGround = true;
                              }
                              else if (speed < 0) {
                                    this.y = tile.y * room.map.tilesize + room.map.tilesize + this.height * 0.5;
                              }
                              this.ySpeed = 0;
                        }
                  }   
            }
};

Entity.ENTITY_TYPES = {
      "player": 0,
};