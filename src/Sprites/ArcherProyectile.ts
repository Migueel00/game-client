import Frames from "../Frames.js";
import HitBox from "../HitBox.js";
import ImageSet from "../ImageSet.js";
import Physics from "../Physics.js";
import { SpriteID, State } from "../constants.js";
import Sprite from "./Sprite.js";

export default class ArcherProyectile extends Sprite {
    constructor(
        id: number,
        state: number,
        xPos: number,
        yPos: number,
        imageSet: ImageSet,
        frames: Frames,
        physics: Physics,
        hitBox: HitBox
    ) {
        super(id, state, xPos, yPos, imageSet, frames, physics, hitBox);
    }

    public static create(xPos: number, yPos: number): ArcherProyectile {
        const imageSet = new ImageSet(21, 0, 60, 30, 120, 80, 30, 20);

        const frames = new Frames(1);

        const physics = new Physics(60);

        const hitBox = new HitBox(16, 21, 14, 5);

        return new ArcherProyectile(SpriteID.ARCHER_PROYECTILE, State.ARCHER_PROYECTILE_HORIZONTAL, xPos, yPos, imageSet, frames, physics, hitBox);
    }

    public static createLeft(xPos: number, yPos: number): ArcherProyectile {
        const imageSet = new ImageSet(21, 0, 60, 30, 120, 80, 30, 20);

        const frames = new Frames(1, 0);

        const physics = new Physics(60);

        const hitBox = new HitBox(16, 21, 14, 5);

        return new ArcherProyectile(SpriteID.ARCHER_PROYECTILE_LEFT, State.ARCHER_PROYECTILE_HORIZONTAL, xPos, yPos, imageSet, frames, physics, hitBox);
    }

    public update(): void {
        
    }
}