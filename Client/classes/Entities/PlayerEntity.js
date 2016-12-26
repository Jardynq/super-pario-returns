var PlayerEntity = function () {
      this.color = "aquaMarine";
      this.isMain = false;

      // Run the the constructor from Entity
      Entity.prototype.constructor.call(this);
};
PlayerEntity.prototype = Object.create(Entity.prototype); // PlayerEntity inherits Entity
PlayerEntity.prototype.step = function (timescale) {
      if (! this.isMain) {
            Entity.prototype.step.call(this, timescale);
      } else {
            if (Input.isKeyDown("ArrowRight")) {
                  this.xSpeed = 100;
            } else if (Input.isKeyDown("ArrowLeft")) {
                  this.xSpeed = -100;
            } else {
                  this.xSpeed = 0;
            }
            if (Input.isKeyDown("ArrowUp")) {
                  this.ySpeed = -100;
            } else if (Input.isKeyDown("ArrowDown")) {
                  this.ySpeed = 100;
            } else {
                  this.ySpeed = 0;
            }

            // Player Actions
            Socket.sendPacket("playerAct", {
                  xSpeed: this.xSpeed,
                  ySpeed: this.ySpeed
            });
      }
};

PlayerEntity.prototype.setMain  = function () {
      this.color = "red";
      this.isMain = true;
};