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
        ctx.beginPath();
        ctx.rect((this.x * TILE_SIZE + camera.offset.x) * camera.zoom, (this.y * TILE_SIZE + camera.offset.y) * camera.zoom, TILE_SIZE * camera.zoom, TILE_SIZE * camera.zoom);
        ctx.fillStyle = this.color;

        ctx.stroke();
        ctx.fill();
    }
}