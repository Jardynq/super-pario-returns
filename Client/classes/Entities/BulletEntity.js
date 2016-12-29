var BulletEntity = function (reader) {
      // Run the the constructor from Entity
      Entity.prototype.constructor.call(this, reader);
      this.hasGravity = false;
      this.width = 10;
      this.height = 10;
      
      this.color = "red";
      if (room.entities[this.shooter].isMain) {
            this.color = "green";
      }

      this.oldPositions = [];

      this.renderX = this.x;
      this.renderY = this.y;
};
BulletEntity.prototype = Object.create(Entity.prototype); // Bullet inherits Entity
BulletEntity.prototype.render = function (ctx, render) {
      if (this.oldPositions.length < 2) {
            return;
      }
      
      if (this.oldPositions.length > 10) {
            this.oldPositions.shift();
      }

      render.resetCtx(ctx);

      ctx.moveTo(this.oldPositions[0].x + render.offsetX, this.oldPositions[0].y + render.offsetY);
      for (i = 1; i < this.oldPositions.length; i++) {
            var oldX = this.oldPositions[i].x;
            var oldY = this.oldPositions[i].y;
            
            ctx.lineWidth = 10;
            ctx.strokeStyle = this.color;
            ctx.lineCap = "round";
            ctx.lineTo(oldX + render.offsetX, oldY + render.offsetY);
            ctx.stroke();

      }
};

BulletEntity.prototype.step = function (timeScale) {
      Entity.prototype.step.call(this, timeScale);

      this.oldPositions.push({x: this.x, y: this.y});
};

BulletEntity.prototype.update = function (reader) {
      Entity.prototype.update.call(this, reader);

      this.shooter = reader.getUint16(16, true);
};

BulletEntity.prototype.collidedWithTile = function () {
      this.oldPositionsX = [];
      this.oldPositionsY = [];
      this.dispose();
};