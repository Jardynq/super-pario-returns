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

      this.lastShot = 0;
};
PlayerEntity.prototype = Object.create(Entity.prototype); // PlayerEntity inherits Entity
PlayerEntity.prototype.render = function (ctx, render) {
      Entity.prototype.render.call(this, ctx, render);    
        
      ctx.beginPath();

      ctx.fillStyle = this.color;
      ctx.font = 15 * render.zoom + "px Oswald";

      ctx.textAlign = "center";

      ctx.fillText(this.ping, (this.renderX + render.offsetX) * render.zoom, (this.renderY + render.offsetY - this.height * 0.5 - 5) * render.zoom);

      ctx.font = 35 * render.zoom + "px Oswald";
      ctx.fillText(fps, 40, 50);
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
      if (Input.isKeyDown("KeyA")) {
            if (this.xSpeed >= 0) {
                  this.xSpeed = -this.walkSpeed;
                  this.sendActionPacket("KeyA");
            }   
      } else if (Input.isKeyDown("KeyD")) {
            if (this.xSpeed <= 0) {
                  this.xSpeed = this.walkSpeed;
                  this.sendActionPacket("KeyD");   
            }
      } else if (this.xSpeed < 0 || this.xSpeed > 0){
            this.xSpeed = 0;
            this.sendActionPacket(null);            
      }

      // Jumping
      if (this.onGround && Input.isKeyDown("KeyW")) {
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

      Entity.prototype.update.call(this, reader);      

      this.ping = reader.getUint16(16, true);

      if (this.isMain) {
            if (!updatePosition) {
                  this.x = oldX;
                  this.y = oldY;

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