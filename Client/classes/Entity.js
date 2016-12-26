var Entity = function (x, y, width, height, color) {
      this.x = x;
      this.y = y;

      this.width = width;
      this.height = height;
      this.color = color;

      this.xSpeed = null;
      this.ySpeed = null;

      this.id = null;
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
      this.x = entityData.X;
      this.y = entityData.Y;

      this.width = entityData.Width;
      this.height = entityData.Height;
      this.color = entityData.Hex;

      this.ySpeed = entityData.YSpeed;
      this.xSpeed = entityData.XSpeed;
};

Entity.prototype.step = function (timeScale) {
      this.x += this.xSpeed * timeScale;
      this.y += this.ySpeed * timeScale;
};