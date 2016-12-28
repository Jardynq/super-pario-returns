class PlayerEntity extends Entity {
    public static moveSpeed: number = 0;
    public static jumpForce: number = 0;

    public ping: number = 0;

    constructor(id: number, room: GameRoom, entityData: any) {
        super(id, room, entityData);

        this.hasGravity = true;
        this.height = 60;
        this.width = 30;
        this.color = "aquaMarine";
    }

    public update(data: DataView): number {
        var offset: number = super.update(data);
        this.ping = data.getUint16(offset, true);
        offset += 2;
        return offset;
    }

    public render(ctx: CanvasRenderingContext2D, camera: Camera): void {
        var screenPos = camera.worldToScreen({
            x: this.renderX - this.width * 0.5,
            y: this.renderY - this.height * 0.5
        });

        ctx.beginPath();
        ctx.rect(screenPos.x, screenPos.y, this.width * camera.zoom, this.height * camera.zoom);
        ctx.fillStyle = this.color;

        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.font = "16px arial";
        ctx.fillText(this.ping.toString(), screenPos.x + this.width * 0.5 * camera.zoom, screenPos.y);

        ctx.stroke();
        ctx.fill();
    }
}

/**
 * The entity of the controlled player
 */
class MainPlayerEntity extends PlayerEntity {
    constructor(id: number, room: GameRoom, entityData: any) {
        super(id, room, entityData);

        this.color = "red";
    }

    public step(timeScale: number): void {
        super.step(timeScale);

        // Prepare a packet in case it should be sent
        var actionPacket = new DataView(new ArrayBuffer(3));
        actionPacket.setUint8(0, PacketType.PlayerAction);

        if (Keyboard.isKeyDown("ArrowLeft")) {
            if (this.xSpeed != -PlayerEntity.moveSpeed) {
                this.xSpeed = -PlayerEntity.moveSpeed;
                actionPacket.setUint8(1, PlayerActionType.MoveLeft);
                socket.sendPacket(actionPacket);
            }
        } else if (Keyboard.isKeyDown("ArrowRight")) {
            if (this.xSpeed != PlayerEntity.moveSpeed) {
                this.xSpeed = PlayerEntity.moveSpeed;
                actionPacket.setUint8(1, PlayerActionType.MoveRight);
                socket.sendPacket(actionPacket);
            }
        } else if (this.xSpeed != 0) {
            this.xSpeed = 0;
            actionPacket.setUint8(1, PlayerActionType.StopMove);
            socket.sendPacket(actionPacket);

        }

        if (Keyboard.isKeyDown("ArrowUp") && this.onGround) {
            this.ySpeed = -PlayerEntity.jumpForce;
            actionPacket = new DataView(new ArrayBuffer(3));
            actionPacket.setUint8(0, PacketType.PlayerAction);
            actionPacket.setUint8(1, PlayerActionType.Jump);
            socket.sendPacket(actionPacket);
        }
    }
}

enum PlayerActionType {
    MoveLeft,
    MoveRight,
    StopMove,
    Jump
}