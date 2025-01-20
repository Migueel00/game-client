import Frames from "../src/Frames.js";
import HitBox from "../src/HitBox.js";
import ImageSet from "../src/ImageSet.js";

export default class Fire {
    id: number;
    state: number;
    xPos: number;
    yPos: number;
    imageSet: ImageSet;
    frames: Frames;
    hud: boolean;
    hitBox: HitBox;

    constructor(
        id: number,
        state: number,
        xPos: number,
        yPos: number,
        imageSet: ImageSet,
        frames: Frames,
        hitBox: HitBox
    ){
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