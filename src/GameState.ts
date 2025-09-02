import { Game } from "./constants.js";

export class GameState {
    // Canvas y contextos
    private _canvas!: HTMLCanvasElement;
    private _ctx!: CanvasRenderingContext2D;
    private _canvasHUD!: HTMLCanvasElement;
    private _ctxHUD!: CanvasRenderingContext2D;
    private _canvasHUD2!: HTMLCanvasElement;
    private _ctxHUD2!: CanvasRenderingContext2D;

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

    // Método para inicializar el canvas principal
    public initializeCanvas(canvasId: string): void {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
            throw new Error(`Canvas with id '${canvasId}' not found`);
        }
        this._canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get 2D context from canvas');
        }
        this._ctx = ctx;
    }

    // Método para inicializar el HUD canvas
    public initializeHUDCanvas(canvasId: string): void {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
            throw new Error(`HUD Canvas with id '${canvasId}' not found`);
        }
        this._canvasHUD = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get 2D context from HUD canvas');
        }
        this._ctxHUD = ctx;
    }

    // Método para inicializar el HUD2 canvas
    public initializeHUD2Canvas(canvasId: string): void {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
            throw new Error(`HUD2 Canvas with id '${canvasId}' not found`);
        }
        this._canvasHUD2 = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get 2D context from HUD2 canvas');
        }
        this._ctxHUD2 = ctx;
    }

    // Getters para acceso seguro a canvas y contextos
    public get canvas(): HTMLCanvasElement {
        if (!this._canvas) {
            throw new Error('Canvas not initialized. Call initializeCanvas() first.');
        }
        return this._canvas;
    }

    public get ctx(): CanvasRenderingContext2D {
        if (!this._ctx) {
            throw new Error('Canvas context not initialized. Call initializeCanvas() first.');
        }
        return this._ctx;
    }

    public get canvasHUD(): HTMLCanvasElement {
        if (!this._canvasHUD) {
            throw new Error('HUD Canvas not initialized. Call initializeHUDCanvas() first.');
        }
        return this._canvasHUD;
    }

    public get ctxHUD(): CanvasRenderingContext2D {
        if (!this._ctxHUD) {
            throw new Error('HUD Canvas context not initialized. Call initializeHUDCanvas() first.');
        }
        return this._ctxHUD;
    }

    public get canvasHUD2(): HTMLCanvasElement {
        if (!this._canvasHUD2) {
            throw new Error('HUD2 Canvas not initialized. Call initializeHUD2Canvas() first.');
        }
        return this._canvasHUD2;
    }

    public get ctxHUD2(): CanvasRenderingContext2D {
        if (!this._ctxHUD2) {
            throw new Error('HUD2 Canvas context not initialized. Call initializeHUD2Canvas() first.');
        }
        return this._ctxHUD2;
    }

    // Métodos de utilidad
    public getCanvasWidth(): number {
        return this.canvas.width;
    }

    public getCanvasHeight(): number {
        return this.canvas.height;
    }

    public getCanvasCenter(): { x: number, y: number } {
        return {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        };
    }

    // Método para limpiar todos los canvas
    public clearAllCanvas(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctxHUD.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctxHUD2.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
}

// Instancia singleton del estado del juego
export const gameState = new GameState();
