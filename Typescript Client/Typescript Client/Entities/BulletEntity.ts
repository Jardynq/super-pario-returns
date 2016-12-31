class BulletEntity extends PhysicsEntity {
    private _oldPositions: { x: number, y: number }[] = [];
    public owner: PlayerEntity;

    // Whether the bullet has hit something and is disappearing
    public disappearing = false;

    constructor(id: number, room: GameRoom, data: DataView) {
        super(id, room, data);
        this.width = 5;
        this.height = 5;
        this.color = "olive";
    }

    public step(timeScale: number): void {
        if (this.disappearing == false) {
            super.step(timeScale);
            this._oldPositions.push({ x: this.x, y: this.y });
        }

        if (this.x < 0 || this.x > this.room.map.width * this.room.map.tilesize
            || this.y < 0 || this.y > this.room.map.height * this.room.map.tilesize) {
            this.disappearing = true;
        }
    }

    public render(ctx: CanvasRenderingContext2D, camera: Camera): void {
        if (this._oldPositions.length > 10 || this.disappearing) {
            this._oldPositions.shift();
            if (this._oldPositions.length == 0) {
                this.dispose();
                return;
            }
        } else if (this._oldPositions.length < 2) {
            return;
        }

        ctx.beginPath();
        if (this.owner.id == this.room.player.id) {
            ctx.strokeStyle = "#2ecc71";
        } else {
            ctx.strokeStyle = "#e74c3c";
        }
        ctx.lineWidth = 10 * camera.zoom;
        ctx.lineCap = "round";
        var screenPos = camera.worldToScreen(new Vec2D(this._oldPositions[0].x, this._oldPositions[0].y));
        ctx.moveTo(screenPos.x, screenPos.y);
        for (var i = 1; i < this._oldPositions.length; i++) {
        screenPos = camera.worldToScreen(new Vec2D(this._oldPositions[i].x, this._oldPositions[i].y));
            ctx.lineTo(screenPos.x, screenPos.y);
        }

        ctx.stroke();
    }

    public update(data: DataView): number {
        // Read the owner
        var offset: number = super.update(data);
        this.owner = this.room.entities[data.getUint16(offset, true)] as PlayerEntity;

        // Add the first position to make sure it gets displayed
        if (this._oldPositions === undefined) {
            this._oldPositions = [ { x: this.x, y: this.y } ];
        }

        return offset + 2;
    }

    protected collidedWithTile(tile: Tile) {
        this.disappearing = true;
    }

    public serverDelete(): void {
        // Prevent the entity from straight out disappearing
        this.disappearing = true;
    }
}