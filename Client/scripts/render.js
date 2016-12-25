var Render = (function () {
      var ns = {}; // Namespace

      /**
       * Render Class
       * 
       */
      ns.Render = function (tilesize) {
            this.renderQueue = [];
            this.offsetX = 0;
            this.offsetY = 0;
            this.zoom = 2;
            this.tilesize = tilesize;
      }

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
            for (i = 0; i < this.tileMap.tiles.length; i++) {
                  var tile = this.tileMap.tiles[i];
                  
                  tile.render(ctx, render);
            }
      };




      return ns;
})();