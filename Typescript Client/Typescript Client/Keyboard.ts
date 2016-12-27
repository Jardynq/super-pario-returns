class Keyboard {
    private static keys: { [keyCode: string]: boolean } = {};
    private static initialized: boolean = false;

    /**
     * Adds necessary event listeners
     */
    public static init(): void {
        if (!Keyboard.initialized) {
            window.addEventListener("keydown", Keyboard.onKeyDown);
            window.addEventListener("keyup", Keyboard.onKeyUp);
            Keyboard.initialized = true;
        }
    }

    /**
     * Handles keydown events and updates keystates
     */
    private static onKeyDown = function (e) {
        Keyboard.keys[e.code] = true;
    }

    /**
     * Handles keyup events and updates keystates
     */
    private static onKeyUp = function (e) {
        delete Keyboard.keys[e.code];
    }

    /**
     * Tells whether the key is currently being pressed
     */
    public static isKeyDown = function (keyCode: string) {
        return Keyboard.keys[keyCode] === true;
    }
}

window.addEventListener("load", Keyboard.init);