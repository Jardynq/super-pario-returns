/// <reference path="./declarations.ts"/>

class Socket {
    private socket: WebSocket;
    private packetHandlers: { [packetType: number]: (reader: DataView) => void } = {};

    constructor(url: string, callback: () => void) {
        this.socket = new WebSocket(url);
        this.socket.onmessage = this.onmessage.bind(this);
        this.socket.onopen = callback;
        this.socket.binaryType = "arraybuffer";
    }

    private onmessage(e: MessageEvent): void {
        var reader = new DataView(e.data);
        var packetType = reader.getUint8(0);

        if (this.packetHandlers[packetType] !== undefined) {
            this.packetHandlers[packetType](reader);
        } else {
            // No handler exists for this packet type
            throw "Unknown packet recieved. Type is: " + packetType;
        }
    }

    public registerHandler(packetType: PacketType, handler: (reader: DataView) => void): void {
        this.packetHandlers[packetType] = handler;
    }

    public unregisterHandler = function (packetType: PacketType): void {
        delete this.packetHandlers[packetType];
    }

    /**
     * Sends a packet. The type must be encoded into the data
     */
    public sendPacket(data: DataView): void {
        this.socket.send(data.buffer);
    };
}

enum PacketType {
    Map,
    Join,
    PlayerAction,
    Entity,
    Ping,
    PlayerUpdate,
    PlayerShoot
}