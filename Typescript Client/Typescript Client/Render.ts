class Camera {
    public offset: {
        x: number,
        y: number
    } = {
        x: 0,
        y: 0
    };

    public zoom: number = 1;
}

interface iRenderable {
    render: (context: CanvasRenderingContext2D, camera: Camera) => void;
}