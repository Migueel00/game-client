import Physics, { PhysicsParticle } from "../Physics.js";

export default abstract class Particle {
    id: number;
    state: number;
    xPos: number;
    yPos: number;
    radius: number;
    alpha: number;
    physics: PhysicsParticle;

    constructor(
        id: number,
        state: number,
        xPos: number,
        yPos: number,
        radius: number,
        alpha: number,
        physics: PhysicsParticle
    ){

        this.id         = id;
        this.state      = state;
        this.xPos       = xPos;
        this.yPos       = yPos;
        this.radius     = radius;
        this.alpha      = alpha;
        this.physics    = physics;
    }

    public abstract update() : void;
}
