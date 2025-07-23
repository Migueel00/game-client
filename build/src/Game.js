import globals from "./globals.js";
import { initHTMLelements, loadAssets, initVars, initSprites, initLevel, initEvents, initObstacles, initTimers, initCamera, initParticles } from "./initialize.js";
import update from "./gameLogic.js";
import render from "./gameRender.js";
export default class Game {
    constructor() {
    }
    init() {
        initHTMLelements();
        loadAssets();
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
            update();
            render();
            globals.deltaTime = 0;
        }
    }
}
