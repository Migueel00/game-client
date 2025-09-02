import { Game } from "./constants.js";
import { CanvasManager } from "./core/CanvasManager.js";

export class GameState {
  // Canvas y contextos
  private canvasManager!: CanvasManager;

  // Estado del juego
  public gameState: number = Game.INVALID;

  // Tiempo
  public previousCycleMiliseconds: number = -1;
  public deltaTime: number = 0;
  public cicleRealTime: number = 0;
  public frameTimeObj: number = 0;

  // Debug
  public txtPruebas: any = {};

  // Assets
  public assetsToLoad: any[] = [];
  public assetsLoaded: number = 0;

  // Sprites
  public sprites: any[] = [];
  public storySprites: any[] = [];
  public controlSprites: any[] = [];
  public spritesHUD: any[] = [];
  public spritesNewGame: any[] = [];

  // Datos de imagen
  public tileSets: any[] = [];

  // Nivel
  public level: any = {};
  public obstacles: any = {};
  public action: any = {};

  // Juego
  public life: number = 0;
  public points: number = 0;

  // Timers
  public shootTimer: any = {};
  public levelTimer: any = {};
  public fireworkTimer: any = {};
  public potionsTimers: any = {};
  public damagePotionTimer: any = {};
  public enemiesTimers: any = {};
  public menuTimer: any = {};
  public gameOverTimer: any = {};

  // Cámara
  public camera: any = {};

  // Partículas y efectos
  public particles: any[] = [];
  public score: any[] = [];

  // Usuario
  public username: string = "";

  // Auxiliares
  public aux: number = 0;
  public auxName: number = 0;

  // Sonidos
  public sounds: any[] = [];
  public currentSound: number = -1;

  constructor() {
    // Los canvas se inicializarán después mediante métodos específicos
  }

  public initializeCanvas(): void {
    this.canvasManager = new CanvasManager();
    this.canvasManager.initializeCanvas('gameScreen', 'gameHUD', 'sideGameHud');

    // Configurar anti-aliasing
    this.canvasManager.ctx.imageSmoothingEnabled = false;
  }

  public clearAllCanvas(): void {
    this.canvasManager.clearCanvas();
  }

  public getCanvasSize() {
    return this.canvasManager.getCanvasSize();
  }

  // Método para resetear el estado del juego
  public reset(): void {
    this.life = 0;
    this.points = 0;
    this.sprites = [];
    this.particles = [];
    this.score = [];
    this.username = "";
    this.aux = 0;
    this.auxName = 0;
    this.currentSound = -1;
    // Resetear otros valores según necesites
  }

  // Getters para acceso a canvas (para compatibilidad con código existente)
  public get canvas(): HTMLCanvasElement {
    return this.canvasManager.canvas;
  }

  public get ctx(): CanvasRenderingContext2D {
    return this.canvasManager.ctx;
  }

  public get canvasHUD(): HTMLCanvasElement {
    return this.canvasManager.hudCanvas;
  }

  public get ctxHUD(): CanvasRenderingContext2D {
    return this.canvasManager.hudCtx;
  }

  public get canvasHUD2(): HTMLCanvasElement {
    return this.canvasManager.sideHudCanvas;
  }

  public get ctxHUD2(): CanvasRenderingContext2D {
    return this.canvasManager.sideHudCtx;
  }
}

// Instancia singleton del estado del juego
export const gameState = new GameState();
