var PlayerEntity = function (reader) {
      // Run the the constructor from Entity
      Entity.prototype.constructor.call(this, reader);

      this.color = "aquaMarine";
      this.isMain = false;

      this.walkSpeed = 500;
      this.jumpHeight = 1000;

      this.width = 30;
      this.height = 60;

      this.hasGravity = true;
};
PlayerEntity.prototype = Object.create(Entity.prototype); // PlayerEntity inherits Entity
PlayerEntity.prototype.step = function (timescale) {
      Entity.prototype.step.call(this, timescale);
      
      if (this.isMain) {
            oldXSpeed = this.xSpeed;
            oldYSpeed = this.ySpeed;

            this.updateMovement();

            this.sendActionPacket(oldXSpeed, oldYSpeed);
      }
};

// Movement
PlayerEntity.prototype.updateMovement = function () {
      // Left - right movement
      if (Input.isKeyDown("KeyD")) {
            this.xSpeed = this.walkSpeed;
      } else if (Input.isKeyDown("KeyA")) {
            this.xSpeed = -this.walkSpeed;
      } else {
            this.xSpeed = 0;
      }

      // Jumping
      if (this.onGround && Input.isKeyDown("KeyW")) {
            this.ySpeed = -this.jumpHeight;
      }
};
PlayerEntity.prototype.sendActionPacket = function (oldXSpeed, oldYSpeed) {
      if (oldXSpeed != this.xSpeed || oldYSpeed != this.ySpeed) {
            var actionPacket = new DataView(new ArrayBuffer(5));
            actionPacket.setUint8(0, Socket.PACKET_TYPES.playerAction);
            actionPacket.setInt16(1, this.xSpeed, true);
            actionPacket.setInt16(3, this.ySpeed, true);
            Socket.sendPacket(actionPacket);
      }
};

PlayerEntity.prototype.setMain  = function () {
      this.color = "red";
      this.isMain = true;
};