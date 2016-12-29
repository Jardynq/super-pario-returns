class Input {
    private static keys: { [keyCode: string]: boolean } = {};
    private static initialized: boolean = false;

    public static mouseX: number = 0;
    public static mouseY: number = 0;

    /**
     * Adds necessary event listeners
     */
    public static init(): void {
        if (!Input.initialized) {
            window.addEventListener("keydown", Input.onKeyDown);
            window.addEventListener("keyup", Input.onKeyUp);
            window.addEventListener("mousemove", Input.onMouseMove);
            Input.initialized = true;
        }
    }

    /**
     * Handles keydown events and updates keystates
     */
    private static onKeyDown = function (e) {
        Input.keys[e.code] = true;
    }

    /**
     * Handles keyup events and updates keystates
     */
    private static onKeyUp = function (e) {
        delete Input.keys[e.code];
    }

    /**
     * Updates the ingame mouse position
     */
    private static onMouseMove = function (e: MouseEvent) {
        Input.mouseX = e.clientX;
        Input.mouseY = e.clientY;
    }

    /**
     * Tells whether the key is currently being pressed
     */
    public static isKeyDown = function (keyCode: string) {
        return Input.keys[keyCode] === true;
    }
}

window.addEventListener("load", Input.init);