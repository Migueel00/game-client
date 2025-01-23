import Particle from "./Particle.js";
import { ParticleID, ParticleState } from "../constants.js";
import globals from "../globals.js";
import { PhysicsParticle } from "../Physics";

export default class ExplosionParticle extends Particle{
    fadeCounter: number;
    timeToFade: number;

    constructor(
        id: number,
        state: number,
        xPos: number,
        yPos: number,
        radius: number,
        alpha: number,
        physics: PhysicsParticle,
        timeToFade: number,
    ){

        super(id, state, xPos, yPos, radius, alpha, physics);

        this.fadeCounter    = 0;
        this.timeToFade     = timeToFade;
    }

    public update() : void{
        switch(this.id){
            case ParticleID.FIREWORKS:
                this.updateFireworkParticle();
                break;

            case ParticleID.EXPLOSION:
                this.updateExplosionParticle();
                break;
        }

    }

    private updateExplosionParticle() : void {
    
        this.fadeCounter += globals.deltaTime;
    
        // Cogemos las velocidades de los arrays
        switch (this.state) {
            case ParticleState.ON:
                if (this.fadeCounter > this.timeToFade) {
    
                    this.fadeCounter = 0;
                    this.state = ParticleState.FADE;
                }
                break;
            case ParticleState.FADE:
                this.alpha -= 0.01;
    
                if (this.alpha <= 0) {
                    this.state = ParticleState.OFF;
                }
                break;
            case ParticleState.OFF:
                break;
            default:
                break;
        }
    
        this.xPos += this.physics.vx * globals.deltaTime;
        this.yPos += this.physics.vy * globals.deltaTime;
    }
    

    private updateFireworkParticle() : void {
    
        this.fadeCounter += globals.deltaTime;
    
        // Cogemos las velocidades de los arrays
        switch (this.state) {
            case ParticleState.ON:
                if (this.fadeCounter > this.timeToFade) {
    
                    this.fadeCounter = 0;
                    this.state = ParticleState.FADE;
                }
                break;
            case ParticleState.FADE:
                this.alpha -= 0.06;
    
                if (this.alpha <= 0) {
                    this.state = ParticleState.OFF;
                }
                break;
            case ParticleState.OFF:
                break;
            default:
                break;
        }
    
        this.physics.vx += this.physics.ax * globals.deltaTime;
        this.physics.vy += this.physics.ay * globals.deltaTime;
    
        //Limitamos las velocidades  a 1, para que no haya cambio de sentido
        const velModule = Math.sqrt(Math.pow(this.physics.vx, 2) + Math.pow(this.physics.vy, 2));
    
        if (velModule < 1) {
            this.physics.vx = 0;
            this.physics.vy = 0;
        }
    
        this.xPos += this.physics.vx * globals.deltaTime;
        this.yPos += this.physics.vy * globals.deltaTime;
    }
    
}
