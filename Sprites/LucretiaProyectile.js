import Sprite from "./Sprite.js";
import ImageSet from "../src/ImageSet.js";
import Frames from "../src/Frames.js";
import Physics from "../src/Physics.js";
import HitBox from "../src/HitBox.js";
import { SpriteID, State } from "../src/constants.js";
import globals from "../src/globals.js";

export default class LucretiaProyectile extends Sprite {
    constructor(id, state, xPos, yPos, imageSet, frames, hud, physics, hitBox, lucretiaProyectile){

        super(id, state, xPos, yPos, imageSet, frames, hud, physics, hitBox);
        this.lucretiaProyectile    = lucretiaProyectile;
        this.isCollidingWithSprite = false;             // variable que indica si colisiona con un sprite
    }

    static create(xPos, yPos){
        const imageSet      = new ImageSet(30, 0, 50, 50, 120, 80, 45, 20);

        const frames        = new Frames(1);
    
        const physics       = new Physics(150, 0, 0, 0, 0);

        const hitBox        = new HitBox(25, 25, 14, 8); 
    
        return new LucretiaProyectile(SpriteID.LUCRETIA_PROYECTILE_RIGHT, State.LUCRETIA_PROYECTILE_RIGHT, xPos, yPos, imageSet, frames, false, physics, hitBox, true);
    }

    static createUp(xPos, yPos){
        const imageSet      = new ImageSet(30, 2, 50, 50, 120, 80, 45, 20);

        const frames        = new Frames(1);
    
        const physics       = new Physics(150, 0, 0, 0, 0);
    
        const hitBox        = new HitBox(25, 25, 5, 8); 

        return new LucretiaProyectile(SpriteID.LUCRETIA_PROYECTILE_UP, State.LUCRETIA_PROYECTILE_UP, xPos, yPos, imageSet, frames, false, physics, hitBox, true);
    
    }

    static createLeft(xPos, yPos){
        const imageSet      = new ImageSet(30, 1, 50, 50, 120, 80, 45, 20);

        const frames        = new Frames(1);
    
        const physics       = new Physics(150, 0, 0, 0, 0);
        
        const hitBox        = new HitBox(25, 25, 14, 8); 
    
        return new LucretiaProyectile(SpriteID.LUCRETIA_PROYECTILE_LEFT, State.LUCRETIA_PROYECTILE_LEFT, xPos, yPos, imageSet, frames, false, physics, hitBox, true);
    

    }

    static createDown(xPos, yPos){
        const imageSet      = new ImageSet(30, 3, 50, 50, 120, 80, 45, 20);

        const frames        = new Frames(1);
    
        const physics       = new Physics(150, 0, 0, 0, 0);
    
        const hitBox        = new HitBox(25, 25, 2, 15); 
        
        return new LucretiaProyectile(SpriteID.LUCRETIA_PROYECTILE_DOWN, State.LUCRETIA_PROYECTILE_DOWN, xPos, yPos, imageSet, frames, false, physics, hitBox, true);
    
    }

}