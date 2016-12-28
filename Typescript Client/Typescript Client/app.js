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
var PacketType;
(function (PacketType) {
    PacketType[PacketType["Map"] = 0] = "Map";
    PacketType[PacketType["Join"] = 1] = "Join";
    PacketType[PacketType["PlayerAction"] = 2] = "PlayerAction";
    PacketType[PacketType["Entity"] = 3] = "Entity";
    PacketType[PacketType["Ping"] = 4] = "Ping";
})(PacketType || (PacketType = {}));
/// <reference path="./declarations.ts"/>
var GameRoom = (function () {
    function GameRoom() {
        this.entities = {};
        this.camera = new Camera(this);
        // Related to syncronisation
        this.lastEntityUpdateLocalTimestamp = 0;
        this.lastEntityUpdateServertimestamp = 0;
        socket.registerHandler(PacketType.Map, this.loadMap.bind(this));
        socket.registerHandler(PacketType.Entity, this.updateEntities.bind(this));
        socket.registerHandler(PacketType.Join, this.onJoin.bind(this));
        socket.registerHandler(PacketType.Ping, function (reader) { return socket.sendPacket(reader); });
        window.addEventListener("wheel", this.onScroll.bind(this));
    }
    /**
     * Frame step
     * @param timeScale How long is this frame compared to a second
     */
    GameRoom.prototype.step = function (timeScale) {
        for (var id in this.entities) {
            this.entities[id].step(timeScale);
        }
        this.camera.step();
    };
    GameRoom.prototype.renderAll = function (ctx) {
        // Clear the canvas from previous rendering passes
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Update the camera
        if (this.player !== undefined) {
            this.camera.targetOffset.x = -this.player.x + (ctx.canvas.width * 0.5 / this.camera.zoom);
            this.camera.targetOffset.y = -this.player.y + (ctx.canvas.height * 0.5 / this.camera.zoom);
        }
        if (this.map !== undefined) {
            this.map.render(ctx, this.camera);
        }
        for (var id in this.entities) {
            this.entities[id].render(ctx, this.camera);
        }
    };
    /**
     * Handles scrolling
     */
    GameRoom.prototype.onScroll = function (e) {
        if (e.deltaY < 0) {
            this.camera.zoom = Math.min(this.camera.zoom * 1.1, this.camera.maxZoom);
        }
        else {
            this.camera.zoom = Math.max(this.camera.zoom / 1.1, this.camera.minZoom);
        }
    };
    GameRoom.prototype.loadMap = function (reader) {
        this.map = new TileMap(50);
        this.map.parseMapPacket(reader);
    };
    GameRoom.prototype.updateEntities = function (reader) {
        var timestamp = reader.getFloat64(1, true);
        // The total number of entities in the game
        var entityCount = reader.getUint16(9, true);
        var offset = 11;
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
                if (type === EntityType.Player) {
                    entity = new PlayerEntity(Number(id), this, entityView);
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
        Entity.Gravity = reader.getFloat32(1, true);
        Entity.MaxSpeed = reader.getFloat32(5, true);
        PlayerEntity.moveSpeed = reader.getInt16(9, true);
        PlayerEntity.jumpForce = reader.getInt16(11, true);
        var playerID = reader.getUint16(13, true);
        this.player = new MainPlayerEntity(playerID, this, reader);
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
        this.targetOffset = {
            x: 0,
            y: 0
        };
        this.zoom = 1;
        this.maxZoom = 3;
        this.minZoom = 0.5;
        this.room = room;
    }
    Camera.prototype.step = function () {
        this.offset.x += (this.targetOffset.x - this.offset.x) * 0.5;
        this.offset.y += (this.targetOffset.y - this.offset.y) * 0.5;
    };
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
    function TileMap(tilesize) {
        this.tiles = [];
        this.tilesize = tilesize;
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
        var xStart = Math.floor(-camera.offset.x / camera.room.map.tilesize);
        var yStart = Math.floor(-camera.offset.y / camera.room.map.tilesize);
        var screenWidth = ctx.canvas.width / camera.room.map.tilesize / camera.zoom + 1;
        var screenHeight = ctx.canvas.height / camera.room.map.tilesize / camera.zoom + 1;
        for (var x = Math.max(0, xStart); x < Math.min(xStart + screenWidth, this.width); x++) {
            for (var y = Math.max(0, yStart); y < Math.min(yStart + screenHeight, this.height); y++) {
                this.getTile(x, y).render(ctx, camera);
            }
        }
    };
    /**
     * Returns the tile at the specified tile coordinates (1.1, 1.2, 1.3 etc.)
     */
    TileMap.prototype.getTile = function (x, y) {
        if (x < 0 || x >= this.width)
            return null;
        if (y < 0 || y * this.width + x >= this.tiles.length)
            return null;
        return this.tiles[y * this.width + x];
    };
    /**
     * Returns the tile at the specified world coordinates
     */
    TileMap.prototype.getTileAt = function (x, y) {
        return this.getTile(Math.floor(x / this.tilesize), Math.floor(y / this.tilesize));
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
    function Tile(x, y, hasCollision) {
        this.x = x;
        this.y = y;
        this.hasCollision = hasCollision;
    }
    Tile.prototype.render = function (ctx, camera) {
    };
    return Tile;
}());
var ColorTile = (function (_super) {
    __extends(ColorTile, _super);
    function ColorTile(x, y, hasCollision, color) {
        _super.call(this, x, y, hasCollision);
        this.color = color;
    }
    ColorTile.prototype.render = function (ctx, camera) {
        var tilesize = camera.room.map.tilesize;
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
    function Entity(id, room, data) {
        this.x = 0;
        this.y = 0;
        // Used to smooth out entity movement by easing between states
        this.renderX = 0;
        this.renderY = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.width = 0;
        this.height = 0;
        this.onGround = false;
        this.hasGravity = false;
        this.id = id;
        this.room = room;
        this.update(data);
    }
    Entity.prototype.step = function (timeScale) {
        if (this.hasGravity) {
            this.ySpeed = Math.min(this.ySpeed + Entity.Gravity * timeScale, Entity.MaxSpeed);
        }
        this.onGround = false;
        this.x += this.xSpeed * timeScale;
        this.HandleCollision(true);
        this.y += this.ySpeed * timeScale;
        this.HandleCollision(false);
        this.renderX += (this.x - this.renderX) * 0.5;
        this.renderY += (this.y - this.renderY) * 0.5;
    };
    Entity.prototype.update = function (data) {
        var offset = 4; // To compensate for LENGTH, ID and TYPE
        this.x = data.getInt16(offset, true);
        offset += 2;
        this.y = data.getInt16(offset, true);
        offset += 2;
        this.xSpeed = data.getFloat32(offset, true);
        offset += 4;
        this.ySpeed = data.getFloat32(offset, true);
        offset += 4;
    };
    Entity.prototype.HandleCollision = function (x) {
        var speed = x ? this.xSpeed : this.ySpeed;
        var collisionTiles = [];
        collisionTiles.push(this.room.map.getTileAt(this.x - this.width * 0.5 + 0.3, this.y - this.height * 0.5 + 0.3));
        collisionTiles.push(this.room.map.getTileAt(this.x + this.width * 0.5 - 0.3, this.y - this.height * 0.5 + 0.3));
        collisionTiles.push(this.room.map.getTileAt(this.x - this.width * 0.5 + 0.3, this.y + this.height * 0.5 - 0.3));
        collisionTiles.push(this.room.map.getTileAt(this.x + this.width * 0.5 - 0.3, this.y + this.height * 0.5 - 0.3));
        collisionTiles.push(this.room.map.getTileAt(this.x - this.width * 0.5 + 0.3, this.y));
        collisionTiles.push(this.room.map.getTileAt(this.x + this.width * 0.5 - 0.3, this.y));
        for (var i = 0; i < collisionTiles.length; i++) {
            var tile = collisionTiles[i];
            if (tile != null && tile.hasCollision) {
                if (x) {
                    if (speed > 0) {
                        this.x = tile.x * this.room.map.tilesize - this.width * 0.5;
                    }
                    else if (speed < 0) {
                        this.x = tile.x * this.room.map.tilesize + this.room.map.tilesize + this.width * 0.5;
                    }
                    this.xSpeed = 0;
                }
                else {
                    if (speed > 0) {
                        this.y = tile.y * this.room.map.tilesize - this.height * 0.5;
                        this.onGround = true;
                    }
                    else if (speed < 0) {
                        this.y = tile.y * this.room.map.tilesize + this.room.map.tilesize + this.height * 0.5;
                    }
                    this.ySpeed = 0;
                }
            }
        }
    };
    Entity.prototype.render = function (ctx, camera) {
        ctx.beginPath();
        ctx.rect((this.renderX + camera.offset.x - this.width * 0.5) * camera.zoom, (this.renderY + camera.offset.y - this.height * 0.5) * camera.zoom, this.width * camera.zoom, this.height * camera.zoom);
        ctx.fillStyle = this.color;
        ctx.stroke();
        ctx.fill();
    };
    // Constants
    Entity.Gravity = 100;
    Entity.MaxSpeed = 100;
    return Entity;
}());
var EntityType;
(function (EntityType) {
    EntityType[EntityType["Player"] = 0] = "Player";
})(EntityType || (EntityType = {}));
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
var socket = new Socket("ws:192.168.0.16/", function () {
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
    function PlayerEntity(id, room, entityData) {
        _super.call(this, id, room, entityData);
        this.hasGravity = true;
        this.height = 60;
        this.width = 30;
        this.color = "aquaMarine";
    }
    PlayerEntity.moveSpeed = 0;
    PlayerEntity.jumpForce = 0;
    return PlayerEntity;
}(Entity));
/**
 * The entity of the controlled player
 */
var MainPlayerEntity = (function (_super) {
    __extends(MainPlayerEntity, _super);
    function MainPlayerEntity(id, room, entityData) {
        _super.call(this, id, room, entityData);
        this.color = "red";
    }
    MainPlayerEntity.prototype.step = function (timeScale) {
        _super.prototype.step.call(this, timeScale);
        // Prepare a packet in case it should be sent
        var actionPacket = new DataView(new ArrayBuffer(3));
        actionPacket.setUint8(0, PacketType.PlayerAction);
        if (Keyboard.isKeyDown("ArrowLeft")) {
            if (this.xSpeed != -PlayerEntity.moveSpeed) {
                this.xSpeed = -PlayerEntity.moveSpeed;
                actionPacket.setUint8(1, PlayerActionType.MoveLeft);
                socket.sendPacket(actionPacket);
            }
        }
        else if (Keyboard.isKeyDown("ArrowRight")) {
            if (this.xSpeed != PlayerEntity.moveSpeed) {
                this.xSpeed = PlayerEntity.moveSpeed;
                actionPacket.setUint8(1, PlayerActionType.MoveRight);
                socket.sendPacket(actionPacket);
            }
        }
        else if (this.xSpeed != 0) {
            this.xSpeed = 0;
            actionPacket.setUint8(1, PlayerActionType.StopMove);
            socket.sendPacket(actionPacket);
        }
        if (Keyboard.isKeyDown("ArrowUp") && this.onGround) {
            this.ySpeed = -PlayerEntity.jumpForce;
            actionPacket = new DataView(new ArrayBuffer(3));
            actionPacket.setUint8(0, PacketType.PlayerAction);
            actionPacket.setUint8(1, PlayerActionType.Jump);
            socket.sendPacket(actionPacket);
        }
    };
    return MainPlayerEntity;
}(PlayerEntity));
var PlayerActionType;
(function (PlayerActionType) {
    PlayerActionType[PlayerActionType["MoveLeft"] = 0] = "MoveLeft";
    PlayerActionType[PlayerActionType["MoveRight"] = 1] = "MoveRight";
    PlayerActionType[PlayerActionType["StopMove"] = 2] = "StopMove";
    PlayerActionType[PlayerActionType["Jump"] = 3] = "Jump";
})(PlayerActionType || (PlayerActionType = {}));
//# sourceMappingURL=app.js.map