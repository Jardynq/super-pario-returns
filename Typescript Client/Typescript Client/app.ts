/// <reference path="./declarations.ts"/>

// Global variables
var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
var map: TileMap;
var room: GameRoom;
var lastTickCount: number = new Date().getTime();
var socket: Socket;

/**
 * Connect to the server
 */
window.onload = () => {
    //socket = new Socket("ws:188.176.12.23:1337/", () => {
    socket = new Socket("ws:192.168.0.20:1337/", () => {
        // Runs on succesful connection

        init();
        room = new GameRoom();
        step();
    });
};

/**
 * Initialises the game
 */
function init(): void {
    canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d");
    fixCanvas();

    window.addEventListener("resize", fixCanvas);
}

/**
 * Adapts canvas to screen size
 */
function fixCanvas(): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

/**
 * Main game loop
 */
function step() {
    // Calculate time scale to stay in sync with server
    var newTickCount:number = new Date().getTime();
    var elapsedMilliseconds:number = newTickCount - lastTickCount;
    var timeScale:number = elapsedMilliseconds / 1000;
    lastTickCount = newTickCount;

    room.step(timeScale);
    room.renderAll(ctx);

    // Request next frame
    window.requestAnimationFrame(step);
}