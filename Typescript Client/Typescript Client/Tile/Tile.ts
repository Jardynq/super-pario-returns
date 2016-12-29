/// <reference path="./../declarations.ts"/>

class Tile implements iRenderable {
    public x: number;
    public y: number;
    public hasCollision: boolean;

    constructor(x: number, y: number, hasCollision: boolean) {
        this.x = x;
        this.y = y;
        this.hasCollision = hasCollision;
    }

    public render(ctx: CanvasRenderingContext2D, camera: Camera): void {

    }
}

class ColorTile extends Tile {
    public color: string;

    constructor(x: number, y: number, hasCollision: boolean, color: string) {
        super(x, y, hasCollision);

        this.color = color;
    }

    public render(ctx: CanvasRenderingContext2D, camera: Camera): void {
        var tilesize = camera.room.map.tilesize;

        ctx.beginPath();
        ctx.rect((this.x * tilesize + camera.offset.x) * camera.zoom, (this.y * tilesize + camera.offset.y) * camera.zoom, tilesize * camera.zoom, tilesize * camera.zoom);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.closePath();

        ctx.stroke();
        ctx.fill();
    }
}