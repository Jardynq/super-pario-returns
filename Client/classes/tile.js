Tile = (function () {
      var ns = {};

      ns.ColorTile = function ColorTile(x, y, hasCollision, type) {
            this.x = x;
            this.y = y;

            this.type = type;

            this.color = this.setColor();

            this.hasCollision = hasCollision;
      };
      ns.ColorTile.prototype.render = function (ctx, render, tilesize) {
            ctx.beginPath();

            ctx.rect((this.x * tilesize + render.offsetX) * render.zoom, (this.y * tilesize + render.offsetY) * render.zoom, tilesize * render.zoom + 1, tilesize * render.zoom + 1);
      
            ctx.fillStyle = this.color;

            ctx.fill();
      };
      ns.ColorTile.prototype.setColor = function () {
            var chooser = Math.random() * 10;

            if (this.type === "0") {
                  if (chooser >= 0 && chooser < 9) {
                        return "#4876FF";
                  }
                  if (chooser >= 9 && chooser < 9.9) {
                        return "#436EEE";
                  }
                  if (chooser >= 9.9 && chooser <= 10) {
                        return "#4997D0";
                  }
            }
            if (this.type === "1") {
                  if (chooser >= 0 && chooser < 7) {
                        return "#5E2612";
                  }
                  if (chooser >= 7 && chooser < 9) {
                        return "#4D1D0C";
                  }
                  if (chooser >= 9 && chooser <= 10) {
                        return "#401708";
                  }
            }
            if (this.type === "2") {
                  if (chooser >= 0 && chooser < 7) {
                        return "#458B00";
                  }
                  if (chooser >= 7 && chooser < 9) {
                        return "#549117";
                  }
                  if (chooser >= 9 && chooser <= 10) {
                        return "#3E6B11";
                  }
            }
      };


      return ns;
})();