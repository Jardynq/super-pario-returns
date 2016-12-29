class BulletEntity extends Entity {
    private _oldPositions: { x: number, y: number }[] = [];

    constructor(id: number, room: GameRoom, data: DataView) {
        super(id, room, data);
        this.width = 10;
        this.height = 10;
        this.hasGravity = true;
        this.color = "olive";
    }

    public step(timeScale: number): void {
        if (this.isDisposed == false) {
            super.step(timeScale);
            this._oldPositions.push({ x: this.x, y: this.y });
        }

        if (this.x < 0 || this.x > this.room.map.width * this.room.map.tilesize
            || this.y < 0 || this.y > this.room.map.height * this.room.map.tilesize) {
            this.dispose();
        }
    }

    public dispose(): void {
        this.isDisposed = true;
    }

    public render(ctx: CanvasRenderingContext2D, camera: Camera): void {
        if (this._oldPositions.length > 10 || this.isDisposed) {
            this._oldPositions.shift();
            if (this._oldPositions.length == 0) {
                super.dispose();
                return;
            }
        } else if (this._oldPositions.length < 2) {
            return;
        }

        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        var screenPos = camera.worldToScreen({ x: this._oldPositions[0].x, y: this._oldPositions[0].y });
        ctx.moveTo(screenPos.x, screenPos.y);
        for (var i = 1; i < this._oldPositions.length; i++) {
            screenPos = camera.worldToScreen({ x: this._oldPositions[i].x, y: this._oldPositions[i].y });
            ctx.lineTo(screenPos.x, screenPos.y);
        }

        ctx.stroke();
    }

    public update(data: DataView): number {
        if (this._oldPositions === undefined) {
            this._oldPositions = [];
        }
        this._oldPositions.push({ x: this.x, y: this.y });
        return super.update(data);
    }

    protected collidedWithTile(tile: Tile) {
        this._oldPositions.push({ x: this.x, y: this.y });
        this.dispose();
    }
}