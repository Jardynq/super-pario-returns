Tile = (function () {
      var ns = {};

      ns.ColorTile = function ColorTile(color, x, y, hasCollision, id) {
            this.color = color;
            this.x = x;
            this.y = y;
            this.id = id;
            this.hasCollision = hasCollision;
      };
      ns.ColorTile.prototype.render = function (ctx, render, tilesize) {
            ctx.beginPath();
            ctx.rect((this.x * tilesize + render.offsetX) * render.zoom, (this.y * tilesize + render.offsetY) * render.zoom, tilesize * render.zoom, tilesize * render.zoom);
            ctx.fillStyle = this.color;

            ctx.stroke();
            ctx.fill();
      };
      


      

      ns.Hud = function (width, height) {
            this.width = width;
            this.height = height;
      };
      ns.Hud.prototype = Object.create(Render.RenderObject.prototype); // TileRenderer inherits RenderObject
      ns.Hud.prototype.render = function (ctx, render) {
            ctx.beginPath();

            ctx.textAlign = "center";

            if (room.isHudActive) {
                  // Active tile preview
                  ctx.rect(canvas.width - this.width - 50, 75, this.width, this.height);
                  ctx.fillStyle = room.activeTile.color;
                  ctx.fill();
                  ctx.stroke();

                  // Active tile information
                  ctx.fillStyle = "orange";
                  ctx.font = "25px Oswald";
                  ctx.fillText(room.activeTileId, canvas.width - this.width * 0.5 - 50, 40);
                  ctx.strokeText(room.activeTileId, canvas.width - this.width * 0.5 - 50, 40);
                  ctx.fillText(tileTypes[room.activeTileId].description, canvas.width - this.width * 0.5 - 50, 65);
                  ctx.strokeText(tileTypes[room.activeTileId].description, canvas.width - this.width * 0.5 - 50, 65);
            }
            if (room.isDebugMenuActive) {
                  // Tile hover information
                  ctx.fillStyle = "orange";
                  ctx.font = 20 * room.render.zoom + "px Oswald";
                  var tile = room.map.getTile((room.mouseX - room.render.offsetX * room.render.zoom) / (room.map.tilesize * room.render.zoom), (room.mouseY - room.render.offsetY * room.render.zoom) / (room.map.tilesize * room.render.zoom));
                  if (tile !== null) {
                        ctx.fillText(tile.x, (tile.x * (room.map.tilesize * room.render.zoom)) + (room.render.offsetX * render.zoom) + (room.map.tilesize * room.render.zoom) * 0.5, (tile.y * (room.map.tilesize * room.render.zoom)) + (room.render.offsetY * render.zoom) + (room.map.tilesize * room.render.zoom) * 0.4);
                        ctx.fillText(tile.y, (tile.x * (room.map.tilesize * room.render.zoom)) + (room.render.offsetX * render.zoom) + (room.map.tilesize * room.render.zoom) * 0.5, (tile.y * (room.map.tilesize * room.render.zoom)) + (room.render.offsetY * render.zoom) + (room.map.tilesize * room.render.zoom) * 0.9);      
                  }

                  // Fps
                  ctx.fillStyle = "orange";                  
                  ctx.font = "35px Oswald";
                  ctx.fillText(fps, 40, 50);
                  ctx.strokeText(fps, 40, 50);
            }
      };
      return ns;
})();