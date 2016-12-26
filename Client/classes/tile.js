Tile = (function () {
      var ns = {};

      ns.ColorTile = function ColorTile(color, x, y, collision) {
            this.color = color;
            this.x = x;
            this.y = y;

            this.collision = collision;
      };
      ns.ColorTile.prototype.render = function (ctx, render, tilesize) {
            ctx.beginPath();
            ctx.rect((this.x * tilesize + render.offsetX) * render.zoom, (this.y * tilesize + render.offsetY) * render.zoom, tilesize * render.zoom, tilesize * render.zoom);
            ctx.fillStyle = this.color;

            // DEBUG
            ctx.stroke();
            // DEBUG          

            ctx.fill();
      };
      
      return ns;
})();