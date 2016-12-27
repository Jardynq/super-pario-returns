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
      };

      /**
       * Sends a packet with the specified type
       * 
       */
      ns.sendPacket = function (packetType, data) {
            if (data === undefined) {
                  data = {};
            }

            var type = String(packetType + "          ").substr(0, 10);
            ns.socket.send(type + JSON.stringify(data));
      };

      /**
       * Handles messages from the server
       * 
       */
      ns.onMessage = function(e) {
            var packetType = e.data.substr(0, 10).trim();
            var packetData = e.data.substr(10);

            if (ns.packetHandlers[packetType] !== undefined) {
                  ns.packetHandlers[packetType][1].call(ns.packetHandlers[packetType][0], packetData);
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

      return ns;
})();