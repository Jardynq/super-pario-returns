var PlayerEntity = function (reader) {
      // Run the the constructor from Entity
      Entity.prototype.constructor.call(this, reader);

      this.color = "red";
      this.isMain = false;

      this.renderX = this.x;
      this.renderY = this.y;

      this.width = 30;
      this.height = 60;

      this.hasGravity = true;

      this.onGround = false;
      this.isCollisionLeft = false;
      this.isCollisionRight = false;

      this.lastShot = 0;
};
PlayerEntity.prototype = Object.create(Entity.prototype); // PlayerEntity inherits Entity
PlayerEntity.prototype.render = function (ctx, render) {
      Entity.prototype.render.call(this, ctx, render);    
        
      ctx.beginPath();

      ctx.fillStyle = this.color;
      ctx.strokeStyle = "black";
      ctx.textAlign = "center";
      ctx.lineWidth = 1;
      ctx.font = 20 * render.zoom + "px Oswald";

      // Debugging info
      if (room.isDebugMenuActive) {
            // X and Y position
            ctx.strokeText("X: " + Math.round(this.x), (this.renderX + render.offsetX) * render.zoom, (this.renderY + render.offsetY - this.height * 0.5 - 30) * render.zoom);
            ctx.fillText("X: " + Math.round(this.x), (this.renderX + render.offsetX) * render.zoom, (this.renderY + render.offsetY - this.height * 0.5 - 30) * render.zoom);
            ctx.strokeText("Y: " + Math.round(this.y), (this.renderX + render.offsetX) * render.zoom, (this.renderY + render.offsetY - this.height * 0.5 - 5) * render.zoom);
            ctx.fillText("Y: " + Math.round(this.y), (this.renderX + render.offsetX) * render.zoom, (this.renderY + render.offsetY - this.height * 0.5 - 5) * render.zoom);
            
            // Ping
            ctx.fillStyle = "black";
            ctx.fillText(this.ping, (this.renderX + render.offsetX) * render.zoom, (this.renderY + render.offsetY) * render.zoom);
      }

      // Hud and Debugging information
      if (this.isMain && room.isDebugMenuActive) {
            ctx.font = "35px Oswald";
            ctx.strokeStyle = "black";
            ctx.fillStyle = this.color;

            // Fps Counter
            ctx.fillText(fps, 40, 50);
            ctx.strokeText(fps, 40 ,50);
            
            // Render information
            // Top-Left and Bottom-Right corners of the screen
            var startTile = room.map.getTile(0 - (room.render.offsetX / room.map.tilesize), 0 - (room.render.offsetY / room.map.tilesize));
            var endTile = room.map.getTile(canvas.width / (room.map.tilesize * room.render.zoom) - (room.render.offsetX / room.map.tilesize), canvas.height / (room.map.tilesize * room.render.zoom) - (room.render.offsetY / room.map.tilesize));

            // Makes sure that if the endtile is bigger than the bottom of the map set it to the bottom of the map
            if (endTile === null) {
                  endTile = room.map.getTile(room.map.width - 1, room.map.height - 1);
            }

            // Makes sure that if the starttile is smaller than the top of the map then set it to the top of the map
            if (startTile === null) {
                  startTile = room.map.getTile(0, 0);
            }

            ctx.fillText("X: " + startTile.x, 60, 110);
            ctx.strokeText("X: " + startTile.x, 60, 110);
            ctx.fillText(endTile.x, 150, 110);
            ctx.strokeText(endTile.x, 150, 110);

            ctx.fillText("Y: " + startTile.y, 60, 160);
            ctx.strokeText("Y: " + startTile.y, 60, 160);
            ctx.fillText(endTile.y, 150, 160);
            ctx.strokeText(endTile.y, 150, 160);

            // Tile hover information
            ctx.fillStyle = "orange";
            ctx.font = 20 * room.render.zoom + "px Oswald";
            var tile = room.map.getTile((room.mouseX - room.render.offsetX * room.render.zoom) / (room.map.tilesize * room.render.zoom), (room.mouseY - room.render.offsetY * room.render.zoom) / (room.map.tilesize * room.render.zoom));
            if (tile !== null) {
                  ctx.fillText(tile.x, (tile.x * (room.map.tilesize * room.render.zoom)) + (room.render.offsetX * render.zoom) + (room.map.tilesize * room.render.zoom) * 0.5, (tile.y * (room.map.tilesize * room.render.zoom)) + (room.render.offsetY * render.zoom) + (room.map.tilesize * room.render.zoom) * 0.4);
                  ctx.fillText(tile.y, (tile.x * (room.map.tilesize * room.render.zoom)) + (room.render.offsetX * render.zoom) + (room.map.tilesize * room.render.zoom) * 0.5, (tile.y * (room.map.tilesize * room.render.zoom)) + (room.render.offsetY * render.zoom) + (room.map.tilesize * room.render.zoom) * 0.9);      
            }
      }
};

PlayerEntity.prototype.step = function (timescale) {
      Entity.prototype.step.call(this, timescale);

      if (this.isMain) {
            this.updateMovement();

            // Shooting
            if (Input.isMouseDown) {
                  this.shoot();
            }

      }
};

// Movement
PlayerEntity.prototype.updateMovement = function () {
      // Left - right movement
      if (!this.isCollisionLeft &&Input.isKeyDown("KeyA")) {
            if (this.xSpeed >= 0) {
                  this.xSpeed = -this.walkSpeed;
                  this.sendActionPacket("KeyA");
            }   
      } else if (!this.isCollisionRight && Input.isKeyDown("KeyD")) {
            if (this.xSpeed <= 0) {
                  this.xSpeed = this.walkSpeed;
                  this.sendActionPacket("KeyD");   
            }
      } else if (this.xSpeed < 0 || this.xSpeed > 0){
            this.xSpeed = 0;
            this.sendActionPacket(null);
      }

      // Jumping
      if (this.onGround && Input.isKeyDown("KeyW") || this.onGround && Input.isKeyDown("Space")) {
            if (this.ySpeed >= 0) {
                  this.ySpeed = -this.jumpForce;
                  this.sendActionPacket("KeyW");
            }
      }
};
PlayerEntity.prototype.shoot = function () {
      if (new Date().getTime() > this.lastShot + 200) {
            var dirX = Input.mouseX / room.render.zoom - (this.x + room.render.offsetX);
            var dirY = Input.mouseY / room.render.zoom - (this.y + room.render.offsetY);

            var angle = Math.atan2(dirY, dirX);

            var shootPacket = new DataView(new ArrayBuffer(5));
            shootPacket.setUint8(0, Socket.PACKET_TYPES.playerShoot);
            shootPacket.setFloat32(1, angle, true);
            Socket.sendPacket(shootPacket);
            this.lastShot = new Date().getTime();
      }
};

PlayerEntity.prototype.sendActionPacket = function (key) {
      var actionPacket = new DataView(new ArrayBuffer(5)); 
      actionPacket.setUint8(0, Socket.PACKET_TYPES.playerAction); 

      if (key === "KeyW") {
            actionPacket.setUint8(1, PlayerEntity.ACTION_TYPES.jump);   
            Socket.sendPacket(actionPacket);            
      }

      if (key === "KeyA" && this.xSpeed < 0) {
            actionPacket.setUint8(1, PlayerEntity.ACTION_TYPES.moveLeft);   
            Socket.sendPacket(actionPacket);       
      } else if (key === "KeyD" && this.xSpeed > 0) {
            actionPacket.setUint8(1, PlayerEntity.ACTION_TYPES.moveRight);
            Socket.sendPacket(actionPacket);                      
      }
      if (key === null && this.xSpeed === 0) {
            actionPacket.setUint8(1, PlayerEntity.ACTION_TYPES.stopMove); 
            Socket.sendPacket(actionPacket);             
      }
};

PlayerEntity.prototype.update  = function (reader, updatePosition) {
      if (updatePosition === undefined) updatePosition = false;

      var oldX = this.x;
      var oldY = this.y;
      var oldXSpeed = this.xSpeed;
      var oldYSpeed = this.ySpeed;

      Entity.prototype.update.call(this, reader);      

      this.ping = reader.getUint16(16, true);

      if (this.isMain) {
            if (!updatePosition) {
                  this.x = oldX;
                  this.y = oldY;
                  this.xSpeed = oldXSpeed;
                  this.ySpeed = oldYSpeed;

                  var updatePacket = new DataView(new ArrayBuffer(5));
                  updatePacket.setUint8(0, Socket.PACKET_TYPES.playerUpdate);             
                  updatePacket.setInt16(1, this.x, true); 
                  updatePacket.setInt16(3, this.y, true);   
                  Socket.sendPacket(updatePacket);
            }
      }
};
PlayerEntity.prototype.setMain  = function () {
      this.color = "orange";
      this.isMain = true;
};

PlayerEntity.prototype.onMouseDown = function (e) {
      this.shoot(e);
};


PlayerEntity.ACTION_TYPES = {
      "moveLeft": 0,
      "moveRight": 1,
      "stopMove": 2,
      "jump": 3,
};