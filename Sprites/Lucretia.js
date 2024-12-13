import Sprite from "./Sprite.js";
import ImageSet from "../src/ImageSet.js";
import Frames from "../src/Frames.js";
import Physics from "../src/Physics.js";
import HitBox from "../src/HitBox.js";
import { SpriteID, State } from "../src/constants.js";
import globals from "../src/globals.js";
import { initLucretiaProyectile, initLucretiaProyectileDown, initLucretiaProyectileLeft, initLucretiaProyectileUp } from "../src/initialize.js";

export default class Lucretia extends Sprite {
    constructor(id, state, xPos, yPos, imageSet, frames, hud, physics, hitBox) {
        super(id, state, xPos, yPos, imageSet, frames, hud, physics, hitBox);
    }

    static create() {
        const imageSet = new ImageSet(22, 0, 90, 80, 120, 80, 30, 0);

        const frames = new Frames(6, 2);

        const physics = new Physics(80);

        const hitBox = new HitBox(16, 41, 30, 28);

        return new Lucretia(SpriteID.LUCRETIA, State.LUCRETIA_IDLE_LEFT, globals.canvas.width / 2, globals.canvas.height / 2, imageSet, frames, false, physics, hitBox);
    }

    //actualizar estado lucretia
    update(){

        // Lectura de teclado. Asignamos direccion a tecla
        this.readKeyboardAndAssignState();
        const state = this.state;

        // Maquina de estados lucretia
        switch (state){
            case State.LUCRETIA_RIGHT:
                this.physics.vx = this.physics.vLimit;
                this.physics.vy = 0;
                break;

            case State.LUCRETIA_LEFT:
                this.physics.vx = -this.physics.vLimit;
                this.physics.vy = 0;
                break;

            case State.LUCRETIA_IDLE_RIGHT:
            case State.LUCRETIA_IDLE_LEFT:
            case State.LUCRETIA_ATTACK_LEFT:
            case State.LUCRETIA_ATTACK_RIGHT:
                this.physics.vx = 0;
                this.physics.vy = 0;
                break;
            
            default:
                // caso de estar parado
                this.physics.vx = 0;
                this.physics.vy = 0;
                break;
        }

        if(globals.action.moveUp){
            this.state = this.state === State.LUCRETIA_ATTACK_LEFT 
            ? State.LUCRETIA_IDLE_LEFT  : this.state === State.LUCRETIA_ATTACK_RIGHT 
            ? State.LUCRETIA_IDLE_RIGHT : this.state;
            this.physics.vy = -this.physics.vLimit;
            this.physics.vx = 0;
        }else if(globals.action.moveDown){
            this.state = this.state === State.LUCRETIA_ATTACK_LEFT
            ? State.LUCRETIA_IDLE_LEFT  : this.state === State.LUCRETIA_ATTACK_RIGHT 
            ? State.LUCRETIA_IDLE_RIGHT : this.state;
            this.physics.vy = this.physics.vLimit;
            this.physics.vx = 0;
        }

        // ataque hacia arriba y hacia abajo con timer
        const time = globals.shootTimer.value;

        if (time >= 1) {

            if (globals.action.attack && this.state === State.LUCRETIA_IDLE_LEFT && this.physics.vy === 0 || globals.action.attack && this.state === State.LUCRETIA_IDLE_RIGHT && this.physics.vy === 0) {

                let directionProyectile = this.lucretiaAttackDirection();

                if (directionProyectile === 1) {

                    initLucretiaProyectile();
                } else if (directionProyectile === 2) {

                    initLucretiaProyectileLeft();
                }
            }

            if (globals.action.attack && this.state === State.LUCRETIA_ATTACK_LEFT) {

                initLucretiaProyectileLeft();
            } else if (globals.action.attack && this.state === State.LUCRETIA_ATTACK_RIGHT) {
                initLucretiaProyectile();
            }


            if (globals.action.attack && globals.action.moveUp) {

                this.lucretiaAttackDirection();
                initLucretiaProyectileUp();

            } else if (globals.action.attack && globals.action.moveDown) {

                this.lucretiaAttackDirection();
                initLucretiaProyectileDown();

            } else if (globals.action.attack && globals.action.moveLeft) {

                this.lucretiaAttackDirection();
                initLucretiaProyectileLeft();

            } else if (globals.action.attack && globals.action.moveRight) {

                this.lucretiaAttackDirection();
                initLucretiaProyectile();
            }

        }


        // calcularla distancia que se mueve
        this.xPos += this.physics.vx * globals.deltaTime;
        this.yPos += this.physics.vy * globals.deltaTime;

        // actualizar la animacion
        this.updateAnimationFrame();

    }

    lucretiaAttackDirection() {
        let directionProyectile;
        if (this.state === State.LUCRETIA_RIGHT || this.state === State.LUCRETIA_IDLE_RIGHT) {

            this.state = State.LUCRETIA_ATTACK_RIGHT;
            directionProyectile = 1;
        } else if (this.state === State.LUCRETIA_LEFT || this.state === State.LUCRETIA_IDLE_LEFT) {

            this.state = State.LUCRETIA_ATTACK_LEFT;

            directionProyectile = 2;
        }

        return directionProyectile;
    }

    updateAnimationFrame(){
        //aumento el contador de tiempo entre frames
        this.frames.frameChangeCounter++;

        //Cambiar de frame cuando el lag de animación alcanza animSpeed
        if(this.frames.frameChangeCounter === this.frames.speed){

            //Cambiamos de frame y reseteamos el contador de frame
            this.frames.frameCounter++;
            this.frames.frameChangeCounter = 0;
        }

        //Si hemos llegado al máximo de frames reiniciamos el contador (animacion ciclica);
        if (this.frames.frameCounter === this.frames.framesPerState){

            this.frames.frameCounter = 0;

        }
    }

    readKeyboardAndAssignState(){
        this.state =    globals.action.moveLeft  ? State.LUCRETIA_LEFT:   // Left key
                        globals.action.moveRight ? State.LUCRETIA_RIGHT:  // Right Key
                        this.state === State.LUCRETIA_LEFT  ? State.LUCRETIA_IDLE_LEFT : // No key pressed and previous state LEFT
                        this.state === State.LUCRETIA_RIGHT ? State.LUCRETIA_IDLE_RIGHT: // No key pressed and previous state RIGHT
                        this.state;
    }

}