var Entity = function (reader) {
      this.width = null;
      this.height = null;

      this.onGround = false;

      this.renderX = 0;
      this.renderY = 0;

      this.xSpeed = 0;
      this.ySpeed = 0;
      this.x = 0;
      this.y = 0;

      this.update(reader);
};
Entity.prototype = Object.create(Render.RenderObject.prototype); // Entity inherits RenderObject
Entity.prototype.constructor = Entity;
Entity.prototype.render = function (ctx, render) {
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black";
      
      ctx.rect((this.renderX - this.width * 0.5 + render.offsetX) * render.zoom, (this.renderY - this.height * 0.5 + render.offsetY) * render.zoom, this.width * render.zoom, this.height * render.zoom);
      ctx.fillStyle = this.color;

      ctx.strokeStyle = "black";
     
      ctx.fill();
      ctx.stroke(); 
};

Entity.prototype.update = function (reader) {
      this.x = reader.getInt16(4, true);
      this.y = reader.getInt16(6, true);

      this.xSpeed = reader.getFloat32(8, true);
      this.ySpeed = reader.getFloat32(12, true);
};
Entity.prototype.dispose = function () {
      room.removeFromEntities(this.id);
};

Entity.prototype.step = function (timeScale) {
      if (this.hasGravity) {
            this.ySpeed = Math.min(this.ySpeed + Entity.gravity * timeScale, Entity.maxFallSpeed);
      }

      this.onGround = false;
      this.isCollisionLeft = false;
      this.isCollisionRight = false;

      this.x += this.xSpeed * timeScale;
      this.handleCollision(true);
      this.y += this.ySpeed * timeScale;
      this.handleCollision(false);

      // Easing
      this.renderX += ((this.x - this.renderX) * 0.9);
      this.renderY += ((this.y - this.renderY) * 0.9);
};

Entity.prototype.handleCollision = function (x) {
      speed = x ? this.xSpeed : this.ySpeed;

      var collisionTiles = [
            room.map.getTile((this.x - this.width * 0.5 + 0.3) / room.map.tilesize, (this.y - this.height * 0.5 + 0.3) / room.map.tilesize),
            room.map.getTile((this.x + this.width * 0.5 - 0.3) / room.map.tilesize, (this.y - this.height * 0.5 + 0.3) / room.map.tilesize),
            room.map.getTile((this.x - this.width * 0.5 + 0.3) / room.map.tilesize, (this.y + this.height * 0.5 - 0.3) / room.map.tilesize),
            room.map.getTile((this.x + this.width * 0.5 - 0.3) / room.map.tilesize, (this.y + this.height * 0.5 - 0.3) / room.map.tilesize),
            room.map.getTile((this.x - this.width * 0.5 + 0.3) / room.map.tilesize, (this.y) / room.map.tilesize),
            room.map.getTile((this.x + this.width * 0.5 - 0.3) / room.map.tilesize, (this.y) / room.map.tilesize)
      ];

      for (var i = 0; i < collisionTiles.length; i++) {
            var tile = collisionTiles[i];
            if (tile === null) {
                  continue;
            }

            if (tile !== null && tile.hasCollision) {
                  if (x) {
                        if (speed > 0) {
                              this.x = tile.x * room.map.tilesize - this.width * 0.5;
                              this.isCollisionRight = true;
                        } else if (speed < 0) {
                              this.x = tile.x * room.map.tilesize + room.map.tilesize + this.width * 0.5;
                              this.isCollisionLeft = true;
                        }
                        this.xSpeed = 0;
                        this.collidedWithTile();
                  } else {
                        if (speed > 0) {
                              this.y = tile.y * room.map.tilesize - this.height * 0.5;
                              this.onGround = true;
                        }
                        else if (speed < 0) {
                              this.y = tile.y * room.map.tilesize + room.map.tilesize + this.height * 0.5;
                        }
                        this.ySpeed = 0;
                        this.collidedWithTile();                        
                  }
            }   
      }
};

Entity.prototype.collidedWithTile = function () {

};

Entity.ENTITY_TYPES = {
      "player": 0,
      "bullet": 1,
};