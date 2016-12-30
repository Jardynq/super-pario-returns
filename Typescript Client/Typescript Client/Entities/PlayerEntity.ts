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
    private actions: PlayerAction[] = [];

    constructor(id: number, room: GameRoom, entityData: any) {
        super(id, room, entityData);

        this.color = "#f39c12";

        window.addEventListener("click", this.onClick.bind(this));
    }

    public step(timeScale: number, ignoreInputs: boolean = false): void {
        super.step(timeScale);

        if (!ignoreInputs) {
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
        }

        // Send an update packet to the server
        var updatePacket = new DataView(new ArrayBuffer(13));
        updatePacket.setUint8(0, PacketType.PlayerUpdate);
        updatePacket.setInt16(1, this.x, true);
        updatePacket.setInt16(3, this.y, true);
        socket.sendPacket(updatePacket);
    }

    public sendAction(actionType: PlayerActionType): void {
        this.actions.push(new PlayerAction(actionType));
        var actionPacket = new DataView(new ArrayBuffer(3));
        actionPacket.setUint8(0, PacketType.PlayerAction);
        actionPacket.setUint8(1, actionType);
        socket.sendPacket(actionPacket);
    }

    public update(data: DataView, forceUpdate: boolean = false): number {
        
        var oldX = this.x;
        var oldY = this.y;
        var offset = super.update(data);

        // Revert the position
        // Still simulate forward with regards to the speeds
        /*if (!forceUpdate) {
            this.x = oldX;
            this.y = oldY;
        }

        if (this.actions === undefined) {
            this.actions = [];
        }
        // Guess the time when the packet was sent
        var simulatedTo: number = new Date().getTime() - this.ping * 0.5;
        // Find the first action after the update packet was sent
        for (var i = this.actions.length - 1; i >= 0; i--) {
            if (this.actions[i].timestamp < simulatedTo) {
                // Simulate forward from when the packet is throught to have been sent
                for (var j = i + 1; j < this.actions.length; j++) {
                    var action = this.actions[j];
                    // Simulate up to the action
                    this.step((action.timestamp - simulatedTo) / 1000, true);
                    simulatedTo = action.timestamp;
                    // Apply the action
                    if (action.type == PlayerActionType.Jump) this.ySpeed = -PlayerEntity.jumpForce;
                    if (action.type == PlayerActionType.MoveLeft) this.xSpeed = -PlayerEntity.MaxSpeed;
                    if (action.type == PlayerActionType.MoveRight) this.xSpeed = PlayerEntity.MaxSpeed;
                    if (action.type == PlayerActionType.StopMove) this.xSpeed = 0;
                }
                // Remove actions up to this one to minimize memory usage
                //this.actions.slice(0, i);
                break;
            }
        }
        // Simulate up to the current time
        this.step((new Date().getTime() - simulatedTo) / 1000, true);*/

        return offset;
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

class PlayerAction {
    public timestamp: number;
    public type: PlayerActionType;

    constructor(type: PlayerActionType) {
        this.timestamp = new Date().getTime();
        this.type = type;
    }
}

enum PlayerActionType {
    MoveLeft,
    MoveRight,
    StopMove,
    Jump
}