export class CanvasManager {
  public canvas!: HTMLCanvasElement;
  public ctx!: CanvasRenderingContext2D; // Context
  public hudCanvas!: HTMLCanvasElement;
  public hudCtx!: CanvasRenderingContext2D;
  public sideHudCanvas!: HTMLCanvasElement;
  public sideHudCtx!: CanvasRenderingContext2D;

  public initializeCanvas(canvasId: string, hudCanvasId: string, sideHudCanvasId: string): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const hudCanvas = document.getElementById(hudCanvasId) as HTMLCanvasElement;
    const sideHudCanvas = document.getElementById(sideHudCanvasId) as HTMLCanvasElement;

    this.validateCanvas([canvas, hudCanvas, sideHudCanvas]);

    this.canvas = canvas;
    this.hudCanvas = hudCanvas;
    this.sideHudCanvas = sideHudCanvas;

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const hudCtx = hudCanvas.getContext('2d') as CanvasRenderingContext2D;
    const sideHudCtx = sideHudCanvas.getContext('2d') as CanvasRenderingContext2D;

    this.validateContexts([ctx, hudCtx, sideHudCtx]);

    this.ctx = ctx;
    this.hudCtx = hudCtx;
    this.sideHudCtx = sideHudCtx;
  }

  public clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.hudCtx.clearRect(0, 0, this.hudCanvas.width, this.hudCanvas.height);
    this.sideHudCtx.clearRect(0, 0, this.sideHudCanvas.width, this.sideHudCanvas.height);
  }

  public getCanvasSize(): { width: number, height: number } {
    return { width: this.canvas.width, height: this.canvas.height };
  }

  private validateCanvas(arrayCanvas: HTMLCanvasElement[]): void {
    for (let i = 0; i < arrayCanvas.length; i++) {
      if (!arrayCanvas[i]) {
        throw new Error(`Invalid canvas Id for ${arrayCanvas[i]}`);
      }
    }
  }

  private validateContexts(arrayContext: CanvasRenderingContext2D[]): void {
    for (let i = 0; i < arrayContext.length; i++) {
      if (!arrayContext[i]) {
        throw new Error(`Invalid context for ${arrayContext[i]}`);
      }
    }
  }

  
}