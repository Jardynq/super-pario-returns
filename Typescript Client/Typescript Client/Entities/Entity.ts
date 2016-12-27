/// <reference path="./../declarations.ts"/>

class Entity implements iRenderable {
    public id: number;

    public x: number = 0;
    public y: number = 0;
    public xSpeed: number = 0;
    public ySpeed: number = 0;
    public width: number = 0;
    public height: number = 0;

    public color: string;

    constructor(id: number, data: DataView) {
        this.id = id;
        this.update(data);
    }

    public step(timeScale: number): void {
        this.x += this.xSpeed * timeScale;
        this.y += this.ySpeed * timeScale;
    }

    public update(data: DataView) {
        var offset = 4; // To compensate for LENGTH, ID and TYPE
        this.x = data.getInt16(offset, true);
        offset += 2;
        this.y = data.getInt16(offset, true);
        offset += 2;

        this.xSpeed = data.getInt16(offset, true);
        offset += 2;
        this.ySpeed = data.getInt16(offset, true);
        offset += 2;
    }

    public render(ctx: CanvasRenderingContext2D, camera: Camera): void {
        ctx.beginPath();
        ctx.rect((this.x + camera.offset.x) * camera.zoom, (this.y + camera.offset.y) * camera.zoom, this.width * camera.zoom, this.height * camera.zoom);
        ctx.fillStyle = this.color;

        ctx.stroke();
        ctx.fill();
    }
}

enum ENTITY_TYPE {
    PLAYER
}