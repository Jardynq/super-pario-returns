var BulletEntity = function (reader) {
      // Run the the constructor from Entity
      Entity.prototype.constructor.call(this, reader);
      this.hasGravity = true;
      this.width = 10;
      this.height = 10;
      this.color = "green";
};
BulletEntity.prototype = Object.create(Entity.prototype); // Bullet inherits Entity