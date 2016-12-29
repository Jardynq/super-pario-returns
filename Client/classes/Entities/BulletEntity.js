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

      this.oldPositionsX.push(this.renderX);
      this.oldPositionsY.push(this.renderY);      


      for (x = 0; x < this.oldPositionsX.length; x++) {
            ctx.beginPath();
            ctx.rect((this.renderX - this.width * 0.5 + render.offsetX) * render.zoom, (this.renderY - this.height * 0.5 + render.offsetY) * render.zoom, this.width * render.zoom, this.height * render.zoom);
            ctx.fillStyle = this.color;
      
            ctx.fill();
      }
      
};

BulletEntity.prototype.collidedWithTile = function () {
      this.oldPositionsX = [];
      this.oldPositionsY = [];
      this.dispose();
};