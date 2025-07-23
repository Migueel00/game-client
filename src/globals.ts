//Variables globales 
import {Game} from "./constants.js";

export default {

    //Acceso al canvas y context
    canvas: null,
    ctx:    {},
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
    menuTimer : {},


    // camara
    camera: {},

    //array de particulas
    particles: [],

    //array de objetos score
    score:  [],
    username : "",
    gameOverTimer: {},

    //aux para el get
    aux:    0,

    //aux introducir name
    auxName: 0,
    
    //Sonidos
    sounds: [],

    // Current sound to play
    currentSound: -1
} as globals;

interface globals {
    canvas: HTMLCanvasElement | null;
    ctx: any;
    canvasHUD: any; 
    ctxHUD: any;
    canvasHUD2: any;
    ctxHUD2: any;
    gameState: number;
    previousCycleMiliseconds: number;
    deltaTime: number;
    cicleRealTime: number;
    frameTimeObj: number;
    txtPruebas: any;
    assetsToLoad: any[];
    assetsLoaded: number;
    sprites: any[];
    storySprites: any[];
    controlSprites: any[];
    spritesHUD: any[];
    spritesNewGame: any[];
    tileSets: any[];
    level: any;
    obstacles: any;
    action: any;
    life: number;
    points: number;
    shootTimer: any;
    levelTimer: any;
    fireworkTimer: any;
    potionsTimers: any;
    damagePotionTimer: any;
    enemiesTimers: any;
    menuTimer: any;
    camera: any;
    particles: any[];
    score: any[];
    username: string;
    gameOverTimer: any;
    aux: number;
    auxName: number;
    sounds: any[];
    currentSound: number;
}