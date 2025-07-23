import Frames from "../Frames.js";
import ImageSet from "../ImageSet.js";
import Timer from "../Timer.js";
import { SpriteID, State } from "../constants.js";
import globals from "../globals.js";
import { initLifeIcon } from "../initialize.js";
import Potion from "./Potion.js";
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
    //Actualizar estado heal potion
    update() {
        this.updateHealPotion();
    }
    updateHealPotion() {
        const time = this.timer.value;
        if (time >= 15) {
            this.timer.value = 15;
        }
        for (let i = 1; i < 4; i++) {
            if (time / 5 === i) {
                this.frames.frameCounter = i;
            }
        }
        // Event of healing Lucretia
        this.healPotionEvent();
    }
    healPotionEvent() {
        const life = globals.life;
        if (this.frames.frameCounter === 3 && globals.action.heal && life < 40) {
            // Add life
            globals.life += 10;
            // reset potion frames and timer
            this.frames.frameCounter = 0;
            globals.potionsTimers.value = 0;
            // Logic for the event
            for (let i = 5; i > 0; i--) {
                console.log(i);
                if (Math.floor(globals.life / 10) === i) {
                    initLifeIcon(220 + i * 15);
                    console.log(i);
                }
            }
        }
    }
}
