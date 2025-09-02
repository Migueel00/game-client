import { Game } from "./constants.js";
import { CanvasManager } from "./core/CanvasManager.js";
export class GameState {
    // Canvas y contextos
    canvasManager;
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
    initializeCanvas() {
        this.canvasManager = new CanvasManager();
        this.canvasManager.initializeCanvas('gameScreen', 'gameHUD', 'sideGameHud');
        // Configurar anti-aliasing
        this.canvasManager.ctx.imageSmoothingEnabled = false;
    }
    clearAllCanvas() {
        this.canvasManager.clearCanvas();
    }
    getCanvasSize() {
        return this.canvasManager.getCanvasSize();
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
    // Getters para acceso a canvas (para compatibilidad con código existente)
    get canvas() {
        return this.canvasManager.canvas;
    }
    get ctx() {
        return this.canvasManager.ctx;
    }
    get canvasHUD() {
        return this.canvasManager.hudCanvas;
    }
    get ctxHUD() {
        return this.canvasManager.hudCtx;
    }
    get canvasHUD2() {
        return this.canvasManager.sideHudCanvas;
    }
    get ctxHUD2() {
        return this.canvasManager.sideHudCtx;
    }
}
// Instancia singleton del estado del juego
export const gameState = new GameState();
