import Sprite from "./Sprite.js";
import ImageSet from "../src/ImageSet.js";
import Frames from "../src/Frames.js";
import Physics from "../src/Physics.js";
import HitBox from "../src/HitBox.js";
import { ProyectileType, SpriteID, State } from "../src/constants.js";

export default class LucretiaProyectile extends Sprite {
    constructor(id, state, xPos, yPos, imageSet, frames, hud, physics, hitBox, lucretiaProyectile){

        super(id, state, xPos, yPos, imageSet, frames, hud, physics, hitBox);
        this.lucretiaProyectile    = lucretiaProyectile;
        this.isCollidingWithSprite = false;             // variable que indica si colisiona con un sprite
    }

    static create(xPos, yPos, type){
        const imageSet      = new ImageSet(30, 0, 50, 50, 120, 80, 45, 20);

        const frames        = new Frames(1);
    
        const physics       = new Physics(150, 0, 0, 0, 0);
        let hitBox;
        let sprite;

        console.log(`el tipo es ${type}`)
        switch(type){
            case ProyectileType.UP:
                hitBox = new HitBox(25, 25, 5, 8); 
                sprite = new LucretiaProyectile(SpriteID.LUCRETIA_PROYECTILE_UP, State.LUCRETIA_PROYECTILE_UP, xPos, yPos, imageSet, frames, false, physics, hitBox, true);
                break;

            case ProyectileType.DOWN:
                hitBox = new HitBox(25, 25, 2, 15); 
                sprite = new LucretiaProyectile(SpriteID.LUCRETIA_PROYECTILE_DOWN, State.LUCRETIA_PROYECTILE_DOWN, xPos, yPos, imageSet, frames, false, physics, hitBox, true);
                break;

            case ProyectileType.LEFT:
                hitBox = new HitBox(25, 25, 14, 8); 
                sprite = new LucretiaProyectile(SpriteID.LUCRETIA_PROYECTILE_LEFT, State.LUCRETIA_PROYECTILE_LEFT, xPos, yPos, imageSet, frames, false, physics, hitBox, true);
                break;

            case ProyectileType.RIGHT:
                hitBox = new HitBox(25, 25, 14, 8);
                sprite = new LucretiaProyectile(SpriteID.LUCRETIA_PROYECTILE_RIGHT, State.LUCRETIA_PROYECTILE_RIGHT, xPos, yPos, imageSet, frames, false, physics, hitBox, true); 
                break;

            default:
                console.error(`Error al crear el tipo de proyectil ${type}`);
        }

        return sprite;
    }
}