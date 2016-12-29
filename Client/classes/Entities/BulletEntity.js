var BulletEntity = function (reader) {
      // Run the the constructor from Entity
      Entity.prototype.constructor.call(this, reader);
      this.hasGravity = true;
      this.width = 10;
      this.height = 10;
      
      this.color = getRandomColor();

      this.oldPositionsX = [];
      this.oldPositionsY = [];

      this.renderX = this.x;
      this.renderY = this.y;
};
BulletEntity.prototype = Object.create(Entity.prototype); // Bullet inherits Entity
BulletEntity.prototype.render = function (ctx, render) {
      ctx.beginPath();

      for (x = 0; x < this.oldPositionsX.length; x++) {
            var oldX = this.oldPositionsX[x];
            var oldY = this.oldPositionsY[x];
            
            ctx.moveTo(oldX, oldY);
            ctx.lineTo(this.x, this.y);
            ctx.stroke();

      }

      //ctx.beginPath();
      //ctx.rect((this.x - this.width * 0.5 + render.offsetX) * render.zoom, (this.y - this.height * 0.5 + render.offsetY) * render.zoom, this.width * render.zoom, this.height * render.zoom);
      //ctx.fillStyle = this.color;

      //ctx.fill();
};

BulletEntity.prototype.step = function () {
      Entity.prototype.step.call(this);

      this.oldPositionsX.push(this.renderX);
      this.oldPositionsY.push(this.renderY);

      if (this.oldPositionsX.length + this.oldPositionsY.length > 5) 
};

BulletEntity.prototype.collidedWithTile = function () {
      this.oldPositionsX = [];
      this.oldPositionsY = [];
      this.dispose();
};