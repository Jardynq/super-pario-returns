var Entity = function (reader) {
      this.width = null;
      this.height = null;

      this.update(reader);
};
Entity.prototype = Object.create(Render.RenderObject.prototype); // Entity inherits RenderObject
Entity.prototype.constructor = Entity;
Entity.prototype.render = function (ctx, render) {
      ctx.beginPath();
      ctx.rect((this.x + render.offsetX) * render.zoom, (this.y + render.offsetY) * render.zoom, this.width * render.zoom, this.height * render.zoom);
      ctx.fillStyle = this.color;

      ctx.stroke();      
      ctx.fill();
};

Entity.prototype.update = function (reader) {
      this.x = reader.getInt16(4, true);
      this.y = reader.getInt16(6, true);

      this.xSpeed = reader.getInt16(8, true);
      this.ySpeed = reader.getInt16(10, true);
};

Entity.prototype.step = function (timeScale) {
      this.x += this.xSpeed * timeScale;
      this.y += this.ySpeed * timeScale;
};

Entity.ENTITY_TYPES = {
      "player": 0,
};