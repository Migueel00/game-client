import ImageSet from "../ImageSet.js";
import Frames from "../Frames.js";

// Class base from potions 
export default class Potion{
    id: number;
    state: number;
    xPos: number;
    yPos: number;
    imageSet: ImageSet;
    frames: Frames;


    constructor(
        id : number,
        state: number,
        xPos: number,
        yPos: number,
        imageSet: ImageSet,
        frames: Frames,
        ){
        
        this.id = id; // id del sprite
        this.state = state ;
        this.xPos = xPos;
        this.yPos = yPos;
        this.imageSet = imageSet;
        this.frames = frames;
    }
}
