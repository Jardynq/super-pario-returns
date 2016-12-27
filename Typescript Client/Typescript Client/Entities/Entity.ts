/// <reference path="./../declarations.ts"/>

class Entity implements iRenderable {
    public id: number;

    public x: number;
    public y: number;
    public xSpeed: number;
    public ySpeed: number;
    public width: number;
    public height: number;

    public color: string;

    constructor(id: number, entityData: { Type: string }) {
        this.id = id;
        this.update(entityData);
    }

    public step(timeScale: number): void {
        this.x += this.xSpeed * timeScale;
        this.y += this.ySpeed * timeScale;
    }

    public update(entityData: any) {
        this.x = Number(entityData.X);
        this.y = Number(entityData.Y);

        this.xSpeed = Number(entityData.XSpeed);
        this.ySpeed = Number(entityData.YSpeed);

        this.width = Number(entityData.Width);
        this.height = Number(entityData.Height);
    }

    public toEntityData(): any {
        var output: any = {};

        output.X = this.x;
        output.Y = this.y;
        output.xSpeed = this.xSpeed;
        output.ySpeed = this.ySpeed;
        output.width = this.width;
        output.height = this.height;

        return output;
    }

    public render(ctx: CanvasRenderingContext2D, camera: Camera): void {
        ctx.beginPath();
        ctx.rect((this.x + camera.offset.x) * camera.zoom, (this.y + camera.offset.y) * camera.zoom, this.width * camera.zoom, this.height * camera.zoom);
        ctx.fillStyle = this.color;

        ctx.stroke();
        ctx.fill();
    }
}