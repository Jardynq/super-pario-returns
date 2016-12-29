Tile = (function () {
      var ns = {};

      ns.ColorTile = function ColorTile(color, x, y, hasCollision) {
            this.color = color;
            this.x = x;
            this.y = y;

            this.hasCollision = hasCollision;
      };
      ns.ColorTile.prototype.render = function (ctx, render, tilesize) {
            ctx.beginPath();
            ctx.rect((this.x * tilesize + render.offsetX) * render.zoom, (this.y * tilesize + render.offsetY) * render.zoom, tilesize * render.zoom, tilesize * render.zoom);
            ctx.fillStyle = getRandomColor(200, 200, 0);
            if (this.hasCollision) {
                  ctx.fillStyle = getRandomColor(200, 0, 200);
            }

            ctx.fillStyle = this.color;

            // DEBUG
            ctx.stroke();
            // DEBUG          

            ctx.fill();
      };
      
      return ns;
})();