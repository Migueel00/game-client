import ImageSet from "../src/ImageSet.js";
import Frames from "../src/Frames.js";
import Physics from "../src/Physics.js";
import HitBox from "../src/HitBox.js";

//Clase gestora de los sprites
export default abstract class Sprite{
    id: number;
    state: number;
    xPos: number;
    yPos: number;
    imageSet: ImageSet;
    frames: Frames;
    physics: Physics;
    hitBox: HitBox;
    isCollidingWithPlayer: boolean;
    isCollidingWithObstacleOnTheTop: boolean;
    isCollidingWithObstacleOnTheLeft: boolean;
    isCollidingWithObstacleOnTheBottom: boolean;
    isCollidingWithObstacleOnTheRight: boolean;
    public collisionAdjusment = {   // new properties to manage collisions
        x: 0,
        y: 0
    }

    constructor(
        id: number,
        state: number,
        xPos: number,
        yPos: number,
        imageSet : ImageSet,
        frames: Frames,
        physics: Physics,
        hitBox: HitBox
    ){

        this.id                                 = id;       // Tipo de sprite
        this.state                              = state;    // Estado de animacion del sprite
        this.xPos                               = xPos;     // Posicion en X en canvas
        this.yPos                               = yPos;     // Posicion en Y en Canvas
        this.imageSet                           = imageSet; // Datos de las imagenes del sprite
        this.frames                             = frames;   // Datos de los frames de animacion
        this.physics                            = physics;  // Datos de las fisicas
        this.hitBox                             = hitBox;   // Datos del hitbox
        this.isCollidingWithPlayer              = false;    // Variable que indica si ha habido colision con el player
        this.isCollidingWithObstacleOnTheTop    = false;    // Indicia si ha habido colisión con el player
        this.isCollidingWithObstacleOnTheLeft   = false;    // hacia la izq
        this.isCollidingWithObstacleOnTheBottom = false;    // Hacia abajo
        this.isCollidingWithObstacleOnTheRight  = false;    // Hacia la derecha
    }


    // Method for apply adjust collision
    public applyCollisionAdjustment(){
        this.xPos += this.collisionAdjusment.x;
        this.yPos += this.collisionAdjusment.y;
        this.collisionAdjusment = {x: 0, y: 0}
    }

    public abstract update(lucretiaYpos? : number) : void;
}






