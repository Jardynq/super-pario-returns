/// <reference path="./../declarations.ts"/>

class TileMap implements iRenderable {
    public width: number;
    public height: number;
    public tiles: Tile[] = [];

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
        var xStart: number = camera.offset.x / camera.room.tilesize;
        var yStart: number = camera.offset.y / camera.room.tilesize;
        var screenWidth: number = ctx.canvas.width / camera.room.tilesize;
        var screenHeight: number = ctx.canvas.height / camera.room.tilesize;

        for (var x: number = Math.max(0, xStart); x < Math.min(xStart + screenWidth, this.width); x++) {
            for (var y: number = Math.max(0, yStart); y < Math.min(yStart + screenHeight, this.height); y++) {
                this.getTile(x, y).render(ctx, camera);
            }
        }
    }

    public getTile(x: number, y: number): Tile {
        return this.tiles[y * this.width + x];
    }
}