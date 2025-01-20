import Sprite from "./Sprite.js";
import ImageSet from "../src/ImageSet.js";
import Frames from "../src/Frames.js";
import Physics from "../src/Physics.js";
import HitBox from "../src/HitBox.js";
import { SpriteID, State } from "../src/constants.js";
import globals from "../src/globals.js";
import { Block2, Obstacles } from "../src/constants.js";

export default class KnightShield extends Sprite {
    directionChangeCounter: number;
    maxTimeToChangeDirection: number;
    isCollidingWithPlayerProyectile: boolean;

    constructor(
        id: number,
        state: number,
        xPos: number,
        yPos: number,
        imageSet: ImageSet,
        frames: Frames,
        hud: boolean,
        physics: Physics,
        hitBox: HitBox,
        maxTimeToChangeDirection: number
    ) {

        //LLamada al constructor de la clase Sprite
        super(id, state, xPos, yPos, imageSet, frames, hud, physics, hitBox);

        this.directionChangeCounter = 0;                             // Contador para cambio de direccion (seconds)
        this.maxTimeToChangeDirection = maxTimeToChangeDirection;      // Máximo tiempo para cambio de dirección (seconds)
        this.isCollidingWithPlayerProyectile = false;                         // Variable que indica si el sprite colisiona con un proyectil del player
        this.enemy = true;                          // Variable para indicar si es un enemigo o no

    }

    public static create(): KnightShield {
        const imageSet = new ImageSet(10, 0, 70, 70, 120, 80, 10, 20);

        const frames = new Frames(9, 3);

        const physics = new Physics(30);

        const maxTimeToChangeDirection = Math.floor(Math.random() * 3) + 1;

        const hitBox = new HitBox(16, 51, 34, 10);

        const canvasWidthWithoutBorders = globals.canvas.width - 2 * 32;         // Resta el doble del ancho del borde
        const xPos = Math.floor(Math.random() * canvasWidthWithoutBorders) + 32; // Suma el ancho de un borde

        const canvasHeightWithoutBorders = globals.canvas.height - 2 * 32;        // Resta el doble del alto del borde
        const yPos = Math.floor(Math.random() * canvasHeightWithoutBorders) + 32; // Suma el alto de un borde

        return new KnightShield(SpriteID.KNIGHT_SHIELD, State.KNIGHT_SHIELD_RIGHT, xPos, yPos, imageSet, frames, false, physics, hitBox, maxTimeToChangeDirection);
    }

    // hacer un update
    // hacer que solo al colisionar con un borde cambie de direccion automaticamente y ya
    // Que pueda defender de vez en cuando añadir un timer y que defienda entre 1 y 10 s con un math random


    //actualizar estado caballero escudo
    public update(lucretiaYPos: number): void {
        const state = this.state;

        // Maquina de estados de caballero
        switch (state) {
            case State.KNIGHT_SHIELD_RIGHT:
                this.physics.vx = this.physics.vLimit;
                break;
            case State.KNIGHT_SHIELD_LEFT:
                this.physics.vx = -this.physics.vLimit;
                break;
            case State.OFF:
                // Estado de muerte
                break;
            default:
                console.error("Error: State invalid");
        }

        // calcular la distancia que se mueve 
        this.xPos += this.physics.vx * globals.deltaTime;
        this.yPos += this.physics.vy * globals.deltaTime;

        // Actualizar la animacion
        this.updateAnimationFrame();

        // Ir a atacar a lucretia
        this.goAttackLucretia(3, lucretiaYPos);

        // cambio de direccion automatica
        this.updateDirectionRandom();

        // calcular colisiones con los bordes de la pantalla
        if (this.isCollidingWithObstacleOnTheRight || this.isCollidingWithObstacleOnTheLeft) {
            this.swapDirection();
        }

        if (this.isCollidingWithPlayerProyectile) {

            this.state = State.OFF;
        }

        // Manage collisions
        this.updateCollisions();
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

    private goAttackLucretia(vy: number, lucretiaYPos: number): void {
        this.yPos < lucretiaYPos ? this.physics.vy = vy : this.physics.vy = -vy;
    }

    private updateDirectionRandom(): void {
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

    private swapDirection(): void {
        this.state = this.state === State.KNIGHT_RIGHT ? State.KNIGHT_LEFT : State.KNIGHT_RIGHT
    }

    private updateCollisions(): void {
        // Detectar colisiones con los bordes del mapa
        this.detetcCollisionBetweenKnigthAndMap();
        // Detect collisions between the knight and the map obstacles
        this.detectCollisionBetweenKnightAndMapObstaclesTree();
    }

    // funcion que detecta colision entre el mapa y los sprites
    private detetcCollisionBetweenKnigthAndMap(): void {
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
            isCollidingOnPos1 = this.isCollidingWithObstacleAt(xPos, yPos, ObstacleId)

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

        } else if (this.physics.vx < 0) {

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

    private isCollidingWithObstacleAt(xPos: number, yPos: number, ObstacleId: number): boolean {
        let isColliding = false;

        const id = this.getMapTileId(xPos, yPos);

        // Calculamos colision con bloque limite del mapa
        id === ObstacleId ? isColliding = true : isColliding;

        return isColliding;
    }

    // Devuelve el Id del tile del mapa para las coordenadas xPos, yPos
    private getMapTileId(xPos: number, yPos: number): number {


        const brickSize = globals.level.imageSet.xGridSize;

        const levelData = globals.level.data;

        const fil = Math.floor(yPos / brickSize);
        const col = Math.floor(xPos / brickSize);

        return levelData[fil][col];
    }

    private detectCollisionBetweenKnightAndMapObstaclesTree(): void {


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
    private isCollidingWithObstacleTreeAt(xPos: number, yPos: number, ObstacleId: number[]): boolean {
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
    private getObstaclesTileId(brickSize: number, levelData: number[][], xPos: number, yPos: number): number {

        const fil = Math.floor(yPos / brickSize);
        const col = Math.floor(xPos / brickSize);

        return levelData[fil][col];
    }
}