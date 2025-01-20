import Frames from "../Frames.js";
export default class StaticSprite {
    constructor(id, state, xPos, yPos, imageSet) {
        this.id = id;
        this.state = state;
        this.xPos = xPos;
        this.yPos = yPos;
        this.frames = new Frames(1);
        this.imageSet = imageSet;
        this.hud = true;
    }
}
