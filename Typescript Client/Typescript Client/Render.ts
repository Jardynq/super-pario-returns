/// <reference path="./declarations.ts"/>

class Camera {
    public offset: {
        x: number,
        y: number
    } = {
        x: 0,
        y: 0
    };

    public targetOffset: {
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

    public step() {
        this.offset.x += (this.targetOffset.x - this.offset.x) * 0.5;
        this.offset.y += (this.targetOffset.y - this.offset.y) * 0.5;
    }
}

interface iRenderable {
    render: (context: CanvasRenderingContext2D, camera: Camera) => void;
}