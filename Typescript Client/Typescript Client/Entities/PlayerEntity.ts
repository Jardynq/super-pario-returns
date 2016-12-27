class PlayerEntity extends Entity {
    constructor(id: number, entityData: any) {
        super(id, entityData);

        this.height = 60;
        this.width = 30;
        this.color = "aquaMarine";
    }
}

/**
 * The entity of the controlled player
 */
class MainPlayerEntity extends PlayerEntity {
    constructor(id: number, entityData: any) {
        super(id, entityData);

        this.color = "red";
    }

    public step(timeScale: number): void {
        super.step(timeScale);

        var oldXSpeed: number = this.xSpeed;
        var oldYSpeed: number = this.ySpeed;

        if (Keyboard.isKeyDown("ArrowRight")) {
            this.xSpeed = 300;
        } else if (Keyboard.isKeyDown("ArrowLeft")) {
            this.xSpeed = -300;
        } else {
            this.xSpeed = 0;
        }

        if (Keyboard.isKeyDown("ArrowUp")) {
            this.ySpeed = -300;
        } else if (Keyboard.isKeyDown("ArrowDown")) {
            this.ySpeed = 300;
        } else {
            this.ySpeed = 0;
        }

        if (oldXSpeed != this.xSpeed || oldYSpeed != this.ySpeed) {
            var actionPacket = new DataView(new ArrayBuffer(5));
            actionPacket.setUint8(0, PACKET_TYPE.PLAYER_ACTION);
            actionPacket.setInt16(1, this.xSpeed, true);
            actionPacket.setInt16(3, this.ySpeed, true);
            socket.sendPacket(actionPacket);
        }
    }
}