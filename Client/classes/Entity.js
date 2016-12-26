var Entity = function (x, y, width, height, color) {
      this.x = x;
      this.y = y;

      this.width = width;
      this.height = height;
      this.color = color;

      this.xSpeed = null;
      this.ySpeed = null;

      this.index = null;
};
Entity.prototype = Object.create(Render.RenderObject.prototype); // Entity inherits RenderObject
Entity.prototype.render = function (ctx, render) {
      ctx.beginPath();
      ctx.rect((this.x + render.offsetX) * render.zoom, (this.y + render.offsetY) * render.zoom, this.width * render.zoom, this.height * render.zoom);
      ctx.fillStyle = this.color;

      ctx.stroke();      
      ctx.fill();
};