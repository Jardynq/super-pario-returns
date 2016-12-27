var PlayerEntity = function (reader) {
      // Run the the constructor from Entity
      Entity.prototype.constructor.call(this, reader);

      this.color = "aquaMarine";
      this.isMain = false;

      this.walkSpeed = 500;
      this.jumpHeight = 500;

      this.width = 30;
      this.height = 60;
};
PlayerEntity.prototype = Object.create(Entity.prototype); // PlayerEntity inherits Entity
PlayerEntity.prototype.step = function (timescale) {
      Entity.prototype.step.call(this, timescale);
      
      if (this.isMain) {
            var oldXSpeed = this.xSpeed;
            var oldYSpeed = this.ySpeed;

            if (Input.isKeyDown("ArrowRight")) {
                  this.xSpeed = this.walkSpeed;
            } else if (Input.isKeyDown("ArrowLeft")) {
                  this.xSpeed = -this.walkSpeed;
            } else {
                  this.xSpeed = 0;
            }
            if (Input.isKeyDown("ArrowUp")) {
                  this.ySpeed = -this.jumpHeight;
            } else if (Input.isKeyDown("ArrowDown")) {
                  this.ySpeed = this.jumpHeight;
            } else {
                  this.ySpeed = 0;
            }

            if (oldXSpeed != this.xSpeed || oldYSpeed != this.ySpeed) {
                  var actionPacket = new DataView(new ArrayBuffer(5));
                  actionPacket.setUint8(0, Socket.PACKET_TYPES.playerAction);
                  actionPacket.setInt16(1, this.xSpeed, true);
                  actionPacket.setInt16(3, this.ySpeed, true);
                  Socket.sendPacket(actionPacket);
            }
      }
};

PlayerEntity.prototype.setMain  = function () {
      this.color = "red";
      this.isMain = true;
};