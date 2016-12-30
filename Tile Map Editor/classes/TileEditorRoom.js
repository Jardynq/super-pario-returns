var TileEditorRoom = function (map) {
      this.render = new Render.Render();
      this.tileRenderer = null;
      this.activeTilePreview = new Tile.ActiveTilePreview(100, 100);

      this.mouseDownTile = null;
      this.mouseUpTile = null;
      this.mouseX = null;
      this.mouseY = null;
      this.isMouseDown = null;

      this.activeTile = null;
      this.activeTileId = 0;

      // Amount of tile types
      this.tileAmount = 5;

      this.map = map;
      this.cameraSpeed = null;

      this.tileRenderer = new Render.TileRenderer(this.map);
      this.tileRenderer.addToRenderQueue(this.render.renderQueue);

      this.activeTilePreview.addToRenderQueue(this.render.renderQueue);

      this.activeTile = new Tile.ColorTile("#4876FF", 0, 0, "0");

      // Fixes camera      
      this.cameraSpeed = this.map.tilesize * 0.25;

      // Add event listeners
      window.addEventListener('keydown', this.onKeyDown.bind(this));
      window.addEventListener("keyup", this.onKeyUp.bind(this));
      window.addEventListener('wheel', this.onMouseWheel.bind(this));
      window.addEventListener('mousemove', this.onMouseMove.bind(this));
      window.addEventListener("mousedown", this.onMouseDown.bind(this));
      window.addEventListener("mouseup", this.onMouseUp.bind(this));
};
// Main step function
TileEditorRoom.prototype.step = function (timeScale) {
      this.updateScreenOffset();
};

TileEditorRoom.prototype.formatAndSave = function () {
      var tiles = "";

      for (y = 0; y < this.map.height; y++) {
            var row = "";
            for (x = 0; x < this.map.width; x++) {
                  var tile = this.map.getTile(x, y);
                  row += "," + tile.id;
            }
            row = row.substr(1, row.length);
            tiles += row;
            tiles += "\r\n";
      }
      tiles.substr(0, tiles.length - 2);

      download("map.txt", tiles);
};

TileEditorRoom.prototype.getActiveTile = function (x, y) {
      if (this.activeTileId === 0) {
            this.activeTile = new Tile.ColorTile("#4876FF", x, y, "0");
      }
      if (this.activeTileId === 1) {
            this.activeTile = new Tile.ColorTile("#5E2612", x, y, "1");
      }
      if (this.activeTileId === 2) {
            this.activeTile = new Tile.ColorTile("#458B00", x, y, "2");
      }
      if (this.activeTileId === 3) {
            this.activeTile = new Tile.ColorTile("#261109", x, y, "3");
      }
      if (this.activeTileId === 4) {
            this.activeTile = new Tile.ColorTile("#2C5702", x, y, "4");
      }
};
TileEditorRoom.prototype.updateActiveTile = function () {
      if (Input.isKeyDown("KeyE")) {
            if (this.activeTileId >= this.tileAmount - 1) {
                  this.activeTileId = 0;
            } else {
                  this.activeTileId += 1;
            }
      } else if (Input.isKeyDown("KeyQ")) {
            if (this.activeTileId <= 0) {
                  this.activeTileId = this.tileAmount - 1;
            } else {
                  this.activeTileId -= 1;
            }
      }

      if (this.activeTileId === 0) {
            this.activeTile = new Tile.ColorTile("#4876FF", 0, 0, "0");
      } else if (this.activeTileId === 1) {
            this.activeTile = new Tile.ColorTile("#5E2612", 0, 0, "1");
      } else if (this.activeTileId === 2) {
            this.activeTile = new Tile.ColorTile("#458B00", 0, 0, "2");
      } else if (this.activeTileId === 3) {
            this.activeTile = new Tile.ColorTile("#261109", 0, 0, "3");
      } else if (this.activeTileId === 4) {
            this.activeTile = new Tile.ColorTile("#2C5702", 0, 0, "4");
      }
};

TileEditorRoom.prototype.clickTile = function (e) {
      var clickedTile = this.map.getTile((e.x - this.render.offsetX * this.render.zoom) / (this.map.tilesize * this.render.zoom), (e.y - this.render.offsetY * this.render.zoom) / (this.map.tilesize * this.render.zoom));

      this.getActiveTile(clickedTile.x, clickedTile.y);

      this.map.updateTile(clickedTile, this.activeTile);
};
TileEditorRoom.prototype.fillTiles = function (mouseDown) {
      var startTile = this.map.getTile(this.mouseDownTile.x, this.mouseDownTile.y);
      var endTile = null;

      if (!mouseDown) {
            endTile = this.map.getTile(this.mouseUpTile.x, this.mouseUpTile.y);
      }

      if (endTile !== null) {
            this.fill(startTile, endTile);
      } else {
            return null;
      }
};
TileEditorRoom.prototype.fill = function (startTile, endTile) {
      for (var y = Math.max(startTile.y, endTile.y); y >= Math.min(startTile.y, endTile.y); y--) {
            for (var x = Math.max(startTile.x, endTile.x); x >= Math.min(startTile.x, endTile.x); x--) {
                  var tile = this.map.getTile(x, y);

                  if (tile === null) {
                        continue;
                  }

                  this.getActiveTile(tile.x, tile.y);
                  this.map.updateTile(tile, this.activeTile);
            }   
      }
};

// Rendering functions
TileEditorRoom.prototype.renderAll = function (ctx) {
      this.render.renderAll(ctx);
};
TileEditorRoom.prototype.updateScreenOffset = function () {
      if (Input.isKeyDown("KeyA")) {
            if (Input.isKeyDown("Space")) {
                  this.cameraSpeed = this.map.tilesize * 2.55;
            } else {
                  this.cameraSpeed = this.map.tilesize * 0.255;
            }
            this.render.offsetX += this.cameraSpeed;
      } else if (Input.isKeyDown("KeyD")) {
            if (Input.isKeyDown("Space")) {
                  this.cameraSpeed = this.map.tilesize * 2.55;
            } else {
                  this.cameraSpeed = this.map.tilesize * 0.255;
            }
            this.render.offsetX -= this.cameraSpeed;
      }
      if (Input.isKeyDown("KeyW")) {
            if (Input.isKeyDown("Space")) {
                  this.cameraSpeed = this.map.tilesize * 2.55;
            } else {
                  this.cameraSpeed = this.map.tilesize * 0.255;
            }
            this.render.offsetY += this.cameraSpeed;
      } else if (Input.isKeyDown("KeyS")) {
            if (Input.isKeyDown("Space")) {
                  this.cameraSpeed = this.map.tilesize * 2.55;
            } else {
                  this.cameraSpeed = this.map.tilesize * 0.255;
            }
            this.render.offsetY -= this.cameraSpeed;
      }

      // View space position limits
      if (-this.render.offsetX <= 0) {
            this.render.offsetX = -0;
      } else if (-this.render.offsetX * this.render.zoom >= this.map.width * this.map.tilesize * this.render.zoom - canvas.width) {
            this.render.offsetX = -(this.map.width * this.map.tilesize * this.render.zoom - canvas.width) / this.render.zoom;
      }
      if (-this.render.offsetY <= 0) {
            this.render.offsetY = -0;
      } else if (-this.render.offsetY * this.render.zoom >= this.map.tiles.length / this.map.width * this.map.tilesize * this.render.zoom - canvas.height) {
            this.render.offsetY = -(this.map.tiles.length / this.map.width * (this.map.tilesize * this.render.zoom) - canvas.height) / this.render.zoom;
      }

};

// Inputs
TileEditorRoom.prototype.onKeyDown = function (e) {
      this.updateActiveTile();

      if (Input.isKeyDown("Escape")) {
            this.formatAndSave();
      }
};
TileEditorRoom.prototype.onKeyUp = function (e) {      
      
};
TileEditorRoom.prototype.onMouseWheel = function (e) {
      var zoomAmount = 0.075;
      var maxZoom = 3.5;
      var minZoom = 0.5;

      // Max zoom
      if (this.render.zoom >= maxZoom) {
      this.render.zoom = maxZoom;
      } else if (this.render.zoom <= minZoom) {
      this.render.zoom = minZoom;
      }

      if (e.wheelDelta > 0) {
      this.render.zoom += zoomAmount;
      } else if (e.wheelDelta < 0) {
      this.render.zoom -= zoomAmount;
      }    
      
};
TileEditorRoom.prototype.onMouseMove = function (e) {
      this.mouseX = e.x;
      this.mouseY = e.y;

      if (this.isMouseDown && !e.shiftKey) {
            this.clickTile(e);
      }
};
TileEditorRoom.prototype.onMouseDown = function (e) {
      this.isMouseDown = true;
      this.mouseDownTile = this.map.getTile((e.x - this.render.offsetX * this.render.zoom) / (this.map.tilesize * this.render.zoom), (e.y - this.render.offsetY * this.render.zoom) / (this.map.tilesize * this.render.zoom));

      this.clickTile(e);

      if (e.shiftKey) {
            this.fillTiles(true);
      }
};
TileEditorRoom.prototype.onMouseUp = function (e) {
      this.isMouseDown = false;
      this.mouseUpTile = this.map.getTile((e.x - this.render.offsetX * this.render.zoom) / (this.map.tilesize * this.render.zoom), (e.y - this.render.offsetY * this.render.zoom) / (this.map.tilesize * this.render.zoom));

      if (e.shiftKey) {
            this.fillTiles(false);
      }
};