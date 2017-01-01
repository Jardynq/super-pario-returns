/// <reference path="./../declarations.ts"/>

class TileMap implements iRenderable {
    public width: number;
    public height: number;
    public tiles: Tile[] = [];
    public tilesize: number;

    constructor(tilesize: number) {
        this.tilesize = tilesize;
    }

    public parseMapPacket(reader: DataView): void {
        // Get the width of the map
        this.width = reader.getUint8(1);

        // Start at two since byte 1 is the TYPE and byte 2 is the width
        for (var i: number = 2; i < reader.byteLength; i++) {
            var tileIndex: number = i - 2;
            var tileValue: number = reader.getUint8(i);
            var x = tileIndex % this.width;
            var y = (tileIndex - x) / this.width;
            this.height = y + 1; // This way the height will be set to the last y value

            if (tileValue == 0) {
                this.tiles[tileIndex] = new ColorTile(x, y, false, "#2980b9");
            } else {
                this.tiles[tileIndex] = new ColorTile(x, y, true, "#111111");
            }
        }
    }

    public render(ctx: CanvasRenderingContext2D, camera: Camera) {
        var xStart: number = Math.floor(-camera.offset.x / camera.room.map.tilesize);
        var yStart: number = Math.floor(-camera.offset.y / camera.room.map.tilesize);
        var screenWidth: number = ctx.canvas.width / camera.room.map.tilesize / camera.zoom + 1;
        var screenHeight: number = ctx.canvas.height / camera.room.map.tilesize / camera.zoom + 1;

        for (var x: number = Math.max(0, xStart); x < Math.min(xStart + screenWidth, this.width); x++) {
            for (var y: number = Math.max(0, yStart); y < Math.min(yStart + screenHeight, this.height); y++) {
                this.getTile(x, y).render(ctx, camera);
            }
        }
    }

    /**
     * Returns the tile at the specified tile coordinates (1.1, 1.2, 1.3 etc.)
     */
    public getTile(x: number, y: number): Tile {
        if (x < 0 || x >= this.width) return null;
        if (y < 0 || y * this.width + x >= this.tiles.length) return null;

        return this.tiles[y * this.width + x];
    }

    /**
     * Returns the tile at the specified world coordinates
     */
    public getTileAt(x: number, y: number): Tile {
        return this.getTile(Math.floor(x / this.tilesize), Math.floor(y / this.tilesize));
    }

    /**
     * Casts a from start to end and returns every tile it passed
     * @param start The starting point in world coordinates
     * @param end The endpoint in world coordinates
     * @param stopAtCollision Whether or not the ray should stop when a collision tile is hit. The hit tile is added to the result
     * @param indefinite Whether or not the ray should continue to the edge of the map
     */
    public castRay(start: Vec2D, end: Vec2D, stopAtCollision: boolean, indefinite: boolean): RaycastResult {
        // Vector in the direction of the ray
        var ray: Vec2D = end.clone().sub(start);
        var xStep = ray.x > 0 ? 1 : -1;
        var yStep = ray.y > 0 ? 1 : -1;

        // The factor to multiply dir with to traverse one tile in the x direction
        var DtX: number = this.tilesize / ray.x * xStep;
        var DtY: number = this.tilesize / ray.y * yStep;

        // The total traversal in the X-direction
        var totaltX = (xStep == 1 ? this.tilesize - start.x % this.tilesize : -start.x % this.tilesize) / ray.x;
        if (totaltX == -Infinity) totaltX = Infinity;
        // The total traversal in the Y-direction
        var totaltY = (yStep == 1 ? this.tilesize - start.y % this.tilesize : -start.y % this.tilesize) / ray.y;
        if (totaltY == -Infinity) totaltY = Infinity;

        // The current position in the tile grid
        var tileX = Math.floor(start.x / this.tilesize);
        var tileY = Math.floor(start.y / this.tilesize);
        var endTileX = Math.floor(end.x / this.tilesize);
        var endTileY = Math.floor(end.y / this.tilesize);
        var tiles: Tile[] = [ this.getTile(tileX, tileY) ];

        // Whether or not the last step was in the X or the Y-direction
        var lastStepIsX: boolean = false;

        while (true) {
            // Check if the end of the ray has been reached
            if (indefinite == false && tileX == endTileX && tileY != endTileY) {
                break;
            }

            // If they totaltX and totaltY are equal a diagonal move should be made. But it has been optimized away since it never happens
            if (totaltX < totaltY || ray.y == 0) {
                totaltX += DtX;
                tileX += xStep;
                lastStepIsX = true;
            } else {
                totaltY += DtY;
                tileY += yStep;
                lastStepIsX = false;
            }

            // Check if the edge of the map has been reached
            if (tileX < 0 || tileX >= this.width || tileY < 0 || tileY >= this.height) {
                break;
            }
            
            tiles.push(this.getTile(tileX, tileY));

            // Check if a tile with collision has been hit
            if (stopAtCollision && tiles[tiles.length - 1].hasCollision) {
                // Step backwards to before this tile was hit
                if (lastStepIsX) {
                    totaltX -= DtX;
                } else {
                    totaltY -= DtY;
                }
                break;
            }
        }

        return new RaycastResult(tiles, start, start.clone().add(ray.scale(Math.min(totaltX, totaltY))));
    }
}

class RaycastResult {
    public tiles: Tile[];
    public end: Vec2D;
    public start: Vec2D;

    constructor(tiles: Tile[], start: Vec2D, end: Vec2D) {
        this.tiles = tiles;
        this.end = end;
        this.start = start;
    }
}