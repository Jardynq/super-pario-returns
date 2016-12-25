Tile = (function () {
      var ns = {};

      ns.ColorTile = function ColorTile(color, x, y, collision) {
            this.color = color;
            this.x = x;
            this.y = y;

            this.collision = collision;
      };
      ns.ColorTile.prototype.render = function (ctx, render) {
            ctx.beginPath();
            ctx.rect((this.x * render.tilesize + render.offsetX) * render.zoom, (this.y * render.tilesize + render.offsetY) * render.zoom, render.tilesize * render.zoom, render.tilesize * render.zoom);
            ctx.fillStyle = this.color;

            // DEBUG
            ctx.stroke();
            // Debug Purposes            

            ctx.fill();
      };
      
      return ns;
})();