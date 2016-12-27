/// <reference path="./declarations.ts"/>
// Global variables
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
/// <reference path="./declarations.ts"/>
var GameRoom = (function () {
    function GameRoom() {
        this.entities = {};
        this.camera = new Camera(this);
        this.tilesize = 50;
        socket.registerHandler("map", this.loadMap.bind(this));
        socket.registerHandler("entity", this.updateEntities.bind(this));
        socket.registerHandler("join", this.onJoin.bind(this));
    }
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
        for (var id in this.entities) {
            this.entities[id].render(ctx, this.camera);
        }
    };
    GameRoom.prototype.loadMap = function (packetData) {
        this.map = new TileMap();
        this.map.parseMapPacketData(packetData);
    };
    GameRoom.prototype.updateEntities = function (entityString) {
        var entityData = JSON.parse(entityString).Entities;
        for (var id in entityData) {
            var ent = entityData[id];
            if (this.entities[id] === undefined) {
                var entityType = ent.Type;
                var entity;
                if (entityType === "player") {
                    entity = new PlayerEntity(Number(id), entityData);
                }
                else {
                    throw "Unknown entity recieved. Type is: " + ent.Type;
                }
                this.entities[id] = entity;
            }
            else {
                this.entities[id].update(ent);
            }
        }
    };
    GameRoom.prototype.onJoin = function (dataString) {
        var joinData = JSON.parse(dataString);
        var playerID = joinData.PlayerEntityID;
        this.player = new MainPlayerEntity(playerID, this.entities[joinData.PlayerEntityID].toEntityData());
        this.entities[joinData.PlayerEntityID] = this.player;
    };
    return GameRoom;
}());
/// <reference path="./declarations.ts"/>
var Camera = (function () {
    function Camera(room) {
        this.offset = {
            x: 0,
            y: 0
        };
        this.zoom = 1;
        this.room = room;
    }
    return Camera;
}());
var Keyboard = (function () {
    function Keyboard() {
    }
    /**
     * Adds necessary event listeners
     */
    Keyboard.init = function () {
        if (!Keyboard.initialized) {
            window.addEventListener("keydown", Keyboard.onKeyDown);
            window.addEventListener("keyup", Keyboard.onKeyUp);
            Keyboard.initialized = true;
        }
    };
    Keyboard.keys = {};
    Keyboard.initialized = false;
    /**
     * Handles keydown events and updates keystates
     */
    Keyboard.onKeyDown = function (e) {
        Keyboard.keys[e.code] = true;
    };
    /**
     * Handles keyup events and updates keystates
     */
    Keyboard.onKeyUp = function (e) {
        delete Keyboard.keys[e.code];
    };
    /**
     * Tells whether the key is currently being pressed
     */
    Keyboard.isKeyDown = function (keyCode) {
        return Keyboard.keys[keyCode] === true;
    };
    return Keyboard;
}());
window.addEventListener("load", Keyboard.init);
/// <reference path="./../declarations.ts"/>
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
/// <reference path="./../declarations.ts"/>
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
        var tilesize = camera.room.tilesize;
        ctx.beginPath();
        ctx.rect((this.x * tilesize + camera.offset.x) * camera.zoom, (this.y * tilesize + camera.offset.y) * camera.zoom, tilesize * camera.zoom, tilesize * camera.zoom);
        ctx.fillStyle = this.color;
        ctx.stroke();
        ctx.fill();
    };
    return ColorTile;
}(Tile));
/// <reference path="./../declarations.ts"/>
var Entity = (function () {
    function Entity(id, entityData) {
        this.id = id;
        this.update(entityData);
    }
    Entity.prototype.step = function (timeScale) {
        this.x += this.xSpeed * timeScale;
        this.y += this.ySpeed * timeScale;
    };
    Entity.prototype.update = function (entityData) {
        this.x = Number(entityData.X);
        this.y = Number(entityData.Y);
        this.xSpeed = Number(entityData.XSpeed);
        this.ySpeed = Number(entityData.YSpeed);
        this.width = Number(entityData.Width);
        this.height = Number(entityData.Height);
    };
    Entity.prototype.toEntityData = function () {
        var output = {};
        output.X = this.x;
        output.Y = this.y;
        output.xSpeed = this.xSpeed;
        output.ySpeed = this.ySpeed;
        output.width = this.width;
        output.height = this.height;
        return output;
    };
    Entity.prototype.render = function (ctx, camera) {
        ctx.beginPath();
        ctx.rect((this.x + camera.offset.x) * camera.zoom, (this.y + camera.offset.y) * camera.zoom, this.width * camera.zoom, this.height * camera.zoom);
        ctx.fillStyle = this.color;
        ctx.stroke();
        ctx.fill();
    };
    return Entity;
}());
/// <reference path="./app.ts"/>
/// <reference path="./Socket.ts"/>
/// <reference path="./GameRoom.ts"/>
/// <reference path="./Render.ts"/>
/// <reference path="./Keyboard.ts"/>
/// <reference path="./Tile/TileMap.ts"/>
/// <reference path="./Tile/Tile.ts"/>
/// <reference path="./Entities/Entity.ts"/> 
/// <reference path="./declarations.ts"/>
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
    /**
     * Sends a packet with the specified type
     */
    Socket.prototype.sendPacket = function (packetType, data) {
        if (data === undefined) {
            data = {};
        }
        var dataString;
        if (typeof data === "string") {
            dataString = data;
        }
        else {
            dataString = JSON.stringify(data);
        }
        var type = String(packetType + "          ").substr(0, 10);
        this.socket.send(type + dataString);
    };
    ;
    return Socket;
}());
var PlayerEntity = (function (_super) {
    __extends(PlayerEntity, _super);
    function PlayerEntity(id, entityData) {
        _super.call(this, id, entityData);
        this.color = "aquaMarine";
    }
    return PlayerEntity;
}(Entity));
/**
 * The entity of the controlled player
 */
var MainPlayerEntity = (function (_super) {
    __extends(MainPlayerEntity, _super);
    function MainPlayerEntity(id, entityData) {
        _super.call(this, id, entityData);
        this.color = "red";
    }
    MainPlayerEntity.prototype.step = function (timeScale) {
        if (Keyboard.isKeyDown("ArrowRight")) {
            this.xSpeed = 100;
        }
        else if (Keyboard.isKeyDown("ArrowLeft")) {
            this.xSpeed = -100;
        }
        else {
            this.xSpeed = 0;
        }
        if (Keyboard.isKeyDown("ArrowUp")) {
            this.ySpeed = -100;
        }
        else if (Keyboard.isKeyDown("ArrowDown")) {
            this.ySpeed = 100;
        }
        else {
            this.ySpeed = 0;
        }
        // Player Actions
        socket.sendPacket("playerAct", {
            xSpeed: this.xSpeed,
            ySpeed: this.ySpeed
        });
    };
    return MainPlayerEntity;
}(PlayerEntity));
//# sourceMappingURL=app.js.map