import Sprite from "./Sprite.js";
import ImageSet from "../src/ImageSet.js";
import Frames from "../src/Frames.js";
import Physics from "../src/Physics.js";
import HitBox from "../src/HitBox.js";
import { SpriteID, State } from "../src/constants.js";
import globals from "../src/globals.js";
export default class Knight extends Sprite {
    constructor(id, state, xPos, yPos, imageSet, frames, hud, physics, hitBox, maxTimeToChangeDirection) {
        //LLamada al constructor de la clase Sprite
        super(id, state, xPos, yPos, imageSet, frames, hud, physics, hitBox);
        this.directionChangeCounter = 0; // Contador para cambio de direccion (seconds)
        this.maxTimeToChangeDirection = maxTimeToChangeDirection; // Máximo tiempo para cambio de dirección (seconds)
        this.isCollidingWithPlayerProyectile = false; // Variable que indica si el this colisiona con un proyectil del player
        this.enemy = true; // Variable para indicar si es un enemigo o no
    }
    static create() {
        //Creamos las propiedades de las imagenes: initFil, initCol, xSize, ySize, xGridSize, yGridSize, xOffset, yOffset
        const imageSet = new ImageSet(0, 0, 50, 80, 120, 80, 30, 20);
        //creamos los datos de la animación 
        const frames = new Frames(10, 2);
        //objeto physics con vLimit = 40 pixels/seconds
        const physics = new Physics(30);
        // numero para cambiar de direccion
        const maxTimeToChangeDirection = Math.floor(Math.random() * 3) + 1;
        // Creamos el objeto hitbox
        const hitBox = new HitBox(20, 51, 14, 15);
        // Generar en posiciones aleatorias del mapa
        const canvasWidthWithoutBorders = globals.canvas.width - 2 * 62; // Resta el doble del ancho del borde
        const xPos = Math.floor(Math.random() * canvasWidthWithoutBorders) + 32; // Suma el ancho de un borde
        const canvasHeightWithoutBorders = globals.canvas.height - 2 * 64; // Resta el doble del alto del borde
        const yPos = Math.floor(Math.random() * canvasHeightWithoutBorders) + 32; // Suma el alto de un borde
        //creamos el this
        const knight = new Knight(SpriteID.KNIGHT, State.KNIGHT_RIGHT, xPos, yPos, imageSet, frames, false, physics, hitBox, maxTimeToChangeDirection);
        return knight;
    }
    //actulizar estado caballero
    update(lucretiaYPos) {
        const state = this.state;
        //Maquina de estados del caballero
        switch (state) {
            case State.KNIGHT_RIGHT:
                //Si se mueve a la derecha asignamos velocidad x positiva
                this.physics.vx = this.physics.vLimit;
                break;
            case State.KNIGHT_LEFT:
                //Si se mueve a la izquierda asignamos velocidad x negativa
                this.physics.vx = -this.physics.vLimit;
                break;
            case State.KNIGHT_ROLL:
                // Dash hacia la derecha
                this.physics.vx = this.physics.vLimit;
                //this.frames.framesPerState = 12;
                break;
            case State.KNIGHT_ROLL_LEFT:
                // Dash hacia la izquierda
                this.physics.vx = -this.physics.vLimit;
                //this.frames.framesPerState = 12;
                break;
            case State.KNIGHT_ATTACK:
                //this.frames.framesPerState = 4;
                break;
            case State.KNIGHT_ATTACK_2:
                //this.frames.framesPerState = 6;
                break;
            case State.OFF:
                // Quitar del array de sprites
                break;
            default:
        }
        //calculara las distancia que se mueve (x = x +Vt)
        this.xPos += this.physics.vx * globals.deltaTime;
        this.yPos += this.physics.vy * globals.deltaTime;
        // Direccion para atacar a lucretia
        this.goAttackLucretia(10, lucretiaYPos);
        //actualizar animacion
        this.updateAnimationFrame();
        //Cambio de direccion
        this.updateDirectionRandom();
        //Calculamos colision con los bordes de la pantalla
        if (this.isCollidingWithObstacleOnTheRight || this.isCollidingWithObstacleOnTheLeft) {
            this.swapDirection();
        }
        if (this.isCollidingWithPlayerProyectile) {
            this.state = State.OFF;
        }
        // Moviemiento acelerado aleatorio (Falta acabar xd);
        const random = Math.random() * 10 + 1;
        random > 9 ? this.physics.vLimit += 100 : this.physics.vLimit = 30;
    }
    goAttackLucretia(vy, lucretiaYPos) {
        this.yPos < lucretiaYPos ? this.physics.vy = vy : this.physics.vy = -vy;
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
    updateDirectionRandom() {
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
    swapDirection() {
        this.state = this.state === State.KNIGHT_RIGHT ? State.KNIGHT_LEFT : State.KNIGHT_RIGHT;
    }
}
