import Sprite from "./Sprite.js";
import ImageSet from "../src/ImageSet.js";
import Frames from "../src/Frames.js";
import Physics from "../src/Physics.js";
import HitBox from "../src/HitBox.js";
import { SpriteID , State} from "../src/constants.js";
import globals from "../src/globals.js";

export default class EnemyArcher extends Sprite{
    constructor(id, state, xPos, yPos, imageSet, frames, hud, physics, hitBox){

        super(id, state, xPos, yPos, imageSet, frames, hud, physics, hitBox);
        this.isCollidingWithPlayerProyectile = false;
        this.enemyArcher                     = true;
        this.enemy                           = true;
    }

    static create(){
        const imageSet      = new ImageSet(16, 0, 80, 80, 120, 80, 0, 0);
    
        const frames        = new Frames(6, 10);
    
        // valores iniciales para Physics 
        const initAngle     = 90 * Math.PI / 180;
        const omega         = 0.10;
        const xRotCenter    = globals.canvas.width / 2;
        const yRotCenter    = globals.canvas.height / 2;
    
        // Objeto physics 
        const physics       = new Physics(0, omega, initAngle, xRotCenter, yRotCenter);
    
        const hitBox        = new HitBox(16, 40, 37, 22);
        
        return new EnemyArcher(SpriteID.KNIGHT_ARCHER, State.KNIGHT_ARCHER_RIGHT, 0, 0, imageSet, frames, false, physics, hitBox);
    }
}
