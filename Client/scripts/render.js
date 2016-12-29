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
      ns.Render.prototype.getRandomColor = function  (redOffset, greenOffset, blueOffset, allowOverUnderFlow) {
            if (redOffset === undefined) {
                  redOffset = 0;
            }
            if (greenOffset === undefined) {
                  greenOffset = 0;
            }
            if (blueOffset === undefined) {
                  blueOffset = 0;
            }
            if (allowOverUnderFlow === undefined) {
                  allowOverUnderFlow = false;
            }

            var red = Math.floor(Math.random() * 255);
            var green = Math.floor(Math.random() * 255);
            var blue = Math.floor(Math.random() * 255);

            red -= redOffset;
            green -= greenOffset;
            blue -= blueOffset;

            if (allowOverUnderFlow) {
                  if (red > 255 ) {
                        red = 255;
                  }
                  if (red < 0 ) {
                        red = 0;
                  }
                  if (green > 255 ) {
                        green = 255;
                  }
                  if (green < 0 ) {
                        green = 0;
                  }
                  if (blue > 255 ) {
                        blue = 255;
                  }
                  if (blue < 0 ) {
                        blue = 0;
                  }
            }

            return "rgb(" + red +"," + green + "," + blue + ")";
      };
      ns.Render.prototype.resetCtx = function (ctx) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = null;
            ctx.fillStyle = null;
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