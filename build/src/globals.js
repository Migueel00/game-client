//Variables globales 
import { Game } from "./constants.js";
export default {
    //Acceso al canvas y context
    canvas: null,
    ctx: {},
    canvasHUD: {},
    ctxHUD: {},
    canvasHUD2: {},
    ctxHUD2: {},
    //Estado de juego Inicializamos en INVALID
    gameState: Game.INVALID,
    //Tiempo de ciclo anterior (miliseconds)
    previousCycleMiliseconds: -1,
    //Tiempo de ciclo de juego real (seconds)
    deltaTime: 0,
    cicleRealTime: 0,
    //Tiempo de ciclo objetivo (seconds, constante)
    frameTimeObj: 0,
    //Caja de texto para mostrar datos de depuracion
    txtPruebas: {},
    //Variables para gestionar carga de activos
    assetsToLoad: [],
    assetsLoaded: 0,
    //Array con datos de los sprites
    sprites: [],
    storySprites: [],
    controlSprites: [],
    spritesHUD: [],
    spritesNewGame: [],
    //Datos de imagen (tileset) . Modificamos por ARRAY
    tileSets: [],
    //Datos del nivel
    level: {},
    obstacles: {},
    action: {},
    // Life
    life: 0,
    points: 0,
    // Timer disparo
    shootTimer: {},
    levelTimer: {},
    fireworkTimer: {},
    // Timer pociones
    potionsTimers: {},
    damagePotionTimer: {},
    // Timer enemigos
    enemiesTimers: {},
    // Timer menu
    menuTimer: {},
    // camara
    camera: {},
    //array de particulas
    particles: [],
    //array de objetos score
    score: [],
    username: "",
    gameOverTimer: {},
    //aux para el get
    aux: 0,
    //aux introducir name
    auxName: 0,
    //Sonidos
    sounds: [],
    // Current sound to play
    currentSound: -1
};
