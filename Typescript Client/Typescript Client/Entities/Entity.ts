/// <reference path="./../declarations.ts"/>
class Entity {
    // The ID of the entity, which is syncronised with the server
    public id: number;
    // Whether or not this entity has been disposed
    public isDisposed = false;
    // The room the entity exists in
    public room: GameRoom;
    // The type of the entity
    public type: EntityType;

    constructor(id: number, room: GameRoom, data: DataView = null) {
        this.id = id;
        this.room = room;
        if (data !== null) {
            this.update(data);
        }
    }

    /**
     * Updates the entity based on a server packet. (Only applies to online entities)
     * @param data The datapacket from the server to update from
     */
    public update(data: DataView): number {
        this.type = data.getUint8(2);
        return 3;
    }

    /**
     * Frees all ressources related to this entity
     */
    public dispose(): void {
        if (this.isDisposed == false) {
            this.isDisposed = true;
            this.room.removeEntity(this.id);
        }
    }

    /**
     * Process a new frame of the entity
     * @param timeScale The fraction of a second that has passed since last frame
     */
    public step(timeScale: number): void { }

    /**
     * Draws the entity to the screen
     * @param ctx The context in which to draw the entity
     * @param camera The view to draw the camera in
     */
    public render(ctx: CanvasRenderingContext2D, camera: Camera): void { }

    /**
     * Runs whenever the entity is disposed on the server
     * Doesn't run for local entities
     */
    public serverDelete(): void {
        if (this.id >= 0) {
            this.dispose();
        }
    }
}

class PhysicsEntity extends Entity implements iRenderable {
    public x: number;
    public y: number;
    public xSpeed: number;
    public ySpeed: number;

    // Used to smooth out entity movement by easing between states
    public renderX: number = 0;
    public renderY: number = 0;

    public width: number = 0;
    public height: number = 0;
    public onGround: boolean = false;
    public onWall: boolean = false;

    public hasGravity: boolean = false;
    public color: string;

    // Constants
    public static Gravity: number = 100;
    public static MaxSpeed: number = 100;

    constructor(id: number, room: GameRoom, data: DataView = null) {
        super(id, room, data);

        if (this.x === undefined) this.x = 0;
        if (this.y === undefined) this.y = 0;
        if (this.xSpeed === undefined) this.xSpeed = 0;
        if (this.ySpeed === undefined) this.ySpeed = 0;

        // Update the renderX and renderY to prevent the object from easing in from (0, 0)
        this.renderX = this.x;
        this.renderY = this.y;
    }

    /**
     * Process a new frame of the entity
     * @param timeScale The fraction of a second that has passed since last frame
     */
    public step(timeScale: number): void {
        if (this.hasGravity) {
            this.ySpeed = Math.min(this.ySpeed + PhysicsEntity.Gravity * timeScale, PhysicsEntity.MaxSpeed);
        }

        this.onGround = false;
        this.onWall = false;

        this.x += this.xSpeed * timeScale;
        this.HandleCollision(true);
        this.y += this.ySpeed * timeScale;
        this.HandleCollision(false);

        this.renderX += (this.x - this.renderX) * 0.8;
        this.renderY += (this.y - this.renderY) * 0.8;
    }

    /**
     * Updates the entity based on a server packet. (Only applies to online entities)
     * @param data The datapacket from the server to update from
     */
    public update(data: DataView): number {
        var offset = super.update(data);
        this.x = data.getInt16(offset, true);
        offset += 2;
        this.y = data.getInt16(offset, true);
        offset += 2;

        this.xSpeed = data.getFloat32(offset, true);
        offset += 4;
        this.ySpeed = data.getFloat32(offset, true);
        offset += 4;

        return offset;
    }

    private HandleCollision(x: boolean) {
        var speed: Number = x ? this.xSpeed : this.ySpeed;

        var collisionTiles: Tile[] = [];

        collisionTiles.push(this.room.map.getTileAt(this.x - this.width * 0.5 + 0.3, this.y - this.height * 0.5 + 0.3));
        collisionTiles.push(this.room.map.getTileAt(this.x + this.width * 0.5 - 0.3, this.y - this.height * 0.5 + 0.3));
        collisionTiles.push(this.room.map.getTileAt(this.x - this.width * 0.5 + 0.3, this.y + this.height * 0.5 - 0.3));
        collisionTiles.push(this.room.map.getTileAt(this.x + this.width * 0.5 - 0.3, this.y + this.height * 0.5 - 0.3));
        collisionTiles.push(this.room.map.getTileAt(this.x - this.width * 0.5 + 0.3, this.y));
        collisionTiles.push(this.room.map.getTileAt(this.x + this.width * 0.5 - 0.3, this.y));

        for (var i = 0; i < collisionTiles.length; i++) {
            var tile = collisionTiles[i];
            if (tile != null && tile.hasCollision) {
                if (x) {
                    if (speed > 0) {
                        this.x = tile.x * this.room.map.tilesize - this.width * 0.5;
                    } else if (speed < 0) {
                        this.x = tile.x * this.room.map.tilesize + this.room.map.tilesize + this.width * 0.5;
                    }
                    this.xSpeed = 0;
                    this.onWall = true;
                    this.collidedWithTile(tile);
                } else {
                    if (speed > 0) {
                        this.y = tile.y * this.room.map.tilesize - this.height * 0.5;
                        this.onGround = true;
                    }
                    else if (speed < 0) {
                        this.y = tile.y * this.room.map.tilesize + this.room.map.tilesize + this.height * 0.5;
                    }
                    this.ySpeed = 0;
                    this.collidedWithTile(tile);
                }
            }
        }
    }

    /**
     * Draws the entity to the screen
     * @param ctx The context in which to draw the entity
     * @param camera The view to draw the camera in
     */
    public render(ctx: CanvasRenderingContext2D, camera: Camera): void {
        var screenPos = camera.worldToScreen(new Vec2D(this.renderX - this.width * 0.5, this.renderY - this.height * 0.5));

        ctx.fillStyle = this.color;
        ctx.fillRect(screenPos.x, screenPos.y, this.width * camera.zoom, this.height * camera.zoom);
    }

    protected collidedWithTile(tile: Tile) { }
}

enum EntityType {
    Player,
    Bullet
}