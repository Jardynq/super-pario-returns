Tile = (function () {
      var ns = {};

      ns.ColorTile = function ColorTile(color, x, y, collision) {
            this.color = color;
            this.x = x;
            this.y = y;

            this.collision = collision;
      };
      ns.ColorTile.prototype.render = function (tilesize, ctx) {
            ctx.beginPath();
            ctx.rect((this.x * tilesize + Render.offsetX) * Render.zoom, (this.y * tilesize + Render.offsetY) * Render.zoom, tilesize * Render.zoom, tilesize * Render.zoom);
            ctx.fillStyle = this.color;

            // DEBUG
            ctx.stroke();
            // Debug Purposes            

            ctx.fill();
      };
      
      return ns;
})();