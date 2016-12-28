/// <reference path="./declarations.ts"/>

class Camera {
    public offset: {
        x: number,
        y: number
    } = {
        x: 0,
        y: 0
    };

    public zoom: number = 1;
    public room: GameRoom;

    public maxZoom: number = 3;
    public minZoom: number = 0.5;

    constructor(room: GameRoom) {
        this.room = room;
    }

    public worldToScreen(point: { x: number, y: number }): { x: number, y: number } {
        return {
            x: (point.x + this.offset.x) * this.zoom,
            y: (point.y + this.offset.y) * this.zoom
        };
    }
}

interface iRenderable {
    render: (context: CanvasRenderingContext2D, camera: Camera) => void;
}