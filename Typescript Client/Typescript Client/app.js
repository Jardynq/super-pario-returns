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
        this.socket.binaryType = "arraybuffer";
    }
    Socket.prototype.onmessage = function (e) {
        var reader = new DataView(e.data);
        var packetType = reader.getUint8(0);
        if (this.packetHandlers[packetType] !== undefined) {
            this.packetHandlers[packetType](reader);
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
     * Sends a packet. The type must be encoded into the data
     */
    Socket.prototype.sendPacket = function (data) {
        this.socket.send(data.buffer);
    };
    ;
    return Socket;
}());
var PACKET_TYPE;
(function (PACKET_TYPE) {
    PACKET_TYPE[PACKET_TYPE["MAP"] = 0] = "MAP";
    PACKET_TYPE[PACKET_TYPE["JOIN"] = 1] = "JOIN";
    PACKET_TYPE[PACKET_TYPE["PLAYER_ACTION"] = 2] = "PLAYER_ACTION";
    PACKET_TYPE[PACKET_TYPE["ENTITY"] = 3] = "ENTITY";
})(PACKET_TYPE || (PACKET_TYPE = {}));
/// <reference path="./declarations.ts"/>
var GameRoom = (function () {
    function GameRoom() {
        this.entities = {};
        this.camera = new Camera(this);
        this.tilesize = 50;
        socket.registerHandler(PACKET_TYPE.MAP, this.loadMap.bind(this));
        socket.registerHandler(PACKET_TYPE.ENTITY, this.updateEntities.bind(this));
        socket.registerHandler(PACKET_TYPE.JOIN, this.onJoin.bind(this));
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
    GameRoom.prototype.loadMap = function (reader) {
        this.map = new TileMap();
        this.map.parseMapPacket(reader);
    };
    GameRoom.prototype.updateEntities = function (reader) {
        // The total number of entities in the game
        var entityCount = reader.getUint16(1, true);
        var offset = 3;
        for (var i = 0; i < entityCount; i++) {
            // The length in bytes of this entity
            var entityLength = reader.getUint8(offset);
            var entityData = reader.buffer.slice(offset, offset + entityLength + 1);
            var entityView = new DataView(entityData);
            var id = entityView.getUint16(1, true);
            offset += entityData.byteLength;
            if (this.entities[id] === undefined) {
                var type = entityView.getUint8(2);
                var entity;
                if (type === ENTITY_TYPE.PLAYER) {
                    entity = new PlayerEntity(Number(id), entityView);
                }
                else {
                    throw "Unknown entity recieved. Type is: " + type;
                }
                this.entities[id] = entity;
            }
            else {
                this.entities[id].update(entityView);
            }
        }
    };
    GameRoom.prototype.onJoin = function (reader) {
        var playerID = reader.getUint16(1, true);
        this.player = new MainPlayerEntity(playerID, reader);
        this.entities[playerID] = this.player;
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
    TileMap.prototype.parseMapPacket = function (reader) {
        // Get the width of the map
        this.width = reader.getUint8(1);
        // Start at two since byte 1 is the TYPE and byte 2 is the width
        for (var i = 2; i < reader.byteLength; i++) {
            var tileIndex = i - 2;
            var tileValue = reader.getUint8(i);
            var x = tileIndex % this.width;
            var y = (tileIndex - x) / this.width;
            this.height = y + 1; // This way the height will be set to the last y value
            if (tileValue == 0) {
                this.tiles[tileIndex] = new ColorTile(x, y, false, "blue");
            }
            else {
                this.tiles[tileIndex] = new ColorTile(x, y, true, "black");
            }
        }
    };
    TileMap.prototype.render = function (ctx, camera) {
        var xStart = camera.offset.x / camera.room.tilesize;
        var yStart = camera.offset.y / camera.room.tilesize;
        var screenWidth = ctx.canvas.width / camera.room.tilesize;
        var screenHeight = ctx.canvas.height / camera.room.tilesize;
        for (var x = Math.max(0, xStart); x < Math.min(xStart + screenWidth, this.width); x++) {
            for (var y = Math.max(0, yStart); y < Math.min(yStart + screenHeight, this.height); y++) {
                this.getTile(x, y).render(ctx, camera);
            }
        }
    };
    TileMap.prototype.getTile = function (x, y) {
        return this.tiles[y * this.width + x];
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
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    };
    return ColorTile;
}(Tile));
/// <reference path="./../declarations.ts"/>
var Entity = (function () {
    function Entity(id, data) {
        this.x = 0;
        this.y = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.width = 0;
        this.height = 0;
        this.id = id;
        this.update(data);
    }
    Entity.prototype.step = function (timeScale) {
        this.x += this.xSpeed * timeScale;
        this.y += this.ySpeed * timeScale;
    };
    Entity.prototype.update = function (data) {
        var offset = 4; // To compensate for LENGTH, ID and TYPE
        this.x = data.getInt16(offset, true);
        offset += 2;
        this.y = data.getInt16(offset, true);
        offset += 2;
        this.xSpeed = data.getInt16(offset, true);
        offset += 2;
        this.ySpeed = data.getInt16(offset, true);
        offset += 2;
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
var ENTITY_TYPE;
(function (ENTITY_TYPE) {
    ENTITY_TYPE[ENTITY_TYPE["PLAYER"] = 0] = "PLAYER";
})(ENTITY_TYPE || (ENTITY_TYPE = {}));
/// <reference path="./app.ts"/>
/// <reference path="./Socket.ts"/>
/// <reference path="./GameRoom.ts"/>
/// <reference path="./Render.ts"/>
/// <reference path="./Keyboard.ts"/>
/// <reference path="./Tile/TileMap.ts"/>
/// <reference path="./Tile/Tile.ts"/>
/// <reference path="./Entities/Entity.ts"/> 
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
var PlayerEntity = (function (_super) {
    __extends(PlayerEntity, _super);
    function PlayerEntity(id, entityData) {
        _super.call(this, id, entityData);
        this.height = 60;
        this.width = 30;
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
        _super.prototype.step.call(this, timeScale);
        var oldXSpeed = this.xSpeed;
        var oldYSpeed = this.ySpeed;
        if (Keyboard.isKeyDown("ArrowRight")) {
            this.xSpeed = 300;
        }
        else if (Keyboard.isKeyDown("ArrowLeft")) {
            this.xSpeed = -300;
        }
        else {
            this.xSpeed = 0;
        }
        if (Keyboard.isKeyDown("ArrowUp")) {
            this.ySpeed = -300;
        }
        else if (Keyboard.isKeyDown("ArrowDown")) {
            this.ySpeed = 300;
        }
        else {
            this.ySpeed = 0;
        }
        if (oldXSpeed != this.xSpeed || oldYSpeed != this.ySpeed) {
            var actionPacket = new DataView(new ArrayBuffer(5));
            actionPacket.setUint8(0, PACKET_TYPE.PLAYER_ACTION);
            actionPacket.setInt16(1, this.xSpeed, true);
            actionPacket.setInt16(3, this.ySpeed, true);
            socket.sendPacket(actionPacket);
        }
    };
    return MainPlayerEntity;
}(PlayerEntity));
//# sourceMappingURL=app.js.map