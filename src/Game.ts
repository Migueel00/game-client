import GameLogic from "./GameLogic.js";
import render from "./gameRender.js";
import globals from "./globals.js";
import { initCamera, initEvents, initHTMLelements, initLevel, initObstacles, initParticles, initSprites, initTimers, initVars, loadAssets } from "./initialize.js";


export default class Game {
  private gameLogic : GameLogic;

  constructor() {
    this.gameLogic = new GameLogic();
  }

  public async init() : Promise<void> {
    initHTMLelements();
    await loadAssets();  // Ahora esperamos la carga de assets
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

  private gameLoop(timeStamp : number) : void{ // Loop del juego
    window.requestAnimationFrame(this.gameLoop.bind(this));

    const elapsedCycleSeconds = (timeStamp - globals.previousCycleMiliseconds) / 1000; //seconds
    globals.previousCycleMiliseconds = timeStamp;
    globals.deltaTime += elapsedCycleSeconds;

    if(globals.deltaTime >= globals.frameTimeObj){
      this.gameLogic.update();
      render();
      globals.deltaTime = 0;
    }
  }
}