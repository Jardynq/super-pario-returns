var PlayerEntity = function (reader) {
      // Run the the constructor from Entity
      Entity.prototype.constructor.call(this, reader);

      this.color = "aquaMarine";
      this.isMain = false;

      this.width = 30;
      this.height = 60;

      this.hasGravity = true;

      this.pingDisplay = new PingDisplay(this);
      this.pingDisplay.addToRenderQueue(room.render.renderQueue);
};
PlayerEntity.prototype = Object.create(Entity.prototype); // PlayerEntity inherits Entity
PlayerEntity.prototype.step = function (timescale) {
      Entity.prototype.step.call(this, timescale);
      
      if (this.isMain) {

            this.updateMovement();

            //this.sendActionPacket();
      }
};

// Movement
PlayerEntity.prototype.updateMovement = function () {
      // Left - right movement
      if (Input.isKeyDown("KeyD")) {
            if (this.xSpeed <= 0) {
                  this.xSpeed = this.walkSpeed;
                  this.sendActionPacket("KeyD");   
            }
      } else if (Input.isKeyDown("KeyA")) {
            if (this.xSpeed >= 0) {
                  this.xSpeed = -this.walkSpeed;
                  this.sendActionPacket("KeyA");   
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

PlayerEntity.prototype.updatePingDisplay = function () {
      this.pingDisplay.playerEntity = this;
};

PlayerEntity.prototype.setMain  = function () {
      this.color = "red";
      this.isMain = true;
};

PlayerEntity.ACTION_TYPES = {
      "moveLeft": 0,
      "moveRight": 1,
      "stopMove": 2,
      "jump": 3,
};