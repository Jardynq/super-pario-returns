/// <reference path="./declarations.ts"/>

class GameRoom {

    public entities: { [id: number]: Entity } = {};
    public map: TileMap;
    public camera: Camera = new Camera(this);

    public player: MainPlayerEntity;

    // Dejitter buffer
    public jitterbuffer: DataView[] = [];
    private lastEntityPacketProcessed: number = 0;

    constructor() {
        socket.registerHandler(PacketType.Map, this.loadMap.bind(this));
        socket.registerHandler(PacketType.Entity, this.entityPacketReceived.bind(this));
        socket.registerHandler(PacketType.Join, this.onJoin.bind(this));
        socket.registerHandler(PacketType.Ping, (reader) => socket.sendPacket(reader));
        // If we get a playerupdate from the server, we better act upon it
        socket.registerHandler(PacketType.PlayerUpdate, (data: DataView) => this.player.update(new DataView(data.buffer, 1), true));

        window.addEventListener("wheel", this.onScroll.bind(this));
    }

    /**
     * Frame step
     * @param timeScale How long is this frame compared to a second
     */
    public step(timeScale: number): void {
        for (var id in this.entities) {
            this.entities[id].step(timeScale);
        }

        if (this.jitterbuffer.length > 0) {
            var currentTime = new Date().getTime();
            if (currentTime > this.lastEntityPacketProcessed + 30) {
                this.updateEntities(this.jitterbuffer[this.jitterbuffer.length - 1]);
                this.jitterbuffer = [];
                this.lastEntityPacketProcessed = currentTime;
            }
        }
    }

    public renderAll(ctx: CanvasRenderingContext2D): void {
        // Clear the canvas from previous rendering passes
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update the camera
        if (this.player !== undefined) {
            var panDistance: number = 500;
            var xPan: number = -EasingFunction.CubicIn((Input.mouseX - ctx.canvas.width * 0.5) / ctx.canvas.width, 0, 2, 1) * panDistance;
            var yPan: number = -EasingFunction.CubicIn((Input.mouseY - ctx.canvas.height * 0.5) / ctx.canvas.height, 0, 2, 1) * panDistance;
            this.camera.offset.x = -this.player.renderX + (ctx.canvas.width * 0.5 / this.camera.zoom) + xPan;
            this.camera.offset.y = -this.player.renderY + (ctx.canvas.height * 0.5 / this.camera.zoom) + yPan;
        }

        if (this.map !== undefined) {
            this.map.render(ctx, this.camera);
        }

        for (var id in this.entities) {
            this.entities[id].render(ctx, this.camera);
        }
    }


    /**
     * Handles scrolling
     */
    public onScroll(e: WheelEvent): void {
        if (e.deltaY < 0) {
            this.camera.zoom = Math.min(this.camera.zoom * 1.1, this.camera.maxZoom);
        } else {
            this.camera.zoom = Math.max(this.camera.zoom / 1.1, this.camera.minZoom);
        }
    }

    public loadMap(reader: DataView): void {
        this.map = new TileMap(50);
        this.map.parseMapPacket(reader);
    }

    public entityPacketReceived(data: DataView) {
        // Single entity packets should be processed immediately
        if (data.getUint8(3) != 1) {
            this.updateEntities(data);
        } else {
            this.jitterbuffer.push(data);
        }
    }

    public updateEntities(reader: DataView): void {
        // The total number of entities in the game
        var entityCount: number = reader.getUint16(1, true);
        var containsAllEntities: boolean = reader.getUint8(3) == 1;
        var offset = 4;

        // Used to mark which entities this packet contained
        var receivedEntities: { [id: number]: boolean } = {};
        for (var i = 0; i < entityCount; i++) {
            // The length in bytes of this entity
            var entityLength: number = reader.getUint8(offset);
            var entityData: ArrayBuffer = reader.buffer.slice(offset + 1, offset + entityLength + 1);
            var entityView = new DataView(entityData);
            var id = entityView.getUint16(0, true);
            offset += entityData.byteLength + 1;
            receivedEntities[id] = true;

            if (this.entities[id] === undefined) {
                var type = entityView.getUint8(2);
                var entity: Entity;

                if (type === EntityType.Player) {
                    entity = new PlayerEntity(Number(id), this, entityView);
                } else if (type === EntityType.Bullet) {
                    entity = new BulletEntity(Number(id), this, entityView);
                } else {
                    throw "Unknown entity recieved. Type is: " + type;
                }
                this.entities[id] = entity;
            } else {
                this.entities[id].update(entityView);
            }
        }

        // Remove the entities, that weren't in this packet
        if (containsAllEntities) {
            for (var entID in this.entities) {
                if (receivedEntities[Number(entID)] !== true) {
                    this.entities[entID].dispose();
                }
            }
        }
    }

    public onJoin(reader: DataView): void {
        Entity.Gravity = reader.getFloat32(1, true);
        Entity.MaxSpeed = reader.getFloat32(5, true);
        PlayerEntity.moveSpeed = reader.getInt16(9, true);
        PlayerEntity.jumpForce = reader.getInt16(11, true);
        var playerID: number = reader.getUint16(13, true);

        this.player = new MainPlayerEntity(playerID, this, new DataView(reader.buffer, 1));
        this.entities[playerID] = this.player;
    }

    public removeEntity(id: number): void {
        delete this.entities[id];
    }
}