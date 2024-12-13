export default class Physics{

    constructor(vLimit, omega = 0, angle = 0, xRotCenter = 100, yRotCenter = 100){
        this.vx     = 0; //Velocidad actual en el eje x (pixels/seconds)
        this.vy     = 0; //Velocidad eje y
        this.vLimit = vLimit; //Velocidad maxiama a la que puede ir el sprite
        this.omega  = omega;  // Velocidad angular rad/s
        this.angle  = angle;  // Angulo actual (rad)
        this.xRotCenter = xRotCenter; // Centro de rotacion del sprite X (movimiento circular)
        this.yRotCenter = yRotCenter; // Centro de rotacion del sprite Y (movimiento circular)
    }
}

class PhysicsParticle extends Physics{

    constructor(vLimit, aLimit = 0, friction = 1){
        super(vLimit);
        this.aLimit     = aLimit;
        this.friction   = friction;
        this.ax         = 0;
        this.ay         = 0;
    }
}

export {
    PhysicsParticle
}