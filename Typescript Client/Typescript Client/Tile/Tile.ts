/// <reference path="./../declarations.ts"/>

class Tile implements iRenderable {
    public x: number;
    public y: number;
    public collision: boolean;

    constructor(x: number, y: number, collision: boolean) {
        this.x = x;
        this.y = y;
        this.collision = collision;
    }

    public render(ctx: CanvasRenderingContext2D, camera: Camera): void {

    }
}

class ColorTile extends Tile {
    public color: string;

    constructor(x: number, y: number, collision: boolean, color: string) {
        super(x, y, collision);

        this.color = color;
    }

    public render(ctx: CanvasRenderingContext2D, camera: Camera): void {
        var tilesize = camera.room.tilesize;

        ctx.beginPath();
        ctx.rect((this.x * tilesize + camera.offset.x) * camera.zoom, (this.y * tilesize + camera.offset.y) * camera.zoom, tilesize * camera.zoom, tilesize * camera.zoom);
        ctx.fillStyle = this.color;
        ctx.closePath();

        ctx.stroke();
        ctx.fill();
    }
}