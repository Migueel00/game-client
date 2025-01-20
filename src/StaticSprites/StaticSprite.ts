import Frames from "../Frames.js";
import ImageSet from "../ImageSet.js";

export default class StaticSprite{
    id: number;
    state: number;
    xPos: number;
    yPos: number;
    frames: Frames;
    imageSet: ImageSet;
    hud: boolean;

    constructor(
        id: number,
        state: number,
        xPos: number,
        yPos: number,
        imageSet: ImageSet,
    ){
        this.id = id;
        this.state = state;
        this.xPos = xPos;
        this.yPos = yPos;
        this.frames = new Frames(1);
        this.imageSet = imageSet;
        this.hud = true;
    }
}