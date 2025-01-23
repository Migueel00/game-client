export default class Particle {
    id;
    state;
    xPos;
    yPos;
    radius;
    alpha;
    physics;
    constructor(id, state, xPos, yPos, radius, alpha, physics) {
        this.id = id;
        this.state = state;
        this.xPos = xPos;
        this.yPos = yPos;
        this.radius = radius;
        this.alpha = alpha;
        this.physics = physics;
    }
}
