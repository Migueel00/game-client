import { Game } from "./constants.js";
export class GameState {
    // Canvas y contextos
    _canvas;
    _ctx;
    _canvasHUD;
    _ctxHUD;
    _canvasHUD2;
    _ctxHUD2;
    // Estado del juego
    gameState = Game.INVALID;
    // Tiempo
    previousCycleMiliseconds = -1;
    deltaTime = 0;
    cicleRealTime = 0;
    frameTimeObj = 0;
    // Debug
    txtPruebas = {};
    // Assets
    assetsToLoad = [];
    assetsLoaded = 0;
    // Sprites
    sprites = [];
    storySprites = [];
    controlSprites = [];
    spritesHUD = [];
    spritesNewGame = [];
    // Datos de imagen
    tileSets = [];
    // Nivel
    level = {};
    obstacles = {};
    action = {};
    // Juego
    life = 0;
    points = 0;
    // Timers
    shootTimer = {};
    levelTimer = {};
    fireworkTimer = {};
    potionsTimers = {};
    damagePotionTimer = {};
    enemiesTimers = {};
    menuTimer = {};
    gameOverTimer = {};
    // Cámara
    camera = {};
    // Partículas y efectos
    particles = [];
    score = [];
    // Usuario
    username = "";
    // Auxiliares
    aux = 0;
    auxName = 0;
    // Sonidos
    sounds = [];
    currentSound = -1;
    constructor() {
        // Los canvas se inicializarán después mediante métodos específicos
    }
    // Método para inicializar el canvas principal
    initializeCanvas(canvasId) {
        const canvas = document.getElementById(canvasId);
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
    initializeHUDCanvas(canvasId) {
        const canvas = document.getElementById(canvasId);
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
    initializeHUD2Canvas(canvasId) {
        const canvas = document.getElementById(canvasId);
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
    get canvas() {
        if (!this._canvas) {
            throw new Error('Canvas not initialized. Call initializeCanvas() first.');
        }
        return this._canvas;
    }
    get ctx() {
        if (!this._ctx) {
            throw new Error('Canvas context not initialized. Call initializeCanvas() first.');
        }
        return this._ctx;
    }
    get canvasHUD() {
        if (!this._canvasHUD) {
            throw new Error('HUD Canvas not initialized. Call initializeHUDCanvas() first.');
        }
        return this._canvasHUD;
    }
    get ctxHUD() {
        if (!this._ctxHUD) {
            throw new Error('HUD Canvas context not initialized. Call initializeHUDCanvas() first.');
        }
        return this._ctxHUD;
    }
    get canvasHUD2() {
        if (!this._canvasHUD2) {
            throw new Error('HUD2 Canvas not initialized. Call initializeHUD2Canvas() first.');
        }
        return this._canvasHUD2;
    }
    get ctxHUD2() {
        if (!this._ctxHUD2) {
            throw new Error('HUD2 Canvas context not initialized. Call initializeHUD2Canvas() first.');
        }
        return this._ctxHUD2;
    }
    // Métodos de utilidad
    getCanvasWidth() {
        return this.canvas.width;
    }
    getCanvasHeight() {
        return this.canvas.height;
    }
    getCanvasCenter() {
        return {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        };
    }
    // Método para limpiar todos los canvas
    clearAllCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctxHUD.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctxHUD2.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    // Método para resetear el estado del juego
    reset() {
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
