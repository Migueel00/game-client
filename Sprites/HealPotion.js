import Sprite from "./Sprite.js";
import ImageSet from "../src/ImageSet.js";
import Frames from "../src/Frames.js";
import { SpriteID, State } from "../src/constants.js";

export default class HealPotion extends Sprite {
    constructor(id, state, xPos, yPos, imageSet, frames, hud, physics, hitBox, timer){

        super(id, state, xPos, yPos, imageSet, frames, hud, physics, hitBox, timer);
        this.timer = timer;
    }

    static create(){
        const imageSet      = new ImageSet(32, 0, 120, 80, 120, 80, 0, 10);

        const frames        = new Frames(4, 0);
    
        return new HealPotion(SpriteID.HEAL_POTION, State.HEAL, 0, 38, imageSet, frames, true, 0, 0);
    }
}
