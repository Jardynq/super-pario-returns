/// <reference path="./declarations.ts"/>

class Camera {
    public offset: {
        x: number,
        y: number
    } = {
        x: 0,
        y: 0
    };

    public zoom: number = 1;
    public room: GameRoom;

    public maxZoom: number = 3;
    public minZoom: number = 0.5;

    constructor(room: GameRoom) {
        this.room = room;
    }

    public worldToScreen(point: Vec2D): Vec2D {
        return new Vec2D(
            (point.x + this.offset.x) * this.zoom,
            (point.y + this.offset.y) * this.zoom
        );
    }

    public screenToWorld(point: Vec2D): Vec2D {
        return new Vec2D(
            point.x / this.zoom - this.offset.x,
            point.y / this.zoom - this.offset.y
        );
    }
}

class EasingFunction {
    public static CubicIn(x, start, easingAmount, duration) {
        if (x > 0) {
            return Math.pow(x / duration, easingAmount) + start;
        } else {
            return -(Math.pow(x / duration, easingAmount) + start);
        }
    }
}

interface iRenderable {
    render: (context: CanvasRenderingContext2D, camera: Camera) => void;
}

class Vec2D {
    public x: number;
    public y: number;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    public clone(): Vec2D {
        return new Vec2D(this.x, this.y);
    }

    public add(vec: Vec2D): Vec2D {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    public sub(vec: Vec2D): Vec2D {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    }

    public scale(factor: number): Vec2D {
        this.x *= factor;
        this.y *= factor;
        return this;
    }

    public getLengthSquared(): number {
        return this.x * this.x + this.y * this.y;
    }

    public getLength(): number {
        return Math.sqrt(this.getLengthSquared());
    }

    public normalize(): Vec2D {
        var length = this.getLength();
        this.x /= length;
        this.y /= length;
        return this;
    }
}