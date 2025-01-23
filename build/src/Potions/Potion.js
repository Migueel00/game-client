// Class base from potions 
export default class Potion {
    id;
    state;
    xPos;
    yPos;
    imageSet;
    frames;
    constructor(id, state, xPos, yPos, imageSet, frames) {
        this.id = id; // id del sprite
        this.state = state;
        this.xPos = xPos;
        this.yPos = yPos;
        this.imageSet = imageSet;
        this.frames = frames;
    }
}
