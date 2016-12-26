var Input = (function () {
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


    /**
     * Checks if you scroll and will apply zoom
     * 
     */
    ns.onMouseWheel = function onMouseWheel (event) {
        // Max zoom
        if (room.render.zoom >= 2.25) {
            room.render.zoom = 2.25;
        } else if (room.render.zoom <= 0.75) {
            room.render.zoom = 0.75;
        }

        if (event.wheelDelta > 0) {
            room.render.zoom += 0.05;
        } else if (event.wheelDelta < 0) {
            room.render.zoom -= 0.05;
        }
    };

    return ns;
})();