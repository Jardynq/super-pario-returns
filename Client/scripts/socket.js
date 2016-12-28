var Socket = (function () {
      var ns = {};
      ns.packetHandlers = {};
      ns.socket = null;

      /**
       * Creates a socket connection to the server
       * 
       */
      ns.connect = function (callback) {
            ns.socket = new WebSocket("ws:192.168.0.20");
            ns.socket.onmessage = ns.onMessage;
            ns.socket.onopen = callback;
            ns.socket.binaryType = "arraybuffer";
      };

      /**
       * Sends a packet with the specified type
       * 
       */
      ns.sendPacket = function (data) {
            ns.socket.send(data);
      };

      /**
       * Handles messages from the server
       * 
       */
      ns.onMessage = function(e) {
            var reader = new DataView(e.data);
            var type = reader.getUint8(0);
                  
            if (ns.packetHandlers[type] !== undefined) {
                  ns.packetHandlers[type][1].call(ns.packetHandlers[type][0], reader);
            } else {
                  // No handler exists for this packet type
            }
      };

      ns.registerHandler = function (packetType, handlerObject, handler) {
            ns.packetHandlers[packetType] = [handlerObject, handler];
      };

      ns.unregisterHandler = function (packetType) {
            delete ns.packetHandlers[packetType];
      };

      ns.PACKET_TYPES = {
            "map": 0,
            "join": 1,
            "playerAction": 2,
            "entity": 3,
            "ping": 4
      };

      return ns;
})();