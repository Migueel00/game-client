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
    
    public update() :void {
        
        // update frame animation
        this.updateAnimationFrame();
    }

    private updateAnimationFrame() : void {

        //aumento el contador de tiempo entre frames
        this.frames.frameChangeCounter++;
    
        //Cambiar de frame cuando el lag de animación alcanza animSpeed
        if (this.frames.frameChangeCounter === this.frames.speed) {
    
            //Cambiamos de frame y reseteamos el contador de frame
            this.frames.frameCounter++;
            this.frames.frameChangeCounter = 0;
        }
    
        //Si hemos llegado al máximo de frames reiniciamos el contador (animacion ciclica);
        if (this.frames.frameCounter === this.frames.framesPerState) {
    
            this.frames.frameCounter = 0;
    
        }
    }
}