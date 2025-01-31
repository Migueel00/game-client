export default class Fire {
    id;
    state;
    xPos;
    yPos;
    imageSet;
    frames;
    hitBox;
    constructor(id, state, xPos, yPos, imageSet, frames, hitBox) {
        this.id = id;
        this.state = state;
        this.xPos = xPos;
        this.yPos = yPos;
        this.imageSet = imageSet;
        this.frames = frames;
        this.hitBox = hitBox;
    }
    update() {
        // update frame animation
        this.updateAnimationFrame();
    }
    updateAnimationFrame() {
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
