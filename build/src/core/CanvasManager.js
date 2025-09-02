export class CanvasManager {
    canvas;
    ctx; // Context
    hudCanvas;
    hudCtx;
    constructor(canvas, ctx, hudCanvas, hudCtx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.hudCanvas = hudCanvas;
        this.hudCtx = hudCtx;
    }
    initializeCanvas(canvasId) {
    }
}
