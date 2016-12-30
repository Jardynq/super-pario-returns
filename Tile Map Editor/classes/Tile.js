Tile = (function () {
      var ns = {};

      ns.ColorTile = function ColorTile(color, x, y, id) {
            this.color = color;
            this.x = x;
            this.y = y;
            this.id = id;
      };
      ns.ColorTile.prototype.render = function (ctx, render, tilesize) {
            ctx.beginPath();
            ctx.rect((this.x * tilesize + render.offsetX) * render.zoom, (this.y * tilesize + render.offsetY) * render.zoom, tilesize * render.zoom, tilesize * render.zoom);
            ctx.fillStyle = this.color;

            ctx.stroke();
            ctx.fill();
      };
      


      

      ns.ActiveTilePreview = function (width, height) {
            this.width = width;
            this.height = height;
      };
      ns.ActiveTilePreview.prototype = Object.create(Render.RenderObject.prototype); // TileRenderer inherits RenderObject
      ns.ActiveTilePreview.prototype.render = function (ctx, render) {
            ctx.beginPath();
            ctx.rect(canvas.width - this.width - 50, 50, this.width, this.height);
            ctx.fillStyle = room.activeTile.color;

            ctx.fill();
            ctx.stroke();

            ctx.textAlign = "center";
            ctx.font = "30px Oswald";
            ctx.fillStyle = "orange";            
            ctx.fillText(room.activeTileId, canvas.width - this.width * 0.5 - 50, 180, this.width, this.height);
            ctx.strokeText(room.activeTileId, canvas.width - this.width * 0.5 - 50, 180, this.width, this.height);
      };
      return ns;
})();