//Clase gestora de los sprites
export default class Sprite {
    id;
    state;
    xPos;
    yPos;
    imageSet;
    frames;
    hud;
    physics;
    hitBox;
    enemy;
    isCollidingWithPlayer;
    isCollidingWithObstacleOnTheTop;
    isCollidingWithObstacleOnTheLeft;
    isCollidingWithObstacleOnTheBottom;
    isCollidingWithObstacleOnTheRight;
    constructor(id, state, xPos, yPos, imageSet, frames, hud, physics, hitBox) {
        this.id = id; // Tipo de sprite
        this.state = state; // Estado de animacion del sprite
        this.xPos = xPos; // Posicion en X en canvas
        this.yPos = yPos; // Posicion en Y en Canvas
        this.imageSet = imageSet; // Datos de las imagenes del sprite
        this.frames = frames; // Datos de los frames de animacion
        this.hud = hud; // Diferenciar en que hud se va a enseñar el sprite
        this.physics = physics; // Datos de las fisicas
        this.hitBox = hitBox; // Datos del hitbox
        this.enemy = false; // Variable que indica si el sprite es enemigo
        this.isCollidingWithPlayer = false; // Variable que indica si ha habido colision con el player
        this.isCollidingWithObstacleOnTheTop = false; // Indicia si ha habido colisión con el player
        this.isCollidingWithObstacleOnTheLeft = false; // hacia la izq
        this.isCollidingWithObstacleOnTheBottom = false; // Hacia abajo
        this.isCollidingWithObstacleOnTheRight = false; // Hacia la derecha
    }
}
