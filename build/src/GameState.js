import { Game } from "./constants.js";
import { AssetManager } from "./core/AssetManager.js";
import { CanvasManager } from "./core/CanvasManager.js";
import { SceneManager } from "./core/SceneManager.js";
import { MenuScene } from "./scenes/MenuScene.js";
export class GameState {
    // Canvas y contextos
    canvasManager;
    assetManager;
    sceneManager;
    // Estado del juego
    gameState = Game.INVALID;
    // Tiempo
    previousCycleMiliseconds = -1;
    deltaTime = 0;
    cicleRealTime = 0;
    frameTimeObj = 0;
    // Debug
    txtPruebas = {};
    // Sprites
    sprites = [];
    storySprites = [];
    controlSprites = [];
    spritesHUD = [];
    spritesNewGame = [];
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
    // Métodos del SceneManager
    initializeScenes() {
        this.sceneManager = new SceneManager();
        // Crear y registrar la escena de menú
        const menuScene = new MenuScene();
        this.sceneManager.addScene("menu", menuScene);
        // Comenzar con la escena de menú
        this.sceneManager.switchToScene("menu");
    }
    updateCurrentScene(deltaTime) {
        if (this.sceneManager) {
            this.sceneManager.update(deltaTime);
        }
    }
    renderCurrentScene() {
        if (this.sceneManager) {
            this.sceneManager.render();
        }
    }
    handleSceneInput(event) {
        if (this.sceneManager) {
            this.sceneManager.handleInput(event);
        }
    }
    switchToScene(sceneName) {
        if (this.sceneManager) {
            this.sceneManager.switchToScene(sceneName);
        }
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
    initializeAssets() {
        this.assetManager = new AssetManager();
        // Configurar los assets que cargar
        this.assetManager.addImage('spritesheet', './images/spritesheet4-0-0.png');
        this.assetManager.addImage('map', './images/Mapa_Final.png');
        this.assetManager.addSound('gameMusic', 'gameMusic');
    }
    async loadAssets() {
        await this.assetManager.loadAllAssets();
    }
    // Getters para compatibilidad (reemplazar arrays tileSets y sounds)
    getSpriteSheet() {
        return this.assetManager.getSpriteSheet();
    }
    getMapImage() {
        return this.assetManager.getMapImage();
    }
    getGameMusic() {
        return this.assetManager.getGameMusic();
    }
    getAssetsLoadingProgress() {
        return this.assetManager.getLoadingProgress();
    }
}
// Instancia singleton del estado del juego
export const gameState = new GameState();
