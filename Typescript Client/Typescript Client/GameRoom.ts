/// <reference path="./declarations.ts"/>

class GameRoom {

    public entities: { [id: number]: Entity } = {};
    public map: TileMap;
    public camera: Camera = new Camera(this);

    // Related to syncronisation
    public lastEntityUpdateLocalTimestamp = 0;
    public lastEntityUpdateServertimestamp = 0;

    public player: MainPlayerEntity;

    constructor() {
        socket.registerHandler(PacketType.Map, this.loadMap.bind(this));
        socket.registerHandler(PacketType.Entity, this.updateEntities.bind(this));
        socket.registerHandler(PacketType.Join, this.onJoin.bind(this));
        socket.registerHandler(PacketType.Ping, (reader) => socket.sendPacket(reader));

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
        this.camera.step();
    }

    public renderAll(ctx: CanvasRenderingContext2D): void {
        // Clear the canvas from previous rendering passes
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update the camera
        if (this.player !== undefined) {
            this.camera.targetOffset.x = -this.player.x + (ctx.canvas.width * 0.5 / this.camera.zoom);
            this.camera.targetOffset.y = -this.player.y + (ctx.canvas.height * 0.5 / this.camera.zoom);
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

    public updateEntities(reader: DataView): void {
        var timestamp: number = reader.getFloat64(1, true);
        
        // The total number of entities in the game
        var entityCount = reader.getUint16(9, true);
        var offset = 11;

        for (var i = 0; i < entityCount; i++) {
            // The length in bytes of this entity
            var entityLength: number = reader.getUint8(offset);
            var entityData: ArrayBuffer = reader.buffer.slice(offset, offset + entityLength + 1);
            var entityView = new DataView(entityData);
            var id = entityView.getUint16(1, true);
            offset += entityData.byteLength;

            if (this.entities[id] === undefined) {
                var type = entityView.getUint8(2);
                var entity: Entity;

                if (type === EntityType.Player) {
                    entity = new PlayerEntity(Number(id), this, entityView);
                } else {
                    throw "Unknown entity recieved. Type is: " + type;
                }

                this.entities[id] = entity;
            } else {
                this.entities[id].update(entityView);
            }
        }
    }

    public onJoin(reader: DataView): void {
        Entity.Gravity = reader.getFloat32(1, true);
        Entity.MaxSpeed = reader.getFloat32(5, true);
        PlayerEntity.moveSpeed = reader.getInt16(9, true);
        PlayerEntity.jumpForce = reader.getInt16(11, true);
        var playerID: number = reader.getUint16(13, true);

        this.player = new MainPlayerEntity(playerID, this, reader);
        this.entities[playerID] = this.player;
    }
}