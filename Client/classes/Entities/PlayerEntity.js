var PlayerEntity = function (reader) {
      // Run the the constructor from Entity
      Entity.prototype.constructor.call(this, reader);

      this.color = "aquaMarine";
      this.isMain = false;

      this.walkSpeed = 500;
      this.jumpHeight = 1200;

      this.width = 30;
      this.height = 60;

      this.hasGravity = true;
      this.gravity = 60;
};
PlayerEntity.prototype = Object.create(Entity.prototype); // PlayerEntity inherits Entity
PlayerEntity.prototype.step = function (timescale) {
      Entity.prototype.step.call(this, timescale);
      
      if (this.isMain) {
            this.oldXSpeed = this.xSpeed;
            this.oldYSpeed = this.ySpeed;

            this.updateMovement();

            this.updateCollisionX();
            this.updateCollisionY();

            this.sendActionPacket();
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
};
PlayerEntity.prototype.onKeyDown = function () {
      if (Input.isKeyDown("KeyW")) {
            this.ySpeed = -this.jumpHeight;
      }
};
PlayerEntity.prototype.updateCollisionX = function() {

};
PlayerEntity.prototype.updateCollisionY = function() {
      if (this.y >= 1500) {
            this.y = 1500;
            this.ySpeed = 0;
      }
};
PlayerEntity.prototype.sendActionPacket = function (oldXSpeed, oldYSpeed) {
      if (this.oldXSpeed != this.xSpeed || this.oldYSpeed != this.ySpeed) {
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