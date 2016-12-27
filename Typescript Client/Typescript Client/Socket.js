var Socket = (function () {
    function Socket(url) {
        alert("TEST");
        this.socket = new WebSocket(url);
        this.socket.onmessage = this.onmessage;
        this.socket.onopen = this.onopen;
    }
    Socket.prototype.onmessage = function () {
    };
    Socket.prototype.onopen = function () {
        alert("We have a connection :)");
    };
    return Socket;
}());
//# sourceMappingURL=Socket.js.map