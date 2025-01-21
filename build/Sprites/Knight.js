import Sprite from "./Sprite.js";
import ImageSet from "../src/ImageSet.js";
import Frames from "../src/Frames.js";
import Physics from "../src/Physics.js";
import HitBox from "../src/HitBox.js";
import { SpriteID, State } from "../src/constants.js";
import globals from "../src/globals.js";
import { Block2, Obstacles } from "../src/constants.js";
export default class Knight extends Sprite {
    directionChangeCounter;
    maxTimeToChangeDirection;
    isCollidingWithPlayerProyectile;
    constructor(id, state, xPos, yPos, imageSet, frames, hud, physics, hitBox, maxTimeToChangeDirection) {
        //LLamada al constructor de la clase Sprite
        super(id, state, xPos, yPos, imageSet, frames, hud, physics, hitBox);
        this.directionChangeCounter = 0; // Contador para cambio de direccion (seconds)
        this.maxTimeToChangeDirection = maxTimeToChangeDirection; // Máximo tiempo para cambio de dirección (seconds)
        this.isCollidingWithPlayerProyectile = false; // Variable que indica si el this colisiona con un proyectil del player
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
        return new Knight(SpriteID.KNIGHT, State.KNIGHT_RIGHT, xPos, yPos, imageSet, frames, false, physics, hitBox, maxTimeToChangeDirection);
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
        // Colision manager
        this.updateCollisions();
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
    updateCollisions() {
        // Detectar colisiones con los bordes del mapa
        this.detetcCollisionBetweenKnigthAndMap();
        // Detectar colisiones con los arboles del mapa
        this.detectCollisionBetweenKnightAndMapObstaclesTree();
    }
    // funcion que detecta colision entre el mapa y los sprites
    detetcCollisionBetweenKnigthAndMap() {
        // Reset collision state
        this.isCollidingWithObstacleOnTheRight = false;
        this.isCollidingWithObstacleOnTheLeft = false;
        // Variables to use
        let xPos;
        let yPos;
        let isCollidingOnPos1;
        let isCollidingOnPos2;
        let isCollidingOnPos3;
        let isColliding;
        let overlap;
        // tamaño bricksize y id bloque
        const brickSize = globals.level.imageSet.xGridSize;
        const ObstacleId = Block2.BLOQUE_4;
        if (this.physics.vx > 0) {
            //Primera colisión en (xPos + xSize -1, yPos)
            xPos = this.xPos + this.hitBox.xOffSet + this.hitBox.xSize - 1;
            yPos = this.yPos + this.hitBox.yOffSet;
            isCollidingOnPos1 = this.isCollidingWithObstacleAt(xPos, yPos, ObstacleId);
            //Segunda colision en (xPos + xSize -1, yPos + brickSize)
            yPos = this.yPos + this.hitBox.yOffSet + brickSize;
            isCollidingOnPos2 = this.isCollidingWithObstacleAt(xPos, yPos, ObstacleId);
            //Ultima collision en (xPos + xSize -1, yPos + xSize -1)
            yPos = this.yPos + this.hitBox.yOffSet + this.hitBox.ySize - 1;
            isCollidingOnPos3 = this.isCollidingWithObstacleAt(xPos, yPos, ObstacleId);
            // Habra colision si toca algunos de los 3 bloques 
            isColliding = isCollidingOnPos1 || isCollidingOnPos2 || isCollidingOnPos3;
            if (isColliding) {
                //Existe colision a la derecha
                this.isCollidingWithObstacleOnTheRight = true;
                //AJUSTE: Calculamos solapamiento (overlap) y lo elimina
                //Movimiento el personaje tantos pixeles como overlap a la izquierda
                overlap = Math.floor(xPos) % brickSize + 1;
                this.xPos -= overlap;
            }
        }
        else if (this.physics.vx < 0) {
            // Primera colisión en (xPos - 1, yPos)
            xPos = this.xPos + this.hitBox.xOffSet - 1;
            yPos = this.yPos + this.hitBox.yOffSet;
            isCollidingOnPos1 = this.isCollidingWithObstacleAt(xPos, yPos, ObstacleId);
            // Segunda colisión en (xPos, yPos + brickSize)
            yPos = this.yPos + this.hitBox.yOffSet + brickSize;
            isCollidingOnPos2 = this.isCollidingWithObstacleAt(xPos, yPos, ObstacleId);
            // Última colisión en (xPos, yPos + xSize - 1)
            yPos = this.yPos + this.hitBox.yOffSet + this.hitBox.ySize - 1;
            isCollidingOnPos3 = this.isCollidingWithObstacleAt(xPos, yPos, ObstacleId);
            // Habrá colisión si toca alguno de los 3 bloques
            isColliding = isCollidingOnPos1 || isCollidingOnPos2 || isCollidingOnPos3;
            if (isColliding) {
                // Existe colisión a la izquierda
                this.isCollidingWithObstacleOnTheLeft = true;
                // AJUSTE: Calculamos solapamiento (overlap) y lo eliminamos
                // Movemos el personaje tantos píxeles como overlap a la derecha
                overlap = Math.floor(xPos) % brickSize;
                this.xPos += brickSize - overlap;
            }
        }
    }
    isCollidingWithObstacleAt(xPos, yPos, ObstacleId) {
        let isColliding = false;
        const id = this.getMapTileId(xPos, yPos);
        // Calculamos colision con bloque limite del mapa
        id === ObstacleId ? isColliding = true : isColliding;
        return isColliding;
    }
    // Devuelve el Id del tile del mapa para las coordenadas xPos, yPos
    getMapTileId(xPos, yPos) {
        const brickSize = globals.level.imageSet.xGridSize;
        const levelData = globals.level.data;
        const fil = Math.floor(yPos / brickSize);
        const col = Math.floor(xPos / brickSize);
        return levelData[fil][col];
    }
    detectCollisionBetweenKnightAndMapObstaclesTree() {
        // Reset collision state
        this.isCollidingWithObstacleOnTheBottom = false;
        this.isCollidingWithObstacleOnTheLeft = false;
        this.isCollidingWithObstacleOnTheRight = false;
        this.isCollidingWithObstacleOnTheTop = false;
        // Variables to use
        let xPos;
        let yPos;
        let isCollidingOnPos1;
        let isCollidingOnPos2;
        let isCollidingOnPos3;
        // Detectar colisiones
        let isColliding;
        let xOverlap;
        const brickSize = globals.obstacles.imageSet.xGridSize;
        const direction = this.state;
        const ObstacleIdRightTop = Obstacles.BLOQUE_3;
        const obstacleId = Obstacles.BLOQUE_2;
        const obstaclesIdMiddleRight = Obstacles.BLOQUE_6;
        const obstaclesIdMiddleLeft = Obstacles.BLOQUE_5;
        const obstaclesBottomRight = Obstacles.BLOQUE_8;
        const obstaclesBottomLeft = Obstacles.BLOQUE_7;
        const obstaclesId = [ObstacleIdRightTop, obstacleId, obstaclesBottomRight, obstaclesBottomLeft, obstaclesIdMiddleLeft, obstaclesIdMiddleRight];
        switch (direction) {
            case State.KNIGHT_LEFT:
            case State.KNIGHT_SHIELD_LEFT:
                // Primera colisión en (xPos - 1, yPos)
                xPos = this.xPos + this.hitBox.xOffSet - 1;
                yPos = this.yPos + this.hitBox.yOffSet;
                isCollidingOnPos1 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId);
                // Segunda colisión en (xPos, yPos + brickSize)
                yPos = this.yPos + this.hitBox.yOffSet + brickSize;
                isCollidingOnPos2 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId);
                // Última colisión en (xPos, yPos + xSize - 1)
                yPos = this.yPos + this.hitBox.yOffSet + this.hitBox.ySize - 1;
                isCollidingOnPos3 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId);
                // Habrá colisión si toca alguno de los 3 bloques
                isColliding = isCollidingOnPos1 || isCollidingOnPos2 || isCollidingOnPos3;
                if (isColliding) {
                    // Existe colisión a la izquierda
                    this.isCollidingWithObstacleOnTheLeft = true;
                    // AJUSTE: Calculamos solapamiento (overlap) y lo eliminamos
                    // Movemos el personaje tantos píxeles como overlap a la derecha
                    xOverlap = Math.floor(xPos) % brickSize;
                    this.xPos += brickSize - xOverlap;
                }
                break;
            case State.KNIGHT_RIGHT:
            case State.KNIGHT_SHIELD_RIGHT:
                //Primera colisión en (xPos + xSize -1, yPos)
                xPos = this.xPos + this.hitBox.xOffSet + this.hitBox.xSize - 1;
                yPos = this.yPos + this.hitBox.yOffSet;
                isCollidingOnPos1 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId);
                //Segunda colision en (xPos + xSize -1, yPos + brickSize)
                yPos = this.yPos + this.hitBox.yOffSet + brickSize;
                isCollidingOnPos2 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId);
                //Ultima collision en (xPos + xSize -1, yPos + xSize -1)
                yPos = this.yPos + this.hitBox.yOffSet + this.hitBox.ySize - 1;
                isCollidingOnPos3 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId);
                // Habra colision si toca algunos de los 3 bloques 
                isColliding = isCollidingOnPos1 || isCollidingOnPos2 || isCollidingOnPos3;
                if (isColliding) {
                    //Existe colision a la derecha
                    this.isCollidingWithObstacleOnTheRight = true;
                    //AJUSTE: Calculamos solapamiento (overlap) y lo elimina
                    //Movimiento el personaje tantos pixeles como overlap a la izquierda
                    xOverlap = Math.floor(xPos) % brickSize + 1;
                    this.xPos -= xOverlap;
                }
                break;
            default:
                break;
        }
    }
    // Funcion que uso para saber si el player esta colisionando con el obstaculo del mapa
    isCollidingWithObstacleTreeAt(xPos, yPos, ObstacleId) {
        let isColliding = false;
        const brickSize = globals.obstacles.imageSet.xGridSize;
        const obstaclesData = globals.obstacles.data;
        const id = this.getObstaclesTileId(brickSize, obstaclesData, xPos, yPos);
        ObstacleId.map((ObstacleId) => {
            if (id === ObstacleId) {
                isColliding = true;
            }
        });
        return isColliding;
    }
    // Devuelve el Id del tile del mapa para las coordenadas xPos, yPos
    getObstaclesTileId(brickSize, levelData, xPos, yPos) {
        const fil = Math.floor(yPos / brickSize);
        const col = Math.floor(xPos / brickSize);
        return levelData[fil][col];
    }
}
