import CollisionManager from "./CollisionManager.js";
import { Game, ParticleID, ParticleState, Sound, SpriteID, State } from "./constants.js";
import { createUserName, getPlayerData, postNewScore } from "./event.js";
import globals from "./globals.js";
import { createFireParticle, initFireworks, initKnight2, initKnightArcher, initKnightShield, initLifeIcon } from "./initialize.js";
export default function update() {
    //Change what the game is doing based on the game state
    switch (globals.gameState) {
        case Game.LOADING:
            console.log("Loading assets....");
            break;
        case Game.PLAYING:
            playGame();
            break;
        case Game.NEW_GAME:
            newGame();
            break;
        case Game.CONTROLS:
            controls();
            break;
        case Game.STORY:
            story();
            break;
        case Game.HIGHSCORES:
            highScores();
            break;
        case Game.OVER:
            gameOver();
            break;
        case Game.LOAD_SCORES:
            loadScores();
            break;
        default:
            console.error("Error : Game state invalid");
    }
    // Al pulsar la tecla definida para "enter"
    if (globals.action.enter) {
        // Reproducimos GAME_MUSIC a un volumen inferior
        globals.sounds[Sound.GAME_MUSIC].play();
        globals.sounds[Sound.GAME_MUSIC].volume = 0.4;
    }
}
export function positionLucretia() {
    const lucretia = globals.sprites[0];
    let xPos = lucretia.xPos;
    let yPos = lucretia.yPos;
    return { xPos, yPos };
}
export function calculatePositionProyectile() {
    let xPosLucretia = positionLucretia().xPos;
    let yPosLucretia = positionLucretia().yPos;
    return { xPosLucretia, yPosLucretia };
}
function updateShootTimer() {
    globals.shootTimer.timeChangeCounter += globals.deltaTime;
    if (globals.shootTimer.timeChangeCounter > globals.shootTimer.timeChangeValue) {
        globals.shootTimer.value++;
        globals.shootTimer.timeChangeCounter = 0;
    }
    if (globals.shootTimer.value <= 1) {
        globals.shootTimer.value = 1;
    }
    if (globals.action.attack) {
        globals.shootTimer.value = 0;
    }
}
function updateDamagePotionTimer() {
    //Incrementamos el contador de cambio de valor
    globals.damagePotionTimer.timeChangeCounter += globals.deltaTime;
    //Si ha pasado el tiempo necesario, cambiamos el valor del timer
    if (globals.damagePotionTimer.timeChangeCounter > globals.damagePotionTimer.timeChangeValue) {
        globals.damagePotionTimer.value++;
        //Reseteamos timeChangeCounter
        globals.damagePotionTimer.timeChangeCounter = 0;
    }
}
function updateArcherProyectile(sprite) {
    // Maquina de estados
    switch (sprite.state) {
        case State.ARCHER_PROYECTILE_HORIZONTAL:
            // Disparo a la derecha
            sprite.physics.vx = sprite.physics.vLimit;
            sprite.physics.vy = 0;
            sprite.frames.frameCounter = 0;
            break;
    }
    // Calcular la distancia que se mueve (X = Xo + Vo * t)
    sprite.xPos += sprite.physics.vx * globals.deltaTime;
    // Calcula la colision, si colisiona elimina el sprite
    calculateCollisionSpriteAndRemove(sprite);
}
function updateArcherProyectileLeft(sprite) {
    switch (sprite.state) {
        case State.ARCHER_PROYECTILE_HORIZONTAL:
            //Disparo a la izquierda
            sprite.physics.vx = -sprite.physics.vLimit;
            sprite.physics.vy = 0;
            break;
    }
    // Calcular la distancia
    sprite.xPos += sprite.physics.vx * globals.deltaTime;
    // Calcula la colision, si colisiona elimina el sprite del array de sprites
    calculateCollisionSpriteAndRemove(sprite);
}
function calculateCollisionSpriteAndRemove(sprite) {
    let isCollision = calculateCollisionWithBorders(sprite);
    if (isCollision) {
        sprite.state = State.OFF;
    }
}
//////////////////////////////////////      UPDATES FOR GAME STATES
function playGame() {
    // .... A completar
    updateSprites();
    //Actualizacion de la lógica de juego
    updateLife();
    //Update timers
    updateTimersPlus(globals.potionsTimers);
    updateShootTimer();
    updateTimersPlus(globals.enemiesTimers);
    updateDamagePotionTimer();
    updateLevelTimer();
    // Evento enemigos
    initEnemiRandomly();
    // Actualizacion de la camara
    // Actualizar corazones
    updateLifeIcon();
    updateParticles();
    updateCamera();
    const collisionManager = new CollisionManager(globals.sprites);
    collisionManager.detectAllCollisions();
}
function newGame() {
    const sprite = globals.spritesNewGame[1];
    updateNewGame(sprite);
    const lucretia = globals.spritesNewGame[0];
    lucretia.xPos = 370;
    lucretia.yPos = 230;
    updateAnimationFrame(lucretia);
    if (sprite.yPos <= 16 && sprite.yPos <= 76 && globals.action.enter) {
        globals.gameState = Game.PLAYING;
    }
    else if (sprite.yPos <= 76 && sprite.yPos <= 136 && globals.action.enter) {
        globals.gameState = Game.CONTROLS;
    }
    else if (sprite.yPos <= 136 && sprite.yPos <= 196 && globals.action.enter) {
        globals.gameState = Game.STORY;
    }
    else if (sprite.yPos === 196 && globals.action.enter) {
        globals.gameState = Game.LOAD_SCORES;
    }
}
function updateNewGame(sprite) {
    const time = globals.menuTimer.value;
    if (time >= 1) {
        if (globals.action.moveDown && sprite.yPos < 176) {
            sprite.yPos += 60;
        }
        if (globals.action.moveUp && sprite.yPos > 36) {
            sprite.yPos -= 60;
        }
    }
    updateMenuTimer();
}
function updateMenuTimer() {
    updateTimersPlus(globals.menuTimer);
    if (globals.menuTimer.value >= 1) {
        globals.menuTimer.value = 1;
    }
    if (globals.action.moveDown || globals.action.moveUp) {
        globals.menuTimer.value = 0;
    }
}
function story() {
    if (globals.action.escape) {
        globals.gameState = Game.NEW_GAME;
    }
}
function controls() {
    if (globals.action.escape) {
        globals.gameState = Game.NEW_GAME;
    }
}
function highScores() {
    if (globals.action.escape) {
        globals.gameState = Game.NEW_GAME;
    }
    updateTimersPlus(globals.fireworkTimer);
    if (globals.fireworkTimer.value % 20 === 0) {
        initFireworks();
    }
    updateParticles();
}
function loadScores() {
    let aux = globals.aux;
    if (aux === 0) {
        getPlayerData();
        globals.aux += 1;
    }
    globals.gameState = Game.HIGHSCORES;
}
function gameOver() {
    if (globals.username.length === 3) {
        if (globals.action.escape) {
            resetToNewGame();
            for (let i = 0; i < globals.sprites.length; i++) {
                const sprite = globals.sprites[i];
                if (sprite.enemy) {
                    sprite.state = State.OFF;
                }
            }
        }
        else if (globals.action.moveLeft) {
            postNewScore();
            resetToNewGame();
            globals.gameState = Game.NEW_GAME;
        }
        else if (globals.action.moveRight) {
            postNewScore();
            resetToNewGame();
            globals.gameState = Game.LOAD_SCORES;
        }
    }
    console.log(globals.menuTimer.value);
    console.log(globals.auxName);
    if (globals.auxName < 1 && globals.gameState === Game.OVER) {
        document.addEventListener('keydown', function (event) {
            createUserName(event.key);
        });
        globals.auxName++;
    }
}
function resetToNewGame() {
    // Reset all the globas states 
    globals.gameState = Game.NEW_GAME;
    globals.potionsTimers.value = 0;
    globals.damagePotionTimer.value = 0;
    globals.life = 50;
    globals.levelTimer.value = 180;
    globals.points = 0;
    // Reinitizalize hearts
    initLifeIcon(220);
    initLifeIcon(235);
    initLifeIcon(250);
    initLifeIcon(265);
    initLifeIcon(280);
}
//////////////////////////////////// UPDATE SPRITES //////////////////////////
function updateSprites() {
    for (let i = 0; i < globals.sprites.length; i++) {
        const sprite = globals.sprites[i];
        if (sprite.state === State.OFF) {
            globals.sprites.splice(i, 1);
            i--;
        }
        updateSprite(sprite);
    }
}
function updateAnimationFrame(sprite) {
    //aumento el contador de tiempo entre frames
    sprite.frames.frameChangeCounter++;
    //Cambiar de frame cuando el lag de animación alcanza animSpeed
    if (sprite.frames.frameChangeCounter === sprite.frames.speed) {
        //Cambiamos de frame y reseteamos el contador de frame
        sprite.frames.frameCounter++;
        sprite.frames.frameChangeCounter = 0;
    }
    //Si hemos llegado al máximo de frames reiniciamos el contador (animacion ciclica);
    if (sprite.frames.frameCounter === sprite.frames.framesPerState) {
        sprite.frames.frameCounter = 0;
    }
}
function updateSprite(sprite) {
    const type = sprite.id;
    const lucretiaYPos = positionLucretia().yPos;
    switch (type) {
        case SpriteID.KNIGHT:
            sprite.update(lucretiaYPos);
            break;
        case SpriteID.KNIGHT_SHIELD:
            sprite.update(lucretiaYPos);
            break;
        case SpriteID.KNIGHT_ARCHER:
            sprite.update();
            break;
        case SpriteID.LUCRETIA:
            sprite.update();
            break;
        case SpriteID.FIRE:
            sprite.update();
            break;
        case SpriteID.LUCRETIA_PROYECTILE:
            sprite.update();
            break;
        case SpriteID.ARCHER_PROYECTILE:
            updateArcherProyectile(sprite);
            break;
        case SpriteID.ARCHER_PROYECTILE_LEFT:
            updateArcherProyectileLeft(sprite);
            break;
        default:
            console.error("Error: failed to update sprites");
            break;
    }
}
function calculateCollisionWithBorders(sprite) {
    let isCollision = false;
    //Colision con el borde derecho de la pantalla
    if (sprite.xPos + sprite.imageSet.xSize > globals.canvas.width) {
        isCollision = true;
    }
    else if (sprite.yPos + sprite.imageSet.ySize > globals.canvas.height) {
        isCollision = true;
    }
    else if (sprite.xPos < 0 || sprite.yPos < 0) {
        //Colision con el borde izquierdo
        isCollision = true;
    }
    return isCollision;
}
function updateLife() {
    for (let i = 1; i < globals.sprites.length; i++) {
        const sprite = globals.sprites[i];
        if (sprite.isCollidingWithPlayer === true) {
            // Si hay colision reducimos la vida
            globals.life--;
        }
    }
    if (globals.life <= 0) {
        globals.gameState = Game.OVER;
    }
}
function generateEnemiesRandomly() {
    const time = globals.enemiesTimers.value;
    initKnight2();
    if (time < 30 && time > 0) {
        initKnightArcher();
    }
    else if (time < 60 && time > 30) {
        initKnight2();
        initKnightShield();
    }
    else if (time > 60) {
        initKnight2();
        initKnightShield();
        initKnightArcher();
    }
}
function initEnemiRandomly() {
    let random = Math.random() * 10 + 1;
    const time = globals.enemiesTimers.value;
    if (random > 9 && time % 5 === 0) {
        generateEnemiesRandomly();
    }
}
function updateTimers(timer) {
    timer.timeChangeCounter += globals.deltaTime;
    if (timer.timeChangeCounter > timer.timeChangeValue) {
        timer.value--;
        timer.timeChangeCounter = 0;
    }
}
function updateTimersPlus(timer) {
    timer.timeChangeCounter += globals.deltaTime;
    if (timer.timeChangeCounter > timer.timeChangeValue) {
        timer.value++;
        timer.timeChangeCounter = 0;
    }
}
function updateLevelTimer() {
    const timer = globals.levelTimer;
    updateTimers(timer);
}
function updateCamera() {
    // Centramos la camara en el player
    const player = globals.sprites[0];
    globals.camera.x = Math.floor(player.xPos) + Math.floor((player.imageSet.xSize - globals.canvas.width) / 2);
    globals.camera.y = Math.floor(player.yPos) + Math.floor((player.imageSet.ySize - globals.canvas.height) / 2);
}
function resetCamera() {
    globals.camera.x = Math.floor(globals.canvas.width);
    globals.camera.y = Math.floor(globals.canvas.height);
}
function updateLifeIcon() {
    const life = globals.life;
    for (let i = 0; i < 5; i++) {
        if (life / 10 === i) {
            globals.spritesHUD.splice(i, 1);
        }
    }
}
function updateParticles() {
    for (let i = 0; i < globals.particles.length; i++) {
        const particle = globals.particles[i];
        if (particle.id === ParticleID.FIRE && particle.state === ParticleState.OFF) {
            globals.particles.splice(i, 1);
            i--;
            createFireParticle();
        }
        else {
            updateParticle(particle);
        }
        if (particle.state === ParticleState.OFF) {
            globals.particles.splice(i, 1);
            i--;
        }
    }
}
function updateParticle(particle) {
    const type = particle.id;
    switch (type) {
        // Caso del jugador
        case ParticleID.EXPLOSION:
            if (globals.gameState != Game.PLAYING) {
                particle.state = ParticleState.OFF;
            }
            particle.update();
            break;
        case ParticleID.FIRE:
            if (globals.gameState != Game.PLAYING) {
                particle.state = ParticleState.OFF;
            }
            particle.update();
            break;
        case ParticleID.FIREWORKS:
            if (globals.gameState != Game.HIGHSCORES) {
                particle.state = ParticleState.OFF;
            }
            particle.update();
            break;
        default:
            break;
    }
}
