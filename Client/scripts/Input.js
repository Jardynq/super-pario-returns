var Keyboard = (function () {
    var ns = {};
    var keys = {};

    /**
     * Handles keydown events and updates keystates
     * 
     */
    ns.onKeyDown = function (event) {
        keys[event.code] = true; 
    };

    /**
     * Handles keyup events and updates keystates
     * 
     */
    ns.onKeyUp = function (event) {
        delete keys[event.code];
    };

    /**
     * Check whether a given key is down
     * 
     */
    ns.isKeyDown = function isKeyDown (code) {
        return keys[code] === true;
    };

    return ns;
})();