var Input = (function () {
    var ns = {};
    var keys = {};

    /**
     * Handles keydown events and updates keystates
     * 
     */
    ns.onKeyDown = function (e) {
        keys[e.code] = true;
    };

    /**
     * Handles keyup events and updates keystates
     * 
     */
    ns.onKeyUp = function (e) {
        delete keys[e.code];
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