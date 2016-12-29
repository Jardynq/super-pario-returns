var Input = (function () {
    var ns = {};
    var keys = {};
    ns.isMouseDown = false;
    ns.mouseX = 0;
    ns.mouseY = 0;


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

    ns.onMouseDown = function () {
        ns.isMouseDown = true;
    };
    ns.onMouseUp = function () {
        ns.isMouseDown = false;       
    };
    ns.onMouseMove = function (e) {
      ns.mouseX = e.clientX;
      ns.mouseY = e.clientY;
    };

    return ns;
})();