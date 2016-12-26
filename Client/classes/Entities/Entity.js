var Entity = function () {

};
Entity.prototype = Object.create(Render.RenderObject.prototype); // Entity inherits RenderObject
Entity.prototype.render = function (ctx, render) {
      ctx.beginPath();
      ctx.rect((this.x + render.offsetX) * render.zoom, (this.y + render.offsetY) * render.zoom, this.width * render.zoom, this.height * render.zoom);
      ctx.fillStyle = this.color;

      ctx.stroke();      
      ctx.fill();
};

Entity.prototype.update = function (entityData) {
      this.x = Number(entityData.X);
      this.y = Number(entityData.Y);

      this.width = Number(entityData.Width);
      this.height = Number(entityData.Height);

      this.ySpeed = Number(entityData.YSpeed);
      this.xSpeed = Number(entityData.XSpeed);
};

Entity.prototype.step = function (timeScale) {
      this.x += this.xSpeed * timeScale;
      this.y += this.ySpeed * timeScale;
};