export class CanvasManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D; // Context
  private hudCanvas : HTMLCanvasElement;
  private hudCtx: CanvasRenderingContext2D;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    hudCanvas: HTMLCanvasElement,
    hudCtx: CanvasRenderingContext2D
  ){
    this.canvas = canvas;
    this.ctx = ctx;
    this.hudCanvas = hudCanvas;
    this.hudCtx = hudCtx;
  }

  public initializeCanvas(canvasId: string) : void{
    
  }
}