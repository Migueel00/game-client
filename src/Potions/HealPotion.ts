import Potion from "./Potion.js";
import ImageSet from "../ImageSet.js";
import Frames from "../Frames.js";
import Timer from "../Timer.js";
import Lucretia from "../../Sprites/Lucretia.js";
import { SpriteID, State } from "../constants.js";

export default class HealPotion extends Potion {
    timer: Timer;
    lucretia: Lucretia;

    constructor(
        id: number,
        state: number,
        xPos: number,
        yPos: number,
        imageSet: ImageSet,
        frames: Frames,
        timer: Timer,
        lucretia: Lucretia
    ) {
        super(id, state, xPos, yPos, imageSet, frames);

        this.timer = timer;
        this.lucretia = lucretia;
    }

    public static create(lucretia: Lucretia): HealPotion {
        const imageSet = new ImageSet(32, 0, 120, 80, 120, 80, 0, 10);
        const frames = new Frames(4, 0);
        const timer = new Timer(0, 5);
        return new HealPotion(SpriteID.HEAL_POTION, State.HEAL, 0, 38, imageSet, frames, timer, lucretia);
    }

    
}