/**
 * Sends a packet with the specified type
 * 
 */
function sendPacket (packetType, data) {
      if (data === undefined) {
            data = {};
      }

      var type = String(packetType + "          ").substr(0, 10);
      socket.send(type + JSON.stringify(data));
}

/**
 * Handles messages from the server
 * 
 */
function onMessage(e) {
      console.log(e);

      var packetType = e.data.split(" ");
      var packetData = e.data.substr(10);

      if (packetType[0] === "map") {
            secondInit(packetData);
      }
}