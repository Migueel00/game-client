import ImageSet from "../src/ImageSet.js";
import Frames from "../src/Frames.js";
import { SpriteID, State } from "../src/constants.js";
export default class Potion {
    constructor(id, state, xPos, yPos, imageSet, frames, hud) {
        this.id = id; // id del sprite
        this.state = state;
        this.xPos = xPos;
        this.yPos = yPos;
        this.imageSet = imageSet;
        this.frames = frames;
        this.hud = hud;
    }
    static create(id) {
        let potion;
        let imageSet;
        let frames;
        switch (id) {
            case SpriteID.HEAL_POTION:
                imageSet = new ImageSet(32, 0, 120, 80, 120, 80, 0, 10);
                frames = new Frames(4, 0);
                potion = new Potion(SpriteID.HEAL_POTION, State.HEAL, 0, 38, imageSet, frames, true);
                break;
            case SpriteID.DAMAGE_POTION:
                imageSet = new ImageSet(33, 0, 50, 50, 120, 80, 30, 40);
                frames = new Frames(4, 80);
                potion = new Potion(SpriteID.DAMAGE_POTION, State.DAMAGE, 30, 216, imageSet, frames, true);
                break;
            default:
                throw new Error(`Potion with id ${id} not found`);
        }
        return potion;
    }
}
