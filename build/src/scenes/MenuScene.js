import { Game } from "../constants.js";
import globals from "../globals.js";
import { Scene } from "./Scene.js";
export class MenuScene extends Scene {
    constructor() {
        super("Menu");
    }
    enter() {
        console.log("Entering Menu Scene");
        // Configurar estado del juego para menú
        globals.gameState = Game.NEW_GAME;
        // Limpiar canvas
        globals.clearAllCanvas();
        // Aquí podrías inicializar sprites específicos del menú
        // Por ejemplo: globals.spritesNewGame = [...];
    }
    exit() {
        console.log("Exiting Menu Scene");
        // Limpiar recursos específicos del menú si es necesario
    }
    update(deltaTime) {
        // Lógica de actualización del menú (si tiene animaciones, etc.)
        // Por ahora, básicamente vacío ya que el menú es estático
    }
    render() {
        // Limpiar pantalla
        globals.clearAllCanvas();
        // Configurar estilo del menú
        const gameScreen = document.getElementById("gameScreen");
        if (gameScreen) {
            gameScreen.style.background = "#553000";
            gameScreen.style.marginTop = "0px";
        }
        // Dibujar contenido del menú
        this.renderMenuContent();
    }
    renderMenuContent() {
        const canvasSize = globals.getCanvasSize();
        const x = canvasSize.width / 2;
        // Título del juego
        globals.ctx.font = "18px Emulogic";
        globals.ctx.fillStyle = "Yellow";
        globals.ctx.textAlign = "center";
        globals.ctx.fillText("THE HUNT", x, 56);
        // Opciones del menú
        globals.ctx.font = "16px Emulogic";
        globals.ctx.fillStyle = "#fff";
        globals.ctx.fillText("NEW GAME", x, 176);
        globals.ctx.fillText("CONTROLS", x, 246);
        globals.ctx.fillText("HISTORY", x, 316);
        globals.ctx.fillText("HIGHSCORES", x, 376);
    }
    handleInput(event) {
        // Manejar input específico del menú
        switch (event.key) {
            case 'Enter':
                // Por ejemplo, empezar el juego
                // Aquí necesitarías el SceneManager para cambiar de escena
                console.log("Enter pressed in menu - should start game");
                break;
            case 'Escape':
                console.log("Escape pressed in menu");
                break;
            // Añadir más controles según necesites
        }
    }
}
