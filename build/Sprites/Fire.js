export default class Fire {
    constructor(id, state, xPos, yPos, imageSet, frames, hitBox) {
        this.id = id;
        this.state = state;
        this.xPos = xPos;
        this.yPos = yPos;
        this.imageSet = imageSet;
        this.frames = frames;
        this.hud = false;
        this.hitBox = hitBox;
    }
}
