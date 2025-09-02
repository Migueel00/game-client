import { Game } from "./constants.js";
import { AssetManager } from "./core/AssetManager.js";
import { CanvasManager } from "./core/CanvasManager.js";
import { SceneManager } from "./core/SceneManager.js";
import { MenuScene } from "./scenes/MenuScene.js";

export class GameState {
  // Canvas y contextos
  private canvasManager!: CanvasManager;
  private assetManager!: AssetManager;
  private sceneManager!: SceneManager;

  // Estado del juego
  public gameState: number = Game.INVALID;

  // Tiempo
  public previousCycleMiliseconds: number = -1;
  public deltaTime: number = 0;
  public cicleRealTime: number = 0;
  public frameTimeObj: number = 0;

  // Debug
  public txtPruebas: any = {};


  // Sprites
  public sprites: any[] = [];
  public storySprites: any[] = [];
  public controlSprites: any[] = [];
  public spritesHUD: any[] = [];
  public spritesNewGame: any[] = [];


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

  // Métodos del SceneManager
  public initializeScenes(): void {
    this.sceneManager = new SceneManager();
    
    // Crear y registrar la escena de menú
    const menuScene = new MenuScene();
    this.sceneManager.addScene("menu", menuScene);
    
    // Comenzar con la escena de menú
    this.sceneManager.switchToScene("menu");
  }

  public updateCurrentScene(deltaTime: number): void {
    if (this.sceneManager) {
      this.sceneManager.update(deltaTime);
    }
  }

  public renderCurrentScene(): void {
    if (this.sceneManager) {
      this.sceneManager.render();
    }
  }

  public handleSceneInput(event: KeyboardEvent): void {
    if (this.sceneManager) {
      this.sceneManager.handleInput(event);
    }
  }

  public switchToScene(sceneName: string): void {
    if (this.sceneManager) {
      this.sceneManager.switchToScene(sceneName);
    }
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

  public initializeAssets(): void {
    this.assetManager = new AssetManager();

    // Configurar los assets que cargar
    this.assetManager.addImage('spritesheet', './images/spritesheet4-0-0.png');
    this.assetManager.addImage('map', './images/Mapa_Final.png');
    this.assetManager.addSound('gameMusic', 'gameMusic');
  }

  public async loadAssets(): Promise<void> {
    await this.assetManager.loadAllAssets();
  }

  // Getters para compatibilidad (reemplazar arrays tileSets y sounds)
  public getSpriteSheet(): HTMLImageElement {
    return this.assetManager.getSpriteSheet();
  }

  public getMapImage(): HTMLImageElement {
    return this.assetManager.getMapImage();
  }

  public getGameMusic(): HTMLAudioElement {
    return this.assetManager.getGameMusic();
  }

  public getAssetsLoadingProgress(): number {
    return this.assetManager.getLoadingProgress();
  }
}

// Instancia singleton del estado del juego
export const gameState = new GameState();
