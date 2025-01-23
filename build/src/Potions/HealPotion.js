import Potion from "./Potion.js";
import ImageSet from "../ImageSet.js";
import Frames from "../Frames.js";
import Timer from "../Timer.js";
import { SpriteID, State } from "../constants.js";
export default class HealPotion extends Potion {
    timer;
    lucretia;
    constructor(id, state, xPos, yPos, imageSet, frames, timer, lucretia) {
        super(id, state, xPos, yPos, imageSet, frames);
        this.timer = timer;
        this.lucretia = lucretia;
    }
    static create(lucretia) {
        const imageSet = new ImageSet(32, 0, 120, 80, 120, 80, 0, 10);
        const frames = new Frames(4, 0);
        const timer = new Timer(0, 5);
        return new HealPotion(SpriteID.HEAL_POTION, State.HEAL, 0, 38, imageSet, frames, timer, lucretia);
    }
}
