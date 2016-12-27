class PlayerEntity extends Entity {
    constructor(id: number, entityData: any) {
        super(id, entityData);

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
        if (Keyboard.isKeyDown("ArrowRight")) {
            this.xSpeed = 100;
        } else if (Keyboard.isKeyDown("ArrowLeft")) {
            this.xSpeed = -100;
        } else {
            this.xSpeed = 0;
        }
        if (Keyboard.isKeyDown("ArrowUp")) {
            this.ySpeed = -100;
        } else if (Keyboard.isKeyDown("ArrowDown")) {
            this.ySpeed = 100;
        } else {
            this.ySpeed = 0;
        }

        // Player Actions
        socket.sendPacket("playerAct", {
            xSpeed: this.xSpeed,
            ySpeed: this.ySpeed
        });
    }
}