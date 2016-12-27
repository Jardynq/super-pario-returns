/// <reference path="./app.ts"/>
var Socket = (function () {
    function Socket(url, callback) {
        this.packetHandlers = {};
        this.unregisterHandler = function (packetType) {
            delete this.packetHandlers[packetType];
        };
        this.socket = new WebSocket(url);
        this.socket.onmessage = this.onmessage.bind(this);
        this.socket.onopen = callback;
    }
    Socket.prototype.onmessage = function (e) {
        var packetType = e.data.substr(0, 10).trim();
        var packetData = e.data.substr(10);
        if (this.packetHandlers[packetType] !== undefined) {
            this.packetHandlers[packetType](packetData);
        }
        else {
            // No handler exists for this packet type
            throw "Unknown packet recieved. Type is: " + packetType;
        }
    };
    Socket.prototype.registerHandler = function (packetType, handler) {
        this.packetHandlers[packetType] = handler;
    };
    ;
    return Socket;
}());
/// <reference path="./../app.ts"/>
var TileMap = (function () {
    function TileMap() {
        this.tiles = [];
    }
    TileMap.prototype.parseMapPacketData = function (packetData) {
        var rows = packetData.split('|');
        // Get the width of the map
        this.width = rows[0].split(',').length;
        // Generate the map from the supplied string
        for (var y = 0; y < rows.length; y++) {
            var columns = rows[y].split(',');
            for (var x = 0; x < columns.length; x++) {
                var tileData = columns[x];
                if (tileData == "0") {
                    this.tiles[y * this.width + x] = new ColorTile(x, y, false, "blue");
                }
                else if (tileData == "1") {
                    this.tiles[y * this.width + x] = new ColorTile(x, y, true, "black");
                }
            }
        }
    };
    TileMap.prototype.render = function (ctx, camera) {
        // TODO: Only render tiles on screen
        for (var i = 0; i < this.tiles.length; i++) {
            this.tiles[i].render(ctx, camera);
        }
    };
    return TileMap;
}());
var GameRoom = (function () {
    function GameRoom() {
        /// <reference path="./Entities/Entity.ts"/>
        /// <reference path="./app.ts"/>
        this.entities = {};
        this.camera = new Camera();
        socket.registerHandler("map", this.loadMap.bind(this));
    }
    ;
    /**
     * Frame step
     * @param timeScale How long is this frame compared to a second
     */
    GameRoom.prototype.step = function (timeScale) {
        for (var id in this.entities) {
            this.entities[id].step(timeScale);
        }
    };
    GameRoom.prototype.renderAll = function (ctx) {
        // Clear the canvas from previous rendering passes
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (this.map !== undefined) {
            this.map.render(ctx, this.camera);
        }
    };
    GameRoom.prototype.loadMap = function (packetData) {
        this.map = new TileMap();
        this.map.parseMapPacketData(packetData);
    };
    return GameRoom;
}());
/// <reference path="./Socket.ts"/>
/// <reference path="./Tile/TileMap.ts"/>
/// <reference path="./GameRoom.ts"/>
// Global variables
var TILE_SIZE = 50;
var canvas;
var ctx;
var map;
var room;
var lastTickCount = new Date().getTime();
/**
 * Connect to the server
 */
var socket = new Socket("ws:localhost/", function () {
    // Runs on succesful connection
    init();
    room = new GameRoom();
    step();
});
/**
 * Initialises the game
 */
function init() {
    canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");
    fixCanvas();
    window.addEventListener("resize", fixCanvas);
}
/**
 * Adapts canvas to screen size
 */
function fixCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
/**
 * Main game loop
 */
function step() {
    // Calculate time scale to stay in sync with server
    var newTickCount = new Date().getTime();
    var elapsedMilliseconds = newTickCount - lastTickCount;
    var timeScale = elapsedMilliseconds / 1000;
    lastTickCount = newTickCount;
    room.step(timeScale);
    room.renderAll(ctx);
    // Request next frame
    window.requestAnimationFrame(step);
}
var Entity = (function () {
    function Entity() {
    }
    Entity.prototype.step = function (timeScale) {
    };
    return Entity;
}());
var Camera = (function () {
    function Camera() {
        this.offset = {
            x: 0,
            y: 0
        };
        this.zoom = 1;
    }
    return Camera;
}());
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Tile = (function () {
    function Tile(x, y, collision) {
        this.x = x;
        this.y = y;
        this.collision = collision;
    }
    Tile.prototype.render = function (ctx, camera) {
    };
    return Tile;
}());
var ColorTile = (function (_super) {
    __extends(ColorTile, _super);
    function ColorTile(x, y, collision, color) {
        _super.call(this, x, y, collision);
        this.color = color;
    }
    ColorTile.prototype.render = function (ctx, camera) {
        ctx.beginPath();
        ctx.rect((this.x * TILE_SIZE + camera.offset.x) * camera.zoom, (this.y * TILE_SIZE + camera.offset.y) * camera.zoom, TILE_SIZE * camera.zoom, TILE_SIZE * camera.zoom);
        ctx.fillStyle = this.color;
        ctx.stroke();
        ctx.fill();
    };
    return ColorTile;
}(Tile));
//# sourceMappingURL=app.js.map