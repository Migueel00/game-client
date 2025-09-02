import GameLogic from "./GameLogic.js";
import render from "./gameRender.js";
import globals from "./globals.js";
import { initCamera, initEvents, initHTMLelements, initLevel, initObstacles, initParticles, initSprites, initTimers, initVars, loadAssets } from "./initialize.js";
export default class Game {
    gameLogic;
    constructor() {
        this.gameLogic = new GameLogic();
    }
    async init() {
        initHTMLelements();
        await loadAssets(); // Ahora esperamos la carga de assets
        initVars();
        initSprites();
        initLevel();
        initEvents();
        initObstacles();
        initTimers();
        initCamera();
        initParticles();
        window.requestAnimationFrame(this.gameLoop.bind(this));
    }
    gameLoop(timeStamp) {
        window.requestAnimationFrame(this.gameLoop.bind(this));
        const elapsedCycleSeconds = (timeStamp - globals.previousCycleMiliseconds) / 1000; //seconds
        globals.previousCycleMiliseconds = timeStamp;
        globals.deltaTime += elapsedCycleSeconds;
        if (globals.deltaTime >= globals.frameTimeObj) {
            this.gameLogic.update();
            render();
            globals.deltaTime = 0;
        }
    }
}
