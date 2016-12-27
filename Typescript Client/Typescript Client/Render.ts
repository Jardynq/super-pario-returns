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

    constructor(room: GameRoom) {
        this.room = room;
    }
}

interface iRenderable {
    render: (context: CanvasRenderingContext2D, camera: Camera) => void;
}