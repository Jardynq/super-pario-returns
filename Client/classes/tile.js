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
                  if (chooser >= 0 && chooser < 8.5) {
                        return "#527DFF";
                  }
                  if (chooser >= 8.5 && chooser < 9) {
                        return "#4D76F0";
                  }
                  if (chooser >= 9 && chooser <= 10) {
                        return "#4D79FF";
                  }
            }
            if (this.type === "1") {
                  if (chooser >= 0 && chooser < 7) {
                        return "#632712";
                  }
                  if (chooser >= 7 && chooser < 9) {
                        return "#59200C";
                  }
                  if (chooser >= 9 && chooser <= 10) {
                        return "#4D1A08";
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
            if (this.type === "3") {
                  if (chooser >= 0 && chooser < 7) {
                        return "#1C0D07";
                  }
                  if (chooser >= 7 && chooser < 9) {
                        return "#1A0904";
                  }
                  if (chooser >= 9 && chooser <= 10) {
                        return "#140803";
                  }
            }
            if (this.type === "4") {
                  if (chooser >= 0 && chooser < 7) {
                        return "#1C3603";
                  }
                  if (chooser >= 7 && chooser < 9) {
                        return "#213808";
                  }
                  if (chooser >= 9 && chooser <= 10) {
                        return "#152406";
                  }
            }
      };


      return ns;
})();