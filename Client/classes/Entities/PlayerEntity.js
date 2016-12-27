var PlayerEntity = function () {
      this.color = "aquaMarine";
      this.isMain = false;

      this.walkSpeed = 500;
      this.jumpHeight = 500;

      this.xSpeed = 0;
      this.ySpeed = 0;

      this.width = 30;
      this.height = 60;

      // Run the the constructor from Entity
      Entity.prototype.constructor.call(this);
};
PlayerEntity.prototype = Object.create(Entity.prototype); // PlayerEntity inherits Entity
PlayerEntity.prototype.step = function (timescale) {
      Entity.prototype.step.call(this, timescale);
      
      if (this.isMain) {
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


      }
};

PlayerEntity.prototype.setMain  = function () {
      this.color = "red";
      this.isMain = true;
};

PlayerEntity.prototype.update = function (entityData) {
      if (this.x !== undefined || this.y !== undefined) {

            var dist = Math.pow(this.x - entityData.X, 2) + Math.pow(this.y - entityData.Y, 2);

            if (dist > 10*10) {
                  this.x = Number(entityData.X);
                  this.y = Number(entityData.Y);
            }
      } else {
            this.x = Number(entityData.X);
            this.y = Number(entityData.Y);
      }
};