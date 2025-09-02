import { Game, ParticleID, ParticleState, SpriteID, State, Tile } from "./constants.js";
import globals from "./globals.js";
import Particle from "./Particles/Particle.js";
import Sprite from "./Sprites/Sprite.js";


//Funcion que renderiza los gráficos
export default function render() {

    //Change what the game is doing based on the game state
    switch (globals.gameState) {
        case Game.LOADING:
            //Draw loaging spinner
            break;
        case Game.PLAYING:
            drawGame();
            break;
        case Game.NEW_GAME:
            drawNewGame();
            break;
        case Game.STORY:
            drawIstory();
            break;
        case Game.CONTROLS:
            drawControls();
            break;
        case Game.HIGHSCORES:
            drawHighscores();
            break;

        case Game.LOAD_SCORES:
            drawLoadScores();
            break;

        case Game.OVER:
            drawGameOver();
            break;
        default:
            console.error("Error: Game state invalid");
    }
}

function drawGame() {

    // moveCamera();

    //Borramos la pantalla entera
    globals.clearAllCanvas();

    // Cambiar de estado los hud
    let gameHUd : HTMLElement = document.getElementById("gameHUD")!;
    let gameHUD2 : HTMLElement = document.getElementById("gameHUD2")!;
    let gameScreen : HTMLElement = document.getElementById("gameScreen")!;

    gameHUD2.style.display = "block";
    gameHUd.style.display = "block";
    gameScreen.style.width = "890px";
    gameScreen.style.height = "80vh";
    gameScreen.style.marginTop = "-40px";


    //dibujar el mapa (nivel)
    renderMap();
    renderObstacles();

    //dibujar los elementos
    drawsprites();

    // restoreCamera();
    //dibujar el HUD
    renderHUD();

    //dibujar el HUD lateral
    renderHudSide();

    //dibujar particles
    renderParticles();
}

function drawLoadScores() {
    limpiarPantalla();
}

function drawNewGame() {
    limpiarPantalla();

    //dibujar sprites
    drawNewGameScreenSprite();

    let gameScreen : HTMLElement = document.getElementById("gameScreen")!;
    gameScreen.style.background = "black";
    gameScreen.style.marginTop = "0px";


    //Dibujar nombre del juego
    const x = globals.getCanvasCenter().x;
    globals.ctx.font = "18px Emulogic";
    globals.ctx.fillStyle = "Yellow";
    globals.ctx.textAlign = "center";
    globals.ctx.fillText("THE HUNT", x, 56);


    //dibujar new game
    globals.ctx.font = "16px Emulogic";
    globals.ctx.fillStyle = "#fff";
    globals.ctx.fillText("NEW GAME", x, 176);

    //dibujar controls
    globals.ctx.fillText("CONTROLS", x, 246);

    //Dibujar story
    globals.ctx.fillText("HISTORY", x, 316);

    //Dibujar highscores
    globals.ctx.fillText("HIGHSCORES", x, 376);
}

function drawIstory() {
    limpiarPantalla();

    //PANTALLA DEL JUEGO ESTILOS
    let gameScreen : HTMLElement = document.getElementById("gameScreen")!;
    gameScreen.style.background = "#553000";
    gameScreen.style.marginTop = "0px";

    const x = globals.canvas.width / 2;

    //Dibujar story
    globals.ctx.font = "18px Emulogic";
    globals.ctx.fillStyle = "#fff";
    globals.ctx.textAlign = "center";
    globals.ctx.fillText("HISTORY", x, 56);
    globals.ctx.font = "14px Emulogic";
    globals.ctx.fillText("ESC", 30, 60);
    drawSpritesScreenStory();

    globals.ctx.fillStyle = "black";
    globals.ctx.font = "8px Emulogic";

    const text = "Lucretia is in a forest with / the childrens there / was a poster which said / there was someone searching / their grandsons. Lucretia  / search this man when she  / met that old man he / appreciate she for finding / their grandsons and  / told her, that 'In a / los forest is the potion / of inmortality but go /carefully there's  a lot of / enemies defending the potion' / Now Lucretia is going / to find the potion / of inmortality";
    const textArrayPar = text.split("/");

    globals.ctx.textAlign = "left";
    for (let i = 0; i < textArrayPar.length; i++) {
        const parrafo = textArrayPar[i];

        globals.ctx.fillText(parrafo, x - 100, 184 + i * 12);
    }



}

function drawControls() {
    limpiarPantalla();

    let gameScreen : HTMLElement = document.getElementById("gameScreen")!;
    gameScreen.style.marginTop = "0px";

    const xMid = globals.canvas.width / 2;
    const xLeft = 20;

    //Dibujar Controls movement
    globals.ctx.font = "18px Emulogic";
    globals.ctx.fillStyle = "Yellow";
    globals.ctx.textAlign = "center";
    globals.ctx.fillText("CONTROLS", xMid, 56);


    globals.ctx.font = "12px Emulogic";
    globals.ctx.fillStyle = "blue";
    globals.ctx.textAlign = "left";
    globals.ctx.fillText("MOVEMENT", xLeft, 106);



    globals.ctx.font = "10px Emulogic";
    globals.ctx.fillStyle = "#fff";
    globals.ctx.fillText("RIGTH ", 30, 156);
    globals.ctx.fillText("LEFT", 30, 206);
    globals.ctx.fillText("UP ", 30, 256);
    globals.ctx.fillText("DOWN", 30, 316);
    globals.ctx.fillText("SHOOT", 30, 366);

    //Dibujar controls potions
    globals.ctx.font = "12px Emulogic";
    globals.ctx.fillStyle = "red";
    globals.ctx.fillText("POTIONS", 306, 106);

    globals.ctx.font = "10px Emulogic";
    globals.ctx.fillStyle = "#fff";
    globals.ctx.fillText("HEAL POTION", 286, 156);
    globals.ctx.fillText("DAMAGE POTION", 286, 206);
    globals.ctx.fillText("END GAME", 286, 256);


    //Dibujuar imagen del mando y imagenes
    drawControlScreenSprite();

    globals.ctx.fillText("MENU", 15, 15);
}

function drawHighscores() {
    limpiarPantalla();
    let gameScreen : HTMLElement = document.getElementById("gameScreen")!;
    gameScreen.style.marginTop = "0px";

    globals.ctx.textAlign = "center";
    const x = globals.canvas.width / 2;
    //Dibujar highscores movement
    globals.ctx.font = "18px Emulogic";
    globals.ctx.fillStyle = "Yellow";
    globals.ctx.fillText("HIGSCORES", x, 56);


    globals.ctx.font = "17px Emulogic";
    globals.ctx.fillStyle = "#fff";

    //CENNTER TEXT
    for (let i = 0; i < globals.score.length; i++) {
        const score = globals.score[i];
        globals.ctx.fillStyle = '#fff';
        globals.ctx.fillText(`${score.name}`, x + 20, 140 + i * 18);
        globals.ctx.fillStyle = "yellow";
        globals.ctx.fillText(`${score.score}`, x + 100, 140 + i * 18);
    }

    //dibujar botones para ir a pantalla inicio

    globals.ctx.fillStyle = "red";
    globals.ctx.fillText("ESC", 40, 40);

    renderParticles();
}

function drawGameOver() {
    limpiarPantalla();

    let gameScreen : HTMLElement = document.getElementById("gameScreen")!;
    gameScreen.style.marginTop = "0px";

    const score = globals.points;
    const x = globals.canvas.width / 2;
    document.getElementById("gameScreen")!.style.width = "1024px";

    globals.ctx.font = "18px Emulogic";
    globals.ctx.fillStyle = "red";

    globals.ctx.fillText("GAME OVER", x, 100);

    //Estilos username
    // let username = "AKA";
    globals.ctx.font = "10px Emulogic";
    globals.ctx.fillStyle = "#F7AE00";
    globals.ctx.fillText("username: ", 80, 250);
    globals.ctx.fillStyle = "#fff";
    globals.ctx.fillText(globals.username, 180, 250);





    //Estilos score
    globals.ctx.fillStyle = "#F7AE00";
    globals.ctx.fillText("score: ", 320, 250)
    globals.ctx.fillStyle = "#fff";
    globals.ctx.fillText(`${score}`, 365, 250);

    //Estilos new game  
    globals.ctx.fillText("<--", 20, globals.canvas.height - 40);
    globals.ctx.fillText("NEW GAME", 50, globals.canvas.height - 20);

    //Estilos highscores
    globals.ctx.fillText("       -->", 440, globals.canvas.height - 40);
    globals.ctx.fillText("HIGHSCORES", 440, globals.canvas.height - 20);

    restoreCamera();
}

function limpiarPantalla() {
    //Borramos la pantalla entera
    globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);
    globals.ctxHUD.clearRect(0, 0, globals.canvasHUD.width, globals.canvasHUD.height);
    globals.ctxHUD2.clearRect(0, 0, globals.canvasHUD2.width, globals.canvasHUD2.height);

    //quitar los huds 
    let gameHUd : HTMLElement = document.getElementById("gameHUD")!;
    let gameHUD2 : HTMLElement = document.getElementById("gameHUD2")!;
    gameHUD2.style.display = "none";
    gameHUd.style.display = "none";
}


//Funcion que dibuja el mapa
function renderMap() {

    // Es un cuadrado x
    const brickSize = globals.level.imageSet.xGridSize;
    const levelData = globals.level.data;

    //dibujar el mapa
    const num_fil = levelData.length;
    const num_col = levelData[0].length;

    for (let i = 0; i < num_fil; i++) {
        for (let j = 0; j < num_col; j++) {
            const xTile = (levelData[i][j] - 1) * brickSize;
            const yTile = 0;

            const xPos = j * 16;
            const yPos = i * 16;

            //Dibujar el nuevo fotograma del sprite en la posicion adecuada
            globals.ctx.drawImage(
                globals.tileSets[Tile.SIZE_32],  //The image file
                xTile, yTile,                    //The source x and y position
                brickSize, brickSize,            //The source height and width
                xPos, yPos,                      //The destination x and y position
                brickSize, brickSize                          //The destinantion height and width
            );

        }
    }


}

function renderObstacles() {

    // Es un cuadrado x
    const brickSize = globals.obstacles.imageSet.xGridSize;
    const levelData = globals.obstacles.data;

    //dibujar el mapa
    const num_fil = levelData.length;
    const num_col = levelData[0].length;

    for (let i = 0; i < num_fil; i++) {
        for (let j = 0; j < num_col; j++) {
            const xTile = (levelData[i][j] - 1) * brickSize;
            const yTile = 0;

            const xPos = j * 16;
            const yPos = i * 16;

            //Dibujar el nuevo fotograma del sprite en la posicion adecuada
            globals.ctx.drawImage(
                globals.tileSets[Tile.SIZE_32],  //The image file
                xTile, yTile,                    //The source x and y position
                brickSize, brickSize,            //The source height and width
                xPos, yPos,                      //The destination x and y position
                brickSize, brickSize                          //The destinantion height and width
            );

        }
    }
}

//Renderizar sprite
function renderSprite(sprite : Sprite) {

    //Calculamos la posición en el tilemap a dibujar
    const xPosInit = sprite.imageSet.initCol * sprite.imageSet.xGridSize;
    const yPosInit = sprite.imageSet.initFil * sprite.imageSet.yGridSize;

    //Calcular la posicion en el tile map a dibujar
    const xTile = xPosInit + sprite.frames.frameCounter * sprite.imageSet.xGridSize + sprite.imageSet.xOffset;
    const yTile = yPosInit + sprite.state * sprite.imageSet.yGridSize + sprite.imageSet.yOffset;



    const xPos = Math.floor(sprite.xPos);
    const yPos = Math.floor(sprite.yPos);


    // Dezplazar al centro del sprite
    globals.ctx.translate(xPos + sprite.imageSet.xSize / 2, yPos + sprite.imageSet.ySize / 2);

    // OPCIONAL: Duplicamos el tamaño
    globals.ctx.scale(1 / 2, 1 / 2);

    // volver al origen
    globals.ctx.translate(-(xPos + sprite.imageSet.xSize / 2), -(yPos + sprite.imageSet.ySize / 2));

    //Dibujamos el nuevo fotograma del sprite en la posicion adecuada
    globals.ctx.drawImage(
        globals.tileSets[Tile.SIZE_64],
        xTile, yTile,
        sprite.imageSet.xSize, sprite.imageSet.ySize,
        xPos, yPos,
        // 40,60
        sprite.imageSet.xSize, sprite.imageSet.ySize
    );

    // Restauramos el contexto inicialç
    globals.ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawsprites() {
    for (let i = 0; i < globals.sprites.length; i++) {
        const sprite = globals.sprites[i];

        // drawSpriteRectangle(sprite);
        sprite.state !== State.OFF ? renderSprite(sprite) : false;
        // drawHitBox(sprite); 
    }
}

function drawSpritesHUD() {
    for (let i = 0; i < globals.spritesHUD.length; i++) {
        const sprite = globals.spritesHUD[i];

        renderSpriteHud(sprite);
    }
}

function drawSpritesHUDSide() {
    for (let i = 0; i < globals.spritesHUD.length; i++) {
        const sprite = globals.spritesHUD[i];

        switch (sprite.id) {
            case SpriteID.HEAL_POTION:
            case SpriteID.DAMAGE_POTION:
                renderSpriteHudSide(sprite);
                break;
        }
    }
}


function drawSpritesScreenStory() {
    for (let i = 0; i < globals.storySprites.length; i++) {
        const sprite = globals.storySprites[i];

        renderSpriteNewGame(sprite);
    }
}

function drawControlScreenSprite() {
    for (let i = 0; i < globals.controlSprites.length; i++) {
        const sprite = globals.controlSprites[i];

        renderSpriteNewGame(sprite);
    }
}

function drawNewGameScreenSprite() {
    for (let i = 0; i < globals.spritesNewGame.length; i++) {
        const sprite = globals.spritesNewGame[i];

        renderSpriteNewGame(sprite);
    }
}

//Renderizar el HUD
function renderHUD() {

    const score = globals.points;
    const highScore = 130000;
    const time = globals.levelTimer.value;

    //Draw Score
    globals.ctxHUD.font = "8px Emulogic";
    globals.ctxHUD.fillStyle = "VIOLET";
    globals.ctxHUD.fillText("SCORE", 8, 8);
    globals.ctxHUD.fillStyle = "lightgray";
    globals.ctxHUD.fillText("" + score, 8, 16);

    //Draw high Score
    globals.ctxHUD.fillStyle = 'purple';
    globals.ctxHUD.fillText("HIGH SCORE", 72, 8);
    globals.ctxHUD.fillStyle = 'lightgray';
    globals.ctxHUD.fillText("" + highScore, 72, 16);


    //Draw level
    globals.ctxHUD.fillStyle = 'pink';
    globals.ctxHUD.fillText("Time:   ", 184, 8);
    globals.ctxHUD.fillStyle = 'lightgray';
    globals.ctxHUD.fillText(" " + time, 184, 16);

    //Draw Life 
    globals.ctxHUD.fillStyle = "#AAB7B8"
    globals.ctxHUD.fillText("HP", 264, 8);

    //Renderizar sprites
    drawSpritesHUD();
}

//renderizar hud lateral
function renderHudSide() {
    const healTimer = globals.potionsTimers.value;
    const damageTimer = globals.damagePotionTimer.value;

    //pocion de curacion
    globals.ctxHUD2.font = "16px Emulogic";
    globals.ctxHUD2.fillStyle = "yellow";

    globals.ctxHUD2.fillText("HEAL", 22, 36);
    globals.ctxHUD2.fillStyle = "#fff";
    globals.ctxHUD2.fillText("" + healTimer + " s", 32, 58);


    //pocion de daño
    globals.ctxHUD2.fillStyle = "red";
    globals.ctxHUD2.fillText("DAMAGE", 14, 190);
    globals.ctxHUD2.fillStyle = "#fff";
    globals.ctxHUD2.fillText("" + damageTimer + " s", 32, 210);

    drawSpritesHUDSide();
}

//Renderizar sprite
function renderSpriteHudSide(sprite : Sprite) {

    //Calculamos la posición en el tilemap a dibujar
    const xPosInit = sprite.imageSet.initCol * sprite.imageSet.xGridSize;
    const yPosInit = sprite.imageSet.initFil * sprite.imageSet.yGridSize;

    //Calcular la posicion en el tilemap a dibujar
    const xTile = xPosInit + sprite.frames.frameCounter * sprite.imageSet.xGridSize + sprite.imageSet.xOffset;
    const yTile = yPosInit + sprite.state * sprite.imageSet.yGridSize + sprite.imageSet.yOffset;

    const xPos = Math.floor(sprite.xPos);
    const yPos = Math.floor(sprite.yPos);

    //Dibujamos el nuevo fotograma del sprite en la posicion adecuada
    globals.ctxHUD2.drawImage(globals.tileSets[Tile.SIZE_64], xTile, yTile, sprite.imageSet.xSize, sprite.imageSet.ySize,
        xPos, yPos,
        sprite.imageSet.xSize, sprite.imageSet.ySize
    );
}

function renderSpriteHud(sprite : Sprite) {

    //Calculamos la posición en el tilemap a dibujar
    const xPosInit = sprite.imageSet.initCol * sprite.imageSet.xGridSize;
    const yPosInit = sprite.imageSet.initFil * sprite.imageSet.yGridSize;

    //Calcular la posicion en el tilemap a dibujar
    const xTile = xPosInit + sprite.frames.frameCounter * sprite.imageSet.xGridSize + sprite.imageSet.xOffset;
    const yTile = yPosInit + sprite.state * sprite.imageSet.yGridSize + sprite.imageSet.yOffset;

    const xPos = Math.floor(sprite.xPos);
    const yPos = Math.floor(sprite.yPos);

    //Dibujamos el nuevo fotograma del sprite en la posicion adecuada
    globals.ctxHUD.drawImage(globals.tileSets[Tile.SIZE_64], xTile, yTile, sprite.imageSet.xSize, sprite.imageSet.ySize,
        xPos, yPos,
        35, 20
    );
}

function drawHitBox(sprite : Sprite) {
    // Datos del sprite
    const x1 = Math.floor(sprite.xPos) + Math.floor(sprite.hitBox.xOffSet);
    const y1 = Math.floor(sprite.yPos) + Math.floor(sprite.hitBox.yOffSet);
    const w1 = sprite.hitBox.xSize;
    const h1 = sprite.hitBox.ySize;

    globals.ctx.strokeStyle = "red";
    globals.ctx.strokeRect(x1, y1, w1, h1);

}

function moveCamera() {
    const xTranslation = -globals.camera.x;
    const yTranslation = -globals.camera.y;

    globals.ctx.translate(xTranslation, yTranslation);
}

function restoreCamera() {

    globals.ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function renderSpriteNewGame(sprite : Sprite) {

    //Calculamos la posición en el tilemap a dibujar
    const xPosInit = sprite.imageSet.initCol * sprite.imageSet.xGridSize;
    const yPosInit = sprite.imageSet.initFil * sprite.imageSet.yGridSize;

    //Calcular la posicion en el tile map a dibujar
    const xTile = xPosInit + sprite.frames.frameCounter * sprite.imageSet.xGridSize + sprite.imageSet.xOffset;
    const yTile = yPosInit + sprite.state * sprite.imageSet.yGridSize + sprite.imageSet.yOffset;



    const xPos = Math.floor(sprite.xPos);
    const yPos = Math.floor(sprite.yPos);

    //Dibujamos el nuevo fotograma del sprite en la posicion adecuada
    globals.ctx.drawImage(
        globals.tileSets[Tile.SIZE_64],
        xTile, yTile,
        sprite.imageSet.xSize, sprite.imageSet.ySize,
        xPos, yPos,
        // 40,60
        sprite.imageSet.xSize, sprite.imageSet.ySize
    );

    restoreCamera();

}

function renderParticles() {
    for (let i = 0; i < globals.particles.length; i++) {

        const particle = globals.particles[i];
        renderParticle(particle);
    }
}

function renderParticle(particle : Particle) {
    const type = particle.id;
    switch (type) {

        // caso del jugador
        case ParticleID.EXPLOSION:
            renderExplosionParticle(particle);
            break;

        case ParticleID.FIRE:
            renderFireParticle(particle);
            break;

        case ParticleID.FIREWORKS:
            renderFireworks(particle);
            break;

        default:
            break;
    }
}

function renderExplosionParticle(particle : Particle) {

    if (particle.state != ParticleState.OFF) {

        globals.ctx.fillStyle = 'blue';
        globals.ctx.globalAlpha = particle.alpha;   // set alpha
        globals.ctx.beginPath();
        globals.ctx.arc(particle.xPos, particle.yPos, particle.radius, 0, 2 * Math.PI);
        globals.ctx.fill();
        globals.ctx.globalAlpha = 1.0; // restore alpha
    }
}

function renderFireParticle(particle : Particle) {

    if (particle.state != ParticleState.OFF) {

        globals.ctx.save();
        globals.ctx.fillStyle = "red";
        globals.ctx.filter = "blur(2px) saturate(500%)";

        globals.ctx.globalAlpha = particle.alpha;
        globals.ctx.beginPath();
        globals.ctx.arc(particle.xPos, particle.yPos, particle.radius, 0, 2 * Math.PI);

        globals.ctx.fill();
        globals.ctx.restore();
    }
}

// Particula Fuegos Artificiales
function renderFireworks(particle : Particle) {
    let color = randomColor();

    if (particle.state != ParticleState.OFF) {

        globals.ctx.fillStyle = color;
        globals.ctx.globalAlpha = particle.alpha;   // set alpha
        globals.ctx.beginPath();
        globals.ctx.arc(particle.xPos, particle.yPos, particle.radius, 0, 2 * Math.PI);
        globals.ctx.fill();
        globals.ctx.globalAlpha = 1.0; // restore alpha
    }
}

function randomColor() {

    let r = Math.floor(Math.random() * 255 + 1);
    let g = Math.floor(Math.random() * 255 + 1);
    let b = Math.floor(Math.random() * 255 + 1);

    let randomColor = `rgb(${r}, ${g}, ${b})`;

    return randomColor;
}