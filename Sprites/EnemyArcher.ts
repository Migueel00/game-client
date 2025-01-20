import ImageSet from "../src/ImageSet.js";
import Frames from "../src/Frames.js";
import Physics from "../src/Physics.js";
import HitBox from "../src/HitBox.js";
import { SpriteID, State } from "../src/constants.js";
import globals from "../src/globals.js";
import Sprite from "./Sprite.js";
import { initArcherProyectile, initArcherProyectileLeft } from "../src/initialize.js";
import { positionLucretia } from "../src/gameLogic.js";

export default class EnemyArcher extends Sprite {
    isCollidingWithPlayerProyectile: boolean;
    enemyArcher: boolean;

    constructor(
        id: number,
        state: number,
        xPos: number,
        yPos: number,
        imageSet: ImageSet,
        frames: Frames,
        hud: boolean,
        physics: Physics,
        hitBox: HitBox
    ) {

        super(id, state, xPos, yPos, imageSet, frames, hud, physics, hitBox);
        this.isCollidingWithPlayerProyectile = false;
        this.enemyArcher = true;
        this.enemy = true;
    }

    public static create(): EnemyArcher {
        const imageSet = new ImageSet(16, 0, 80, 80, 120, 80, 0, 0);

        const frames = new Frames(6, 10);

        // valores iniciales para Physics 
        const initAngle = 90 * Math.PI / 180;
        const omega = 0.10;
        const xRotCenter = globals.canvas.width / 2;
        const yRotCenter = globals.canvas.height / 2;

        // Objeto physics 
        const physics = new Physics(0, omega, initAngle, xRotCenter, yRotCenter);

        const hitBox = new HitBox(16, 40, 37, 22);

        return new EnemyArcher(SpriteID.KNIGHT_ARCHER, State.KNIGHT_ARCHER_RIGHT, 0, 0, imageSet, frames, false, physics, hitBox);
    }

    public update(): void {

        this.updateKnightArcher();
    }
    //actualizar estado de caballero arquero
    private updateKnightArcher(): void {
        // Actualizar el angulo de giro
        this.physics.angle += this.physics.omega * globals.deltaTime;

        // calcular nueva posicion
        this.setKnightArcherPosition();

        this.updateAnimationFrame();

        const time = globals.shootTimer.value;

        let xPosLucretia = positionLucretia().xPos;
        if (xPosLucretia > this.xPos) {
            this.state = State.KNIGHT_ARCHER_ATTACK_RIGHT;
            if (time % 56 === 0) {
                initArcherProyectile(this.xPos, this.yPos + this.hitBox.ySize - 20);
            }

        } else {
            if (time % 56 === 0) {
                initArcherProyectileLeft(this.xPos, this.yPos + this.hitBox.ySize - 20);
            }
            this.state = State.KNIGHT_ARCHER_ATTACK_LEFT;
        }

        if (this.isCollidingWithObstacleOnTheLeft || this.isCollidingWithObstacleOnTheRight || this.isCollidingWithObstacleOnTheTop || this.isCollidingWithObstacleOnTheBottom) {

            this.physics.omega = -this.physics.omega;
        }

        if (this.isCollidingWithPlayerProyectile) {

            this.state = State.OFF;
        }
    }

    private updateAnimationFrame(): void {

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


    private setKnightArcherPosition(): void {
        // Movimiento circular
        // x = xCenter + Acos(angle)
        // y = yCenter + Asin(angle)
        const radius = 110;

        let xPos = 40;
        let yPos = 40;

        this.xPos = xPos + radius * Math.cos(this.physics.angle);
        this.yPos = yPos + radius * Math.sin(this.physics.angle);

        // Centramos el giro respecto del centro del sprite (Lucretia)
        this.xPos -= this.imageSet.xSize / 2;
        this.yPos -= this.imageSet.ySize / 2;
    }

}
