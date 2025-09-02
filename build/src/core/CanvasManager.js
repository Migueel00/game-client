export class CanvasManager {
    canvas;
    ctx; // Context
    hudCanvas;
    hudCtx;
    sideHudCanvas;
    sideHudCtx;
    initializeCanvas(canvasId, hudCanvasId, sideHudCanvasId) {
        const canvas = document.getElementById(canvasId);
        const hudCanvas = document.getElementById(hudCanvasId);
        const sideHudCanvas = document.getElementById(sideHudCanvasId);
        this.validateCanvas([canvas, hudCanvas, sideHudCanvas]);
        this.canvas = canvas;
        this.hudCanvas = hudCanvas;
        this.sideHudCanvas = sideHudCanvas;
        const ctx = canvas.getContext('2d');
        const hudCtx = hudCanvas.getContext('2d');
        const sideHudCtx = sideHudCanvas.getContext('2d');
        this.validateContexts([ctx, hudCtx, sideHudCtx]);
        this.ctx = ctx;
        this.hudCtx = hudCtx;
        this.sideHudCtx = sideHudCtx;
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.hudCtx.clearRect(0, 0, this.hudCanvas.width, this.hudCanvas.height);
        this.sideHudCtx.clearRect(0, 0, this.sideHudCanvas.width, this.sideHudCanvas.height);
    }
    getCanvasSize() {
        return { width: this.canvas.width, height: this.canvas.height };
    }
    validateCanvas(arrayCanvas) {
        for (let i = 0; i < arrayCanvas.length; i++) {
            if (!arrayCanvas[i]) {
                throw new Error(`Invalid canvas Id for ${arrayCanvas[i]}`);
            }
        }
    }
    validateContexts(arrayContext) {
        for (let i = 0; i < arrayContext.length; i++) {
            if (!arrayContext[i]) {
                throw new Error(`Invalid context for ${arrayContext[i]}`);
            }
        }
    }
}
