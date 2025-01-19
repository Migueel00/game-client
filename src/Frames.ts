export default class Frames {
    
    framesPerState: number;
    frameCounter: number;
    speed: number;
    frameChangeCounter: number;

    constructor(framesPerState: number, speed = 1) {

        this.framesPerState = framesPerState; //Número de frames por estado de animacion
        this.frameCounter = 0; //Contador de frames
        this.speed = speed; //Velocidad de cambio de frame(minimo: 1 a mayor número, más lento);
        this.frameChangeCounter = 0; //Contador de velocidad de cambio de frame
    }
}
