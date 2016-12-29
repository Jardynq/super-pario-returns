Tile = (function () {
      var ns = {};

      ns.ColorTile = function ColorTile(color, x, y, hasCollision) {
            this.color = color;
            this.x = x;
            this.y = y;

            this.hasCollision = hasCollision;
      };
      ns.ColorTile.prototype.render = function (ctx, render, tilesize) {
            render.resetCtx(ctx);

            ctx.rect((this.x * tilesize + render.offsetX) * render.zoom, (this.y * tilesize + render.offsetY) * render.zoom, tilesize * render.zoom, tilesize * render.zoom);
      

            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.color;

            ctx.stroke();

            ctx.fill();
      };
      
      return ns;
})();