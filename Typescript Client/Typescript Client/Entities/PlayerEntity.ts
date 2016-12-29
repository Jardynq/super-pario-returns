class PlayerEntity extends Entity {
    public static moveSpeed: number = 0;
    public static jumpForce: number = 0;

    public ping: number = 0;

    constructor(id: number, room: GameRoom, entityData: any) {
        super(id, room, entityData);

        this.hasGravity = true;
        this.height = 60;
        this.width = 30;
        this.color = "#8e44ad";
    }

    public update(data: DataView): number {
        var offset: number = super.update(data);
        this.ping = data.getUint16(offset, true);
        offset += 2;
        return offset;
    }

    public render(ctx: CanvasRenderingContext2D, camera: Camera): void {
        var pingScreenPos = camera.worldToScreen({
            x: this.renderX,
            y: this.renderY - this.height * 0.5
        });

        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.font = "16px arial bold";
        ctx.fillText(this.ping.toString(), pingScreenPos.x, pingScreenPos.y);

        super.render(ctx, camera);
    }
}

/**
 * The entity of the controlled player
 */
class MainPlayerEntity extends PlayerEntity {
    constructor(id: number, room: GameRoom, entityData: any) {
        super(id, room, entityData);

        this.color = "#f39c12";

        window.addEventListener("click", this.onClick.bind(this));
    }

    public step(timeScale: number): void {
        super.step(timeScale);

        if (Input.isKeyDown("KeyA")) {
            if (this.xSpeed != -PlayerEntity.moveSpeed) {
                this.xSpeed = -PlayerEntity.moveSpeed;
                this.sendAction(PlayerActionType.MoveLeft);
            }
        } else if (Input.isKeyDown("KeyD")) {
            if (this.xSpeed != PlayerEntity.moveSpeed) {
                this.xSpeed = PlayerEntity.moveSpeed;
                this.sendAction(PlayerActionType.MoveRight);
            }
        } else if (this.xSpeed != 0) {
            this.xSpeed = 0;
            this.sendAction(PlayerActionType.StopMove);
        }

        if (Input.isKeyDown("KeyW")) {
            if (this.onGround) {
                this.ySpeed = -PlayerEntity.jumpForce;
                this.sendAction(PlayerActionType.Jump);
            } else if (this.onWall) {

            }
        }

        if (Input.mouseDown) this.shoot();

        // Send an update packet to the server
        var updatePacket = new DataView(new ArrayBuffer(13));
        updatePacket.setUint8(0, PacketType.PlayerUpdate);
        updatePacket.setInt16(1, this.x, true);
        updatePacket.setInt16(3, this.y, true);
        socket.sendPacket(updatePacket);
    }

    public sendAction(actionType: PlayerActionType): void {
        var actionPacket = new DataView(new ArrayBuffer(3));
        actionPacket.setUint8(0, PacketType.PlayerAction);
        actionPacket.setUint8(1, actionType);
        socket.sendPacket(actionPacket);
    }

    public update(data: DataView, forceUpdate: boolean = false): number {
        if (!forceUpdate) {
            var oldX = this.x;
            var oldY = this.y;
            super.update(data);
            this.x = oldX;
            this.y = oldY;
        } else {
            return super.update(data);
        }
    }

    public dispose(): void {
        window.removeEventListener("click", this.onClick.bind(this));
        super.dispose();
    }

    public onClick(): void {

    }

    private lastShot = 0;
    public shoot(): void {
        if (new Date().getTime() > this.lastShot + 200) {
            var screenPos = this.room.camera.worldToScreen({ x: this.x, y: this.y });
            var dirX = Input.mouseX - screenPos.x;
            var dirY = Input.mouseY - screenPos.y;

            // Calculate the angle of the player click
            var angle = Math.atan2(dirY, dirX);
            var packet = new DataView(new ArrayBuffer(5));
            packet.setUint8(0, PacketType.PlayerShoot);
            packet.setFloat32(1, angle, true);
            socket.sendPacket(packet);
            this.lastShot = new Date().getTime();
        }
    }
}

enum PlayerActionType {
    MoveLeft,
    MoveRight,
    StopMove,
    Jump
}