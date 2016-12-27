/// <reference path="./../app.ts"/>

class TileMap implements iRenderable {
    public width: number;
    public tiles: Tile[] = [];

    public parseMapPacketData(packetData: string): void {
        var rows = packetData.split('|');

        // Get the width of the map
        this.width = rows[0].split(',').length;

        // Generate the map from the supplied string
        for (var y = 0; y < rows.length; y++) {
            var columns = rows[y].split(',');
            for (var x = 0; x < columns.length; x++) {
                var tileData = columns[x];
                if (tileData == "0") { // Sky
                    this.tiles[y * this.width + x] = new ColorTile(x, y, false, "blue");
                } else if (tileData == "1") { // Ground
                    this.tiles[y * this.width + x] = new ColorTile(x, y, true, "black");
                }
            }
        }
    }

    public render (ctx: CanvasRenderingContext2D, camera: Camera) {
        // TODO: Only render tiles on screen
        for (var i: number = 0; i < this.tiles.length; i++) {
            this.tiles[i].render(ctx, camera);
        }
    }
}