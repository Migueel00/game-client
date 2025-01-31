import globals from "./globals.js";
import {initHTMLelements, loadAssets,initVars, initSprites, initLevel, initEvents, initObstacles, initTimers, initCamera, initParticles} from "./initialize.js"
import update from "./gameLogic.js";
import render from "./gameRender.js";

//GAME INIT

window.onload = init;

function init() : void{

    //Inicializamos los elementos HTML: Canvas, Context, Caja de texto de pruebas
    initHTMLelements();

    //Cargamos todos los elementos activos: TILEMAPS, IMAGES; SOUNDS
    loadAssets();

    //Inicializamos los sprites
    initSprites();

    //Inicializamos las variables del juego
    initVars();

    //Inicializamos el mapa del juego
    initLevel();
    initObstacles();

    //Start the first frame request
    window.requestAnimationFrame(gameLoop);

    //Inicializar eventos de teclado
    initEvents();

    //Iniciar timer
    initTimers();

    initCamera();

    initParticles();
}

//GAME EXECUTE

//Bucle principal de ejecución
function gameLoop(timeStamp: number) : void{

    //Keep requesting new frames
    window.requestAnimationFrame(gameLoop);

    //Tiempo real de ciclo de ejecución
    const elapsedCycleSeconds = (timeStamp - globals.previousCycleMiliseconds) / 1000; //seconds

    //Tiempo anterior de ciclo de ejecucion
    globals.previousCycleMiliseconds = timeStamp;

    

    //Variable que corrige el tiempo de frame debido a retrasos con respecto al tiempo objetivo (frameTimeObj)
    globals.deltaTime += elapsedCycleSeconds;

    if(globals.deltaTime >= globals.frameTimeObj){

        //Update the game Logic. gameLogic.js
        update();

        //Perform the drawing operation. gameRender.js
        render();

        //Corregimos los excesos de tiempo
        globals.deltaTime = 0;
    }
}

