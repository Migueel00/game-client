import Sprite from "./Sprite.js";
import ImageSet from "../src/ImageSet.js";
import Frames from "../src/Frames.js";
import Physics from "../src/Physics.js";
import HitBox from "../src/HitBox.js";
import { SpriteID , State} from "../src/constants.js";
import globals from "../src/globals.js";

export default class KnightShield extends Sprite{
    constructor(id, state, xPos, yPos, imageSet, frames, hud, physics, hitBox, maxTimeToChangeDirection){

        //LLamada al constructor de la clase Sprite
        super(id, state, xPos, yPos, imageSet, frames, hud, physics, hitBox);

        this.directionChangeCounter          = 0;                             // Contador para cambio de direccion (seconds)
        this.maxTimeToChangeDirection        = maxTimeToChangeDirection;      // Máximo tiempo para cambio de dirección (seconds)
        this.isCollidingWithPlayerProyectile = false;                         // Variable que indica si el sprite colisiona con un proyectil del player
        this.enemy                           = true;                          // Variable para indicar si es un enemigo o no

    }

    static create(){
        const imageSet      = new ImageSet(10, 0, 70, 70, 120, 80, 10, 20);

        const frames        = new Frames(9, 3);
    
        const physics       = new Physics(30);
    
        const maxTimeToChangeDirection = Math.floor(Math.random() * 3) + 1;
    
        const hitBox        = new HitBox(16, 51, 34, 10);
    
        const canvasWidthWithoutBorders = globals.canvas.width - 2 * 32;         // Resta el doble del ancho del borde
        const xPos = Math.floor(Math.random() * canvasWidthWithoutBorders) + 32; // Suma el ancho de un borde
    
        const canvasHeightWithoutBorders = globals.canvas.height - 2 * 32;        // Resta el doble del alto del borde
        const yPos = Math.floor(Math.random() * canvasHeightWithoutBorders) + 32; // Suma el alto de un borde
    
        return new KnightShield(SpriteID.KNIGHT_SHIELD, State.KNIGHT_SHIELD_RIGHT, xPos, yPos, imageSet, frames, false, physics, hitBox, maxTimeToChangeDirection);
    }

    // hacer un update
    // hacer que solo al colisionar con un borde cambie de direccion automaticamente y ya
    // Que pueda defender de vez en cuando añadir un timer y que defienda entre 1 y 10 s con un math random
}