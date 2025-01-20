import globals from "./globals.js";
import { Game, FPS, SpriteID, State, ParticleID, ParticleState, GRAVITI, Sound, ProyectileType } from "./constants.js";
import Knight from "../Sprites/Knight.js";
import Potion from "../Sprites/Potion.js";
import LucretiaProyectile from "../Sprites/LucretiaProyectile.js";
import EnemyArcher from "../Sprites/EnemyArcher.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import { Level, level1, obstacles } from "./Level.js"; //Importar clase Level y level1
import { PhysicsParticle } from "./Physics.js";
import { keydownHandler, keyupHandler, updateMusic } from "./event.js";
import { calculatePositionProyectile } from "./gameLogic.js";
import HitBox from "./HitBox.js";
import Timer from "./Timer.js";
import Camera from "./Camera.js";
import ExplosionParticle, { FireParticle } from "./Particle.js";
import Score from "./Score.js";
import KnightShield from "../Sprites/KnightShield.js";
import ArcherProyectile from "../Sprites/ArcherProyectile.js";
import Lucretia from "../Sprites/Lucretia.js";
import Fire from "../Sprites/Fire.js";
import StaticSprite from "./StaticSprites/StaticSprite.js";
//Funcion que inicializa los elementos HTML
function initHTMLelements() {
    //canvas context Screen
    globals.canvas = document.getElementById('gameScreen');
    globals.ctx = globals.canvas.getContext("2d");
    //canvas context HUD
    globals.canvasHUD = document.getElementById('gameHUD');
    globals.ctxHUD = globals.canvasHUD.getContext("2d");
    //canvas HUD Game
    globals.canvasHUD2 = document.getElementById('gameHUD2');
    globals.ctxHUD2 = globals.canvasHUD2.getContext("2d");
    //Eliminacion del Anti-Aliasing
    globals.ctx.imageSmoothingEnabled = false;
    //Caja de texto de pruebas
    globals.txtPruebas = document.getElementById('txtPruebas');
}
//Funcion que iniciañiza las variables del juego
function initVars() {
    //Inicializamos las variables de gestion de tiempo
    globals.previousCycleMiliseconds = 0;
    globals.deltaTime = 0;
    globals.frameTimeObj = 1 / FPS; //Frame time in seconds
    //Inicializamos el estado del juego
    globals.gameState = Game.PLAYING;
    // Inicializamos los estados de las acciones
    globals.action = {
        moveLeft: false,
        moveRight: false,
        moveUp: false,
        moveDown: false,
        attack: false,
        damage: false,
        heal: false,
        enter: false,
        escape: false
    };
    // Variables logica juego
    globals.life = 50;
    // Inicializamos la variable que controla el sonido a reproducir
    globals.currentSound = Sound.NO_SOUND;
}
//carga los archivos: TILEMAPS, IMAGES, SOUNDS
function loadAssets() {
    let tileSet;
    //load the spritesheet image
    tileSet = new Image();
    tileSet.addEventListener("load", loadHandler, false);
    tileSet.src = "./images/spritesheet4-0-0.png";
    globals.tileSets.push(tileSet);
    globals.assetsToLoad.push(tileSet);
    //Load the map image
    tileSet = new Image();
    tileSet.addEventListener("load", loadHandler, false);
    tileSet.src = "./images/Mapa_Final.png"; //ruta relativa al html
    globals.tileSets.push(tileSet);
    globals.assetsToLoad.push(tileSet);
    // Load sounds
    let gameMusic = document.querySelector("#gameMusic");
    if (gameMusic) {
        gameMusic.addEventListener("canplaythrough", loadHandler, false);
        gameMusic.addEventListener("timeupdate", updateMusic, false);
        gameMusic.load();
        globals.sounds.push(gameMusic);
        globals.assetsToLoad.push(gameMusic);
    }
    else {
        console.error("Element with id 'gameMusic' not found");
    }
}
//Funcion que se llama cda vez que se carga un activo
function loadHandler() {
    globals.assetsLoaded++;
    //Una vez se han cargado todos los activos pasamos
    if (globals.assetsLoaded === globals.assetsToLoad.length) {
        //UPDATE . Remove the load event listener
        for (let i = 0; i < globals.tileSets.length; i++) {
            globals.tileSets[i].removeEventListener("load", loadHandler, false);
        }
        // Remove the load event listener from sounds
        for (let i = 0; i < globals.sounds.length; i++) {
            globals.sounds[i].removeEventListener("canplaythrough", loadHandler, false);
        }
        console.log("Assets finished loading");
        //Start the game
        globals.gameState = Game.NEW_GAME;
    }
}
function initSprites() {
    //Game screen
    initLucretia();
    initKnight2();
    initHealPotion();
    initDamagePotion();
    initFire();
    //Story Screen
    initPergamino();
    // New game screen
    initArrowMenu();
    //Controls Screen
    initControl();
    initRigthKey();
    initLeftKey();
    initUpKey();
    initDownKey();
    initXKey();
    initPkey();
    initCkey();
    initZkey();
    // Life icon
    initLifeIcon(220);
    initLifeIcon(235);
    initLifeIcon(250);
    initLifeIcon(265);
    initLifeIcon(280);
}
//Iniciar caballero1
export function initKnight2() {
    // Crear el objeto knight
    const knight = Knight.create();
    //Añadimos el sprite al array de sprites
    globals.sprites.push(knight);
}
//Iniciar caballero escudo
export function initKnightShield() {
    const knightShield = KnightShield.create();
    globals.sprites.push(knightShield);
}
//Iniciar caballero arco
export function initKnightArcher() {
    const knightArcher = EnemyArcher.create();
    globals.sprites.push(knightArcher);
}
// Proyectil de arquero
export function initArcherProyectile(xPos, yPos) {
    const archerProyectile = ArcherProyectile.create(xPos, yPos);
    globals.sprites.push(archerProyectile);
}
export function initArcherProyectileLeft(xPos, yPos) {
    const archerProyectileLeft = ArcherProyectile.createLeft(xPos, yPos);
    globals.sprites.push(archerProyectileLeft);
}
//Iniciar lucretia
function initLucretia() {
    const lucretia = Lucretia.create();
    globals.sprites.push(lucretia);
    globals.spritesNewGame.push(lucretia);
}
// proyectil de lucretia
export function initLucretiaProyectile() {
    // posicion inicial del proyectil
    let xPos = calculatePositionProyectile().xPosLucretia + 50;
    let yPos = calculatePositionProyectile().yPosLucretia + 20;
    const lucretiaProyectile = LucretiaProyectile.create(xPos, yPos, ProyectileType.RIGHT);
    globals.sprites.push(lucretiaProyectile);
}
export function initLucretiaProyectileUp() {
    // posicion inicial del proyectil
    let xPos = calculatePositionProyectile().xPosLucretia + 22;
    let yPos = calculatePositionProyectile().yPosLucretia;
    const lucretiaProyectile = LucretiaProyectile.create(xPos, yPos, ProyectileType.UP);
    globals.sprites.push(lucretiaProyectile);
}
export function initLucretiaProyectileDown() {
    // posicion inicial del proyectil
    let xPos = calculatePositionProyectile().xPosLucretia + 27;
    let yPos = calculatePositionProyectile().yPosLucretia + 20;
    const lucretiaProyectile = LucretiaProyectile.create(xPos, yPos, ProyectileType.DOWN);
    globals.sprites.push(lucretiaProyectile);
}
export function initLucretiaProyectileLeft() {
    // posicion inicial del proyectil
    let xPos = calculatePositionProyectile().xPosLucretia;
    let yPos = calculatePositionProyectile().yPosLucretia;
    const lucretiaProyectile = LucretiaProyectile.create(xPos, yPos, ProyectileType.LEFT);
    globals.sprites.push(lucretiaProyectile);
}
//Iniciar pocion cura
function initHealPotion() {
    const healPotion = Potion.create(SpriteID.HEAL_POTION);
    globals.spritesHUD.push(healPotion);
}
//Iniciar pocio daño
function initDamagePotion() {
    const damagePotion = Potion.create(SpriteID.DAMAGE_POTION);
    globals.spritesHUD.push(damagePotion);
}
export function initLifeIcon(xPos) {
    const imageSet = new ImageSet(40, 0, 120, 80, 120, 80, 0, 0);
    const lifeIcon = new StaticSprite(SpriteID.LIFE_ICON, State.LIFE_ICON, xPos, 3, imageSet);
    globals.spritesHUD.push(lifeIcon);
}
function initFire() {
    const imageSet = new ImageSet(31, 0, 40, 40, 120, 80, 30, 50);
    const frames = new Frames(7, 1);
    const hitBox = new HitBox(15, 15, 12, 16);
    // Crear numero aleatorio de fuegos en X y Y pos aleatoria del mapa
    let nFire = Math.floor(Math.random() * 10 + 1);
    for (let i = 0; i < nFire; i++) {
        let xPosAleatoria = Math.floor(Math.random() * (globals.canvas.width - 32) + 1);
        let yPosAleatoria = Math.floor(Math.random() * (globals.canvas.height - 32) + 1);
        const fire = new Fire(SpriteID.FIRE, State.FIRE_LOOP, xPosAleatoria, yPosAleatoria, imageSet, frames, hitBox);
        fire.xPos = xPosAleatoria;
        fire.yPos = yPosAleatoria;
        globals.sprites.push(fire);
    }
}
function initPergamino() {
    const imageSet = new ImageSet(33, 6, 340, 410, 120, 80, -100, 0);
    const pergamino = new StaticSprite(SpriteID.PERGAMINO, State.STILL_PERGAMINO, 100, 80, imageSet);
    globals.storySprites.push(pergamino);
}
function initArrowMenu() {
    const imageSet = new ImageSet(38, 6, 200, 200, 120, 80, 0, 0);
    const arrowMenu = new StaticSprite(25, 0, 30, 16, imageSet);
    globals.spritesNewGame.push(arrowMenu);
}
function initControl() {
    const imageSet = new ImageSet(38, 1, 240, 150, 120, 80, 0, 0);
    const control = new StaticSprite(SpriteID.MANDO, State.STILL_MANDO, 250, 320, imageSet);
    globals.controlSprites.push(control);
}
function initRigthKey() {
    const imageSet = new ImageSet(34, 3, 120, 80, 120, 80, 0, 0);
    const rightKey = new StaticSprite(SpriteID.RIGHT_KEY, State.RIGHT_KEY, 70, 95, imageSet);
    globals.controlSprites.push(rightKey);
}
function initLeftKey() {
    const imageSet = new ImageSet(34, 2, 120, 80, 120, 80, 0, 0);
    const rightKey = new StaticSprite(SpriteID.LEFT_KEY, State.LEFT_KEY, 70, 150, imageSet);
    globals.controlSprites.push(rightKey);
}
function initUpKey() {
    const imageSet = new ImageSet(34, 0, 120, 80, 120, 80, 0, 0);
    const rightKey = new StaticSprite(SpriteID.UP_KEY, State.UP_KEY, 80, 200, imageSet);
    globals.controlSprites.push(rightKey);
}
function initDownKey() {
    const imageSet = new ImageSet(34, 1, 120, 60, 120, 80, 0, 20);
    const rightKey = new StaticSprite(SpriteID.DOWN_KEY, State.DOWN_KEY, 73, 270, imageSet);
    globals.controlSprites.push(rightKey);
}
function initXKey() {
    const imageSet = new ImageSet(35, 0, 120, 60, 120, 80, 4, 20);
    const rightKey = new StaticSprite(SpriteID.X_KEY, State.X_KEY, 82, 330, imageSet);
    globals.controlSprites.push(rightKey);
}
function initPkey() {
    const imageSet = new ImageSet(35, 1, 120, 60, 120, 80, 0, 10);
    const pKey = new StaticSprite(SpriteID.P_KEY, State.P_KEY, 350, 210, imageSet);
    globals.controlSprites.push(pKey);
}
function initZkey() {
    const imageSet = new ImageSet(35, 2, 120, 60, 120, 80, 0, 20);
    const pKey = new StaticSprite(SpriteID.P_KEY, State.P_KEY, 400, 160, imageSet);
    globals.controlSprites.push(pKey);
}
function initCkey() {
    const imageSet = new ImageSet(35, 3, 120, 60, 120, 80, 0, 20);
    const pKey = new StaticSprite(SpriteID.P_KEY, State.P_KEY, 380, 90, imageSet);
    globals.controlSprites.push(pKey);
}
//Iniciar nivel
function initLevel() {
    //Creamos las propieadades de las imagenes del mapa
    const imageSet = new ImageSet(0, 0, 16, 16, 16, 16, 0, 0);
    //Creamos y guardamos nuestro nivel
    globals.level = new Level(level1, imageSet);
}
//Iniciar obstaculos
function initObstacles() {
    // Creamos las propiedades de las imagenes del mapa
    const imageSet = new ImageSet(0, 0, 16, 16, 16, 16, 0, 0);
    // Creamos y guardamos nuestro nivel
    globals.obstacles = new Level(obstacles, imageSet);
}
//Iniciar eventons
function initEvents() {
    // Add the keyboard event listener 
    window.addEventListener("keydown", keydownHandler, false);
    window.addEventListener("keyup", keyupHandler, false);
}
//Iniciar timer de disparo
function initTimers() {
    // Creamos timer de valor con cambios cada 0.5segundos
    globals.shootTimer = new Timer(0, 1);
    globals.potionsTimers = new Timer(0, 1);
    globals.enemiesTimers = new Timer(0, 1);
    globals.menuTimer = new Timer(0, 0);
    globals.damagePotionTimer = new Timer(0, 1);
    globals.levelTimer = new Timer(180, 1);
    globals.fireworkTimer = new Timer(0, 1);
    globals.gameOverTimer = new Timer(0, 1);
}
function initCamera() {
    globals.camera = new Camera(0, 0);
}
function initParticles() {
}
function initExplosion() {
    const numParticles = 30;
    const xInit = globals.canvas.width / 2;
    const yInit = globals.canvas.height / 2;
    const radius = 1.5;
    const timeToFadeMax = 5;
    const alpha = 1.0;
    for (let i = 0; i < numParticles; i++) {
        const velocity = Math.random() * 35 + 5;
        const physics = new PhysicsParticle(velocity);
        const timeToFade = timeToFadeMax * Math.random() + 1;
        const particle = new ExplosionParticle(ParticleID.EXPLOSION, ParticleState.ON, xInit, yInit, radius, alpha, physics, timeToFade);
        //Asignar velocidad sgun ángulo aleatorio
        const randomAngle = Math.random() * 2 * Math.PI;
        particle.physics.vx = particle.physics.vLimit * Math.cos(randomAngle);
        particle.physics.vy = particle.physics.vLimit * Math.sin(randomAngle);
    }
}
export function initFireworks() {
    const numParticles = 200;
    const xInit = Math.floor(Math.random() * globals.canvas.width + 1);
    const yInit = Math.floor(Math.random() * globals.canvas.height + 1);
    const radius = 1.5;
    const timeToFadeMax = 2;
    const alpha = 1.0;
    for (let i = 0; i < numParticles; i++) {
        const velocity = Math.random() * 60 + 5;
        const acceleration = 30;
        const physics = new PhysicsParticle(velocity, acceleration);
        const timeToFade = timeToFadeMax * Math.random() + 1;
        const particle = new ExplosionParticle(ParticleID.FIREWORKS, ParticleState.ON, xInit, yInit, radius, alpha, physics, timeToFade);
        //Asignar velocidad sgun ángulo aleatorio
        const randomAngle = Math.random() * 2 * Math.PI;
        particle.physics.vx = particle.physics.vLimit * Math.cos(randomAngle);
        particle.physics.vy = particle.physics.vLimit * Math.sin(randomAngle);
        //Asignamos aceleraciones iniciales
        particle.physics.ax = -particle.physics.aLimit * Math.cos(randomAngle);
        particle.physics.ay = GRAVITI;
        globals.particles.push(particle);
    }
}
export function createFireParticle() {
    const alpha = 1.0;
    const velocity = Math.random() * 20 + 10;
    const physics = new PhysicsParticle(velocity);
    const xInit = Math.random() * 50 + 100;
    const yInit = 100;
    const radius = 2 + Math.random() + 2;
    const particle = new FireParticle(ParticleID.FIRE, ParticleState.ON, xInit, yInit, radius, alpha, physics, 200);
    //Asignamos velocidades segun el angulo aleatorio
    const randomAngle = Math.random() * Math.PI / 3 + 3 * Math.PI / 2;
    particle.physics.vx = particle.physics.vLimit * Math.cos(randomAngle);
    particle.physics.vy = particle.physics.vLimit * Math.sin(randomAngle);
    globals.particles.push(particle);
}
export function initScores(data) {
    for (let i = 0; i < data.length; i++) {
        const score = new Score(data[i].player, data[i].scores);
        globals.score.push(score);
    }
}
//Exportamos las funciones
export { initHTMLelements, initVars, loadAssets, initSprites, initLevel, initEvents, initObstacles, initTimers, initCamera, initParticles };
