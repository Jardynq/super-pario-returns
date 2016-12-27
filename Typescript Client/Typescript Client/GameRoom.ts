/// <reference path="./declarations.ts"/>

class GameRoom {

    public entities: { [id: number]: Entity } = {};
    public map: TileMap;
    public camera: Camera = new Camera(this);
    public tilesize: number = 50;

    public player: MainPlayerEntity;

    constructor() {
        socket.registerHandler("map", this.loadMap.bind(this));
        socket.registerHandler("entity", this.updateEntities.bind(this));
        socket.registerHandler("join", this.onJoin.bind(this));
    }

    /**
     * Frame step
     * @param timeScale How long is this frame compared to a second
     */
    public step(timeScale: number): void {
        for (var id in this.entities) {
            this.entities[id].step(timeScale);
        }
    }

    public renderAll(ctx: CanvasRenderingContext2D): void {
        // Clear the canvas from previous rendering passes
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this.map !== undefined) {
            this.map.render(ctx, this.camera);
        }

        for (var id in this.entities) {
            this.entities[id].render(ctx, this.camera);
        }
    }

    public loadMap(packetData: string): void {
        this.map = new TileMap();
        this.map.parseMapPacketData(packetData);
    }

    public updateEntities(entityString: string): void {
        var entityData: any[] = JSON.parse(entityString).Entities;

        for (var id in entityData) {
            var ent: any = entityData[id] as { Type: string };

            if (this.entities[id] === undefined) {
                var entityType: string = ent.Type;
                var entity: Entity;

                if (entityType === "player") {
                    entity = new PlayerEntity(Number(id), entityData);
                } else {
                    throw "Unknown entity recieved. Type is: " + ent.Type;
                }

                this.entities[id] = entity;
            } else {
                this.entities[id].update(ent);
            }
        }
    }

    public onJoin(dataString: string): void {
        var joinData = JSON.parse(dataString);
        var playerID: number = joinData.PlayerEntityID;

        this.player = new MainPlayerEntity(playerID, this.entities[joinData.PlayerEntityID].toEntityData());
        this.entities[joinData.PlayerEntityID] = this.player;
    }
}