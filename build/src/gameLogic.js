import CollisionManager from "./CollisionManager.js";
import { Game, ParticleID, ParticleState, Sound, SpriteID, State } from "./constants.js";
import { createUserName, getPlayerData, postNewScore } from "./event.js";
import globals from "./globals.js";
import { createFireParticle, initFireworks, initKnight2, initKnightArcher, initKnightShield, initLifeIcon } from "./initialize.js";
export default class GameLogic {
    update() {
        switch (globals.gameState) {
            case Game.LOADING:
                console.log("Loading assets....");
                break;
            case Game.PLAYING:
                this.playGame();
                break;
            case Game.NEW_GAME:
                this.newGame();
                break;
            case Game.CONTROLS:
                this.controls();
                break;
            case Game.STORY:
                this.story();
                break;
            case Game.HIGHSCORES:
                this.highScores();
                break;
            case Game.OVER:
                this.gameOver();
                break;
            case Game.LOAD_SCORES:
                this.loadScores();
                break;
            default:
                console.error("Error : Game state invalid");
        }
        if (globals.action.enter) {
            globals.sounds[Sound.GAME_MUSIC].play();
            globals.sounds[Sound.GAME_MUSIC].volume = 0.4;
        }
    }
    updateTimers(timer) {
        timer.timeChangeCounter += globals.deltaTime;
        if (timer.timeChangeCounter > timer.timeChangeValue) {
            timer.value--;
            timer.timeChangeCounter = 0;
        }
    }
    updateTimersPlus(timer) {
        timer.timeChangeCounter += globals.deltaTime;
        if (timer.timeChangeCounter > timer.timeChangeValue) {
            timer.value++;
            timer.timeChangeCounter = 0;
        }
    }
    updateLevelTimer() {
        this.updateTimers(globals.levelTimer);
    }
    updateShootTimer() {
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
    updateDamagePotionTimer() {
        globals.damagePotionTimer.timeChangeCounter += globals.deltaTime;
        if (globals.damagePotionTimer.timeChangeCounter > globals.damagePotionTimer.timeChangeValue) {
            globals.damagePotionTimer.value++;
            globals.damagePotionTimer.timeChangeCounter = 0;
        }
    }
    updateArcherProyectile(sprite) {
        switch (sprite.state) {
            case State.ARCHER_PROYECTILE_HORIZONTAL:
                sprite.physics.vx = sprite.physics.vLimit;
                sprite.physics.vy = 0;
                sprite.frames.frameCounter = 0;
                break;
        }
        sprite.xPos += sprite.physics.vx * globals.deltaTime;
        this.calculateCollisionSpriteAndRemove(sprite);
    }
    calculateCollisionWithBorders(sprite) {
        if (sprite.xPos + sprite.imageSet.xSize > globals.canvas.width ||
            sprite.yPos + sprite.imageSet.ySize > globals.canvas.height ||
            sprite.xPos < 0 ||
            sprite.yPos < 0) {
            return true;
        }
        return false;
    }
    updateArcherProyectileLeft(sprite) {
        switch (sprite.state) {
            case State.ARCHER_PROYECTILE_HORIZONTAL:
                sprite.physics.vx = -sprite.physics.vLimit;
                sprite.physics.vy = 0;
                break;
        }
        sprite.xPos += sprite.physics.vx * globals.deltaTime;
        this.calculateCollisionSpriteAndRemove(sprite);
    }
    calculateCollisionSpriteAndRemove(sprite) {
        if (this.calculateCollisionWithBorders(sprite)) {
            sprite.state = State.OFF;
        }
    }
    //////////////////////////////////////      UPDATES FOR GAME STATES
    playGame() {
        this.updateSprites();
        this.updateLife();
        this.updateTimersPlus(globals.potionsTimers);
        this.updateShootTimer();
        this.updateTimersPlus(globals.enemiesTimers);
        this.updateDamagePotionTimer();
        this.updateLevelTimer();
        this.initEnemiRandomly();
        this.updateLifeIcon();
        this.updateParticles();
        this.updateCamera();
        const collisionManager = new CollisionManager(globals.sprites);
        collisionManager.detectAllCollisions();
    }
    newGame() {
        const sprite = globals.spritesNewGame[1];
        this.updateNewGame(sprite);
        const lucretia = globals.spritesNewGame[0];
        lucretia.xPos = 370;
        lucretia.yPos = 230;
        this.updateAnimationFrame(lucretia);
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
    updateNewGame(sprite) {
        const time = globals.menuTimer.value;
        if (time >= 1) {
            if (globals.action.moveDown && sprite.yPos < 176) {
                sprite.yPos += 60;
            }
            if (globals.action.moveUp && sprite.yPos > 36) {
                sprite.yPos -= 60;
            }
        }
        this.updateMenuTimer();
    }
    updateMenuTimer() {
        this.updateTimersPlus(globals.menuTimer);
        if (globals.menuTimer.value >= 1) {
            globals.menuTimer.value = 1;
        }
        if (globals.action.moveDown || globals.action.moveUp) {
            globals.menuTimer.value = 0;
        }
    }
    story() {
        if (globals.action.escape) {
            globals.gameState = Game.NEW_GAME;
        }
    }
    controls() {
        if (globals.action.escape) {
            globals.gameState = Game.NEW_GAME;
        }
    }
    highScores() {
        if (globals.action.escape) {
            globals.gameState = Game.NEW_GAME;
        }
        this.updateTimersPlus(globals.fireworkTimer);
        if (globals.fireworkTimer.value % 20 === 0) {
            initFireworks();
        }
        this.updateParticles();
    }
    loadScores() {
        if (globals.aux === 0) {
            getPlayerData();
            globals.aux += 1;
        }
        globals.gameState = Game.HIGHSCORES;
    }
    gameOver() {
        if (globals.username.length === 3) {
            if (globals.action.escape) {
                this.resetToNewGame();
                for (let i = 0; i < globals.sprites.length; i++) {
                    const sprite = globals.sprites[i];
                    if (sprite.enemy) {
                        sprite.state = State.OFF;
                    }
                }
            }
            else if (globals.action.moveLeft) {
                postNewScore();
                this.resetToNewGame();
                globals.gameState = Game.NEW_GAME;
            }
            else if (globals.action.moveRight) {
                postNewScore();
                this.resetToNewGame();
                globals.gameState = Game.LOAD_SCORES;
            }
        }
        console.log(globals.menuTimer.value);
        console.log(globals.auxName);
        if (globals.auxName < 1 && globals.gameState === Game.OVER) {
            document.addEventListener('keydown', (event) => {
                createUserName(event.key);
            });
            globals.auxName++;
        }
    }
    resetToNewGame() {
        globals.gameState = Game.NEW_GAME;
        globals.potionsTimers.value = 0;
        globals.damagePotionTimer.value = 0;
        globals.life = 50;
        globals.levelTimer.value = 180;
        globals.points = 0;
        initLifeIcon(220);
        initLifeIcon(235);
        initLifeIcon(250);
        initLifeIcon(265);
        initLifeIcon(280);
    }
    //////////////////////////////////// UPDATE SPRITES //////////////////////////
    updateSprites() {
        for (let i = 0; i < globals.sprites.length; i++) {
            const sprite = globals.sprites[i];
            if (sprite.state === State.OFF) {
                globals.sprites.splice(i, 1);
                i--;
            }
            this.updateSprite(sprite);
        }
    }
    updateAnimationFrame(sprite) {
        sprite.frames.frameChangeCounter++;
        if (sprite.frames.frameChangeCounter === sprite.frames.speed) {
            sprite.frames.frameCounter++;
            sprite.frames.frameChangeCounter = 0;
        }
        if (sprite.frames.frameCounter === sprite.frames.framesPerState) {
            sprite.frames.frameCounter = 0;
        }
    }
    updateSprite(sprite) {
        const type = sprite.id;
        const { yPos } = positionLucretia();
        switch (type) {
            case SpriteID.KNIGHT:
            case SpriteID.KNIGHT_SHIELD:
                sprite.update(yPos);
                break;
            case SpriteID.KNIGHT_ARCHER:
            case SpriteID.LUCRETIA:
            case SpriteID.FIRE:
            case SpriteID.LUCRETIA_PROYECTILE:
                sprite.update();
                break;
            case SpriteID.ARCHER_PROYECTILE:
                this.updateArcherProyectile(sprite);
                break;
            case SpriteID.ARCHER_PROYECTILE_LEFT:
                this.updateArcherProyectileLeft(sprite);
                break;
            default:
                console.error("Error: failed to update sprites");
                break;
        }
    }
    updateLife() {
        for (let i = 1; i < globals.sprites.length; i++) {
            const sprite = globals.sprites[i];
            if (sprite.isCollidingWithPlayer === true) {
                globals.life--;
            }
        }
        if (globals.life <= 0) {
            globals.gameState = Game.OVER;
        }
    }
    generateEnemiesRandomly() {
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
    initEnemiRandomly() {
        const random = Math.random() * 10 + 1;
        const time = globals.enemiesTimers.value;
        if (random > 9 && time % 5 === 0) {
            this.generateEnemiesRandomly();
        }
    }
    updateCamera() {
        const player = globals.sprites[0];
        globals.camera.x = Math.floor(player.xPos) + Math.floor((player.imageSet.xSize - globals.canvas.width) / 2);
        globals.camera.y = Math.floor(player.yPos) + Math.floor((player.imageSet.ySize - globals.canvas.height) / 2);
    }
    resetCamera() {
        globals.camera.x = Math.floor(globals.canvas.width);
        globals.camera.y = Math.floor(globals.canvas.height);
    }
    updateLifeIcon() {
        const life = globals.life;
        for (let i = 0; i < 5; i++) {
            if (life / 10 === i) {
                globals.spritesHUD.splice(i, 1);
            }
        }
    }
    updateParticles() {
        for (let i = 0; i < globals.particles.length; i++) {
            const particle = globals.particles[i];
            if (particle.id === ParticleID.FIRE && particle.state === ParticleState.OFF) {
                globals.particles.splice(i, 1);
                i--;
                createFireParticle();
            }
            else {
                this.updateParticle(particle);
            }
            if (particle.state === ParticleState.OFF) {
                globals.particles.splice(i, 1);
                i--;
            }
        }
    }
    updateParticle(particle) {
        switch (particle.id) {
            case ParticleID.EXPLOSION:
                if (globals.gameState !== Game.PLAYING) {
                    particle.state = ParticleState.OFF;
                }
                particle.update();
                break;
            case ParticleID.FIRE:
                if (globals.gameState !== Game.PLAYING) {
                    particle.state = ParticleState.OFF;
                }
                particle.update();
                break;
            case ParticleID.FIREWORKS:
                if (globals.gameState !== Game.HIGHSCORES) {
                    particle.state = ParticleState.OFF;
                }
                particle.update();
                break;
            default:
                break;
        }
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
