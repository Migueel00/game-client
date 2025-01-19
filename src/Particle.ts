import Physics, { PhysicsParticle } from "./Physics.js";

class Particle {
    id: number;
    state: number;
    xPos: number;
    yPos: number;
    radius: number;
    alpha: number;
    physics: Physics;

    constructor(
        id: number,
        state: number,
        xPos: number,
        yPos: number,
        radius: number,
        alpha: number,
        physics: Physics
    ){

        this.id         = id;
        this.state      = state;
        this.xPos       = xPos;
        this.yPos       = yPos;
        this.radius     = radius;
        this.alpha      = alpha;
        this.physics    = physics;
    }
}

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
}

class FireParticle extends Particle {
    fadeCounter: number;
    timeToFade: number;

    constructor(
        id: number,
        state: number,
        xPos: number,
        yPos: number,
        radius: number,
        alpha: number,
        physics: Physics,
        timeToFade: number
    ){

        super(id, state, xPos, yPos, radius, alpha, physics);

        this.fadeCounter    = 0;
        this.timeToFade     = timeToFade;
    }
}


export {
    FireParticle
}