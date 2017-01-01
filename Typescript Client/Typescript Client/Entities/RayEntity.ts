class RayEntity extends Entity {
    public start: Vec2D;
    public end: Vec2D;

    // How long the ray exists (in seconds)
    public lifetime = 0.2;

    constructor(id: number, room: GameRoom, entityData: any) {
        super(id, room, entityData);
    }

    public step(timeScale: number) {
        this.lifetime -= timeScale;
        if (this.lifetime < 0) {
            this.dispose();
        }
    }

    public render(ctx: CanvasRenderingContext2D, camera: Camera): void {
        var wStart = camera.worldToScreen(this.start);
        var wEnd = camera.worldToScreen(this.end);

        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.lineCap = "square";
        ctx.beginPath();
        ctx.moveTo(wStart.x, wStart.y);
        ctx.lineTo(wEnd.x, wEnd.y);
        ctx.stroke();
    }
}