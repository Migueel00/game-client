import Sprite from "./Sprite.js";
import ImageSet from "../src/ImageSet.js";
import Frames from "../src/Frames.js";
import Physics from "../src/Physics.js";
import HitBox from "../src/HitBox.js";
import { SpriteID, State } from "../src/constants.js";
import globals from "../src/globals.js";

export default class KnightShield extends Sprite {
    directionChangeCounter: number;
    maxTimeToChangeDirection: number;
    isCollidingWithPlayerProyectile: boolean;

    constructor(
        id: number,
        state: number,
        xPos: number,
        yPos: number,
        imageSet: ImageSet,
        frames: Frames,
        hud: boolean,
        physics: Physics,
        hitBox: HitBox,
        maxTimeToChangeDirection: number
    ) {

        //LLamada al constructor de la clase Sprite
        super(id, state, xPos, yPos, imageSet, frames, hud, physics, hitBox);

        this.directionChangeCounter = 0;                             // Contador para cambio de direccion (seconds)
        this.maxTimeToChangeDirection = maxTimeToChangeDirection;      // Máximo tiempo para cambio de dirección (seconds)
        this.isCollidingWithPlayerProyectile = false;                         // Variable que indica si el sprite colisiona con un proyectil del player
        this.enemy = true;                          // Variable para indicar si es un enemigo o no

    }

    public static create() {
        const imageSet = new ImageSet(10, 0, 70, 70, 120, 80, 10, 20);

        const frames = new Frames(9, 3);

        const physics = new Physics(30);

        const maxTimeToChangeDirection = Math.floor(Math.random() * 3) + 1;

        const hitBox = new HitBox(16, 51, 34, 10);

        const canvasWidthWithoutBorders = globals.canvas.width - 2 * 32;         // Resta el doble del ancho del borde
        const xPos = Math.floor(Math.random() * canvasWidthWithoutBorders) + 32; // Suma el ancho de un borde

        const canvasHeightWithoutBorders = globals.canvas.height - 2 * 32;        // Resta el doble del alto del borde
        const yPos = Math.floor(Math.random() * canvasHeightWithoutBorders) + 32; // Suma el alto de un borde

        return new KnightShield(SpriteID.KNIGHT_SHIELD, State.KNIGHT_SHIELD_RIGHT, xPos, yPos, imageSet, frames, false, physics, hitBox, maxTimeToChangeDirection);
    }

    // hacer un update
    // hacer que solo al colisionar con un borde cambie de direccion automaticamente y ya
    // Que pueda defender de vez en cuando añadir un timer y que defienda entre 1 y 10 s con un math random


    //actualizar estado caballero escudo
    public update(lucretiaYPos : number) : void {
        const state = this.state;

        // Maquina de estados de caballero
        switch (state) {
            case State.KNIGHT_SHIELD_RIGHT:
                this.physics.vx = this.physics.vLimit;
                break;
            case State.KNIGHT_SHIELD_LEFT:
                this.physics.vx = -this.physics.vLimit;
                break;
            case State.OFF: 
                // Estado de muerte
                break;
            default:
                console.error("Error: State invalid");
        }

        // calcular la distancia que se mueve 
        this.xPos += this.physics.vx * globals.deltaTime;
        this.yPos += this.physics.vy * globals.deltaTime;

        // Actualizar la animacion
        this.updateAnimationFrame();

        // Ir a atacar a lucretia
        this.goAttackLucretia(3, lucretiaYPos);

        // cambio de direccion automatica
        this.updateDirectionRandom();

        // calcular colisiones con los bordes de la pantalla
        if (this.isCollidingWithObstacleOnTheRight || this.isCollidingWithObstacleOnTheLeft) {
            this.swapDirection();
        }

        if (this.isCollidingWithPlayerProyectile) {

            this.state = State.OFF;
        }
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

    private goAttackLucretia(vy : number, lucretiaYPos: number) : void{
        this.yPos < lucretiaYPos ? this.physics.vy = vy : this.physics.vy = -vy;
    }

    private updateDirectionRandom() : void {
        //Incrementar el tiempo para cambio de direccion
        this.directionChangeCounter += globals.deltaTime;

        if (this.directionChangeCounter > this.maxTimeToChangeDirection) {

            //Resetear el contador
            this.directionChangeCounter = 0;

            //Actualizar el tiempo de cambio de direccion aleatoriamente entre 1 y 8 s
            this.maxTimeToChangeDirection = Math.floor(Math.random() * 8) + 1;

            this.swapDirection();
        }
    }

    private swapDirection() : void {
        this.state = this.state === State.KNIGHT_RIGHT ? State.KNIGHT_LEFT : State.KNIGHT_RIGHT
    }

}