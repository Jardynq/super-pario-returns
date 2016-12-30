var BulletEntity = function (reader) {
      // Run the the constructor from Entity
      Entity.prototype.constructor.call(this, reader);
      this.hasGravity = false;
      this.width = 10;
      this.height = 10;
      
      this.color = "#e74c3c";
      if (room.entities[this.shooter].isMain) {
            this.color = "#2ecc71";
      }

      this.oldPositions = [];
      this.isDisposed = false;

      this.renderX = this.x;
      this.renderY = this.y;
};
BulletEntity.prototype = Object.create(Entity.prototype); // Bullet inherits Entity
BulletEntity.prototype.render = function (ctx, render) {
      if (this.oldPositions.length > 10 || this.isDisposed) {
            this.oldPositions.shift();
            if (this.oldPositions.length === 0) {
                  this.dispose();
                  return;
            }
      } else if (this.oldPositions.length < 2) {
            return;
      }



      ctx.beginPath();

      ctx.moveTo((this.oldPositions[0].x + render.offsetX) * render.zoom, (this.oldPositions[0].y + render.offsetY) * render.zoom);
      for (i = 1; i < this.oldPositions.length; i++) {
            var oldX = this.oldPositions[i].x;
            var oldY = this.oldPositions[i].y;
            
            ctx.lineWidth = 10 * render.zoom;
            ctx.strokeStyle = this.color;
            ctx.lineCap = "round";
            ctx.lineTo((oldX + render.offsetX) * render.zoom, (oldY + render.offsetY) * render.zoom);
            ctx.stroke();

      }
};

BulletEntity.prototype.step = function (timeScale) {
        if (this.isDisposed === false) {
            Entity.prototype.step.call(this, timeScale);

            this.oldPositions.push({ x: this.x , y: this.y});
        }

        if (this.x < 0 || this.x > room.map.width * room.map.tilesize ||
            this.y < 0 || this.y > room.map.height * room.map.tilesize) {
            this.isDisposed = true;
        }
};

BulletEntity.prototype.update = function (reader) {
      Entity.prototype.update.call(this, reader);

      this.shooter = reader.getUint16(16, true);
};

BulletEntity.prototype.collidedWithTile = function () {
      this.isDisposed = true;
};