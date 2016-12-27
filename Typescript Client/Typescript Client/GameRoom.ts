class GameRoom {
    /// <reference path="./Entities/Entity.ts"/>
    /// <reference path="./app.ts"/>

    public entities: { [id: number]: Entity } = {};
    public map: TileMap;
    public camera: Camera = new Camera();;

    constructor() {
        socket.registerHandler("map", this.loadMap.bind(this));
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
    }

    public loadMap(packetData: string): void {
        this.map = new TileMap();
        this.map.parseMapPacketData(packetData);
    }
}