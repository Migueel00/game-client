import Particle from "./Particle.js";
import globals from "../globals.js";
import { ParticleState } from "../constants.js";
export default class FireParticle extends Particle {
    fadeCounter;
    timeToFade;
    constructor(id, state, xPos, yPos, radius, alpha, physics, timeToFade) {
        super(id, state, xPos, yPos, radius, alpha, physics);
        this.fadeCounter = 0;
        this.timeToFade = timeToFade;
    }
    update() {
        this.updateFireParticle();
    }
    updateFireParticle() {
        switch (this.state) {
            case ParticleState.ON:
                this.radius -= 0.1;
                if (this.radius < 2) {
                    this.state = ParticleState.FADE;
                }
                break;
            case ParticleState.FADE:
                this.alpha -= 0.3;
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
}
