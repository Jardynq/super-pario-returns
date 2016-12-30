var Render = (function () {
      var ns = {}; // Namespace

      /**
       * Render Class
       * 
       */
      ns.Render = function () {
            this.renderQueue = [];
            this.offsetX = 0;
            this.offsetY = 0;
            this.zoom = 1;
      };

      /**
       * Renders all objects on screen
       * 
       */
      ns.Render.prototype.renderAll = function renderAll (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < this.renderQueue.length; i++) {
                  var renderObject = this.renderQueue[i];

                  renderObject.render(ctx, this);
            }
      };
      ns.Render.prototype.getRandomColor = function  (redOffset, greenOffset, blueOffset) {
            if (redOffset === undefined) {
                  redOffset = 1;
            }
            if (greenOffset === undefined) {
                  greenOffset = 1;
            }
            if (blueOffset === undefined) {
                  blueOffset = 1;
            }

            var red = Math.floor(Math.random() * 2 * redOffset);
            var green = Math.floor(Math.random() * 2 * greenOffset);
            var blue = Math.floor(Math.random() * 2 * blueOffset);

            return "rgb(" + red +"," + green + "," + blue + ")";
      };




      /**
       * An object that can be rendered
       * Mostly used for inheriting
       * 
       */
      ns.RenderObject = function RenderObject () {
            this.renderIndex = 0;
      };
      ns.RenderObject.prototype.render = function (ctx) {};
      ns.RenderObject.prototype.addToRenderQueue = function (queue) {
            this.renderIndex = queue.length;
            queue.push(this);
      };
      ns.RenderObject.prototype.removeFromRenderQueue = function (queue) {
            queue.splice(this.renderIndex, 1);
            for (var i = this.renderIndex; i < queue.length; i++ ) {
                  var renderObject = queue[i];
                  
                  renderObject.renderIndex--;
            }
      };

      

      /**
       * Special renderer for tiles
       * 
       */
      ns.TileRenderer = function TileRenderer(tileMap) {
            this.tileMap = tileMap;
      };
      ns.TileRenderer.prototype = Object.create(ns.RenderObject.prototype); // TileRenderer inherits RenderObject
      ns.TileRenderer.prototype.render = function (ctx, render) {
            
            var startTile = this.tileMap.getTile(0 - (render.offsetX / this.tileMap.tilesize), 0 - (render.offsetY / this.tileMap.tilesize));

            var endTile = this.tileMap.getTile(canvas.width / (this.tileMap.tilesize * render.zoom) - (render.offsetX / this.tileMap.tilesize), canvas.height / (this.tileMap.tilesize * render.zoom) - (render.offsetY / this.tileMap.tilesize));

            // Makes sure that if the endtile is bigger than the bottom of the map set it to the bottom of the map
            if (endTile === null) {
                  endTile = this.tileMap.getTile(this.tileMap.width - 1, this.tileMap.height - 1);
            }

            // Makes sure that if the starttile is smaller than the top of the map then set it to the top of the map
            if (startTile === null) {
                  startTile = this.tileMap.getTile(0, 0);
            }

            ctx.beginPath();

            ctx.font = 20 * render.zoom + "px Oswald";
            ctx.fillText(startTile.x, 250, 250);
            ctx.fillText(startTile.x, 250, 250);

            // Renders all of the tile that are in between endtile and startTile, aka on render on screen
            for (var i = startTile.y; i <= endTile.y; i++) {
                  for (var g = startTile.x; g <= endTile.x; g++) {
                        var tile = this.tileMap.getTile(g, i);
                        if (tile === null) {
                              continue;
                        }

                        tile.render(ctx, render, this.tileMap.tilesize);   
                  }
            }
      };




      /**
       * Special renderer for tiles
       * 
       */
      ns.EntityRenderer = function EntityRenderer(room) {
            this.room = room;
      };
      ns.EntityRenderer.prototype = Object.create(ns.RenderObject.prototype); // EntityRenderer inherits RenderObject
      ns.EntityRenderer.prototype.render = function (ctx, render) {
            for (var id in this.room.entities) {
                  this.room.entities[id].render(ctx, render);
            }
      };

      return ns;
})();