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
                this.tiles[tileIndex] = new ColorTile(x, y, false, "blue");
            } else {
                this.tiles[tileIndex] = new ColorTile(x, y, true, "black");
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
}