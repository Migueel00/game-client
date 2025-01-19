import Sprite from "./Sprite.js";
import ImageSet from "../src/ImageSet.js";
import Frames from "../src/Frames.js";
import Physics from "../src/Physics.js";
import HitBox from "../src/HitBox.js";
import { SpriteID, State } from "../src/constants.js";
export default class ArcherProyectile extends Sprite {
    constructor(id, state, xPos, yPos, imageSet, frames, hud, physics, hitBox) {
        super(id, state, xPos, yPos, imageSet, frames, hud, physics, hitBox);
    }
    static create(xPos, yPos) {
        const imageSet = new ImageSet(21, 0, 60, 30, 120, 80, 30, 20);
        const frames = new Frames(1);
        const physics = new Physics(60);
        const hitBox = new HitBox(16, 21, 14, 5);
        return new ArcherProyectile(SpriteID.ARCHER_PROYECTILE, State.ARCHER_PROYECTILE_HORIZONTAL, xPos, yPos, imageSet, frames, false, physics, hitBox);
    }
    static createLeft(xPos, yPos) {
        const imageSet = new ImageSet(21, 0, 60, 30, 120, 80, 30, 20);
        const frames = new Frames(1, 0);
        const physics = new Physics(60);
        const hitBox = new HitBox(16, 21, 14, 5);
        return new Sprite(SpriteID.ARCHER_PROYECTILE_LEFT, State.ARCHER_PROYECTILE_HORIZONTAL, xPos, yPos, imageSet, frames, false, physics, hitBox);
    }
}
