PingDisplay = function EntityRenderer(playerEntity) {
      this.playerEntity = playerEntity;
      this.color = "red";
};
PingDisplay.prototype = Object.create(Render.RenderObject.prototype); // EntityRenderer inherits RenderObject
PingDisplay.prototype.render = function (ctx, render) {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.font = "15px Oswald";

      ctx.textAlign = "center";

      ctx.fillText(this.playerEntity.ping, this.playerEntity.renderX + room.render.offsetX * room.render.zoom, (this.playerEntity.renderY + room.render.offsetY - this.playerEntity.height * 0.5 - 5) * room.render.zoom);
};