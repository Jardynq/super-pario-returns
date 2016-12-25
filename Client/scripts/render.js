var Render = (function () {
      var ns = {}; // Namespace

      ns.renderQueue = [];
      ns.offsetX = 0;
      ns.offsetY = 0;
      ns.zoom = 2;




      /**
       * Renders all objects on screen
       * 
       */
      ns.renderAll = function renderAll (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < ns.renderQueue.length; i++) {
                  var renderObject = ns.renderQueue[i];

                  renderObject.render(ctx);
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
      ns.RenderObject.prototype.addToRenderQueue = function () {
            var queue = ns.renderQueue;

            this.renderIndex = queue.length;
            queue.push(this);
      };
      ns.RenderObject.prototype.removeFromRenderQueue = function (gameRoom) {
            var queue = ns.renderQueue;

            queue.splice(this.renderIndex, 1);
            for (var i = this.renderIndex; i < queue.length; i++ ) {
                  var renderObject = queue[i];
                  
                  renderObject.renderIndex--;
            }
      };




      ns.TileRenderer = function TileRenderer(tileMap) {
            this.tileMap = tileMap;
      };
      ns.TileRenderer.prototype = Object.create(ns.RenderObject.prototype); // TileRenderer inherits RenderObject
      ns.TileRenderer.prototype.render = function (ctx) {
            for (i = 0; i < this.tileMap.tiles.length; i++) {
                  var tile = this.tileMap.tiles[i];

                  tile.render(this.tileMap.tileSize, ctx);
            }
      };




      return ns;
})();