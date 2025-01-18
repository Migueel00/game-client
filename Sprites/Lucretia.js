import Sprite from "./Sprite.js";
import ImageSet from "../src/ImageSet.js";
import Frames from "../src/Frames.js";
import Physics from "../src/Physics.js";
import HitBox from "../src/HitBox.js";
import { SpriteID, State, Block2, Obstacles } from "../src/constants.js";
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
    update() {

        // Lectura de teclado. Asignamos direccion a tecla
        this.readKeyboardAndAssignState();

        // Maquina de estados lucretia
        this.assignVelocityBasedOnState();
        this.handleVerticalMovement();

    
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

    assignVelocityBasedOnState() {
        const stateVelocites = {
            [State.LUCRETIA_RIGHT]: {vx: this.physics.vLimit, vy: 0},
            [State.LUCRETIA_LEFT]: {vx: -this.physics.vLimit, vy: 0},
            [State.LUCRETIA_IDLE_RIGHT]: {vx: 0, vy: 0},
            [State.LUCRETIA_IDLE_LEFT]: {vx: 0, vy: 0},
            [State.LUCRETIA_ATTACK_RIGHT]: {vx: 0, vy: 0},
            [State.LUCRETIA_ATTACK_LEFT]: {vx: 0, vy: 0}
        }

        const velocity = stateVelocites[this.state] ||  {vx: 0, vy: 0};
        this.physics.vy =  velocity.vy;
        this.physics.vx = velocity.vx;
    }

    handleVerticalMovement(){

        if (globals.action.moveUp) {
            this.handleIdleAttackVertical();
            this.physics.vy = -this.physics.vLimit;
            this.physics.vx = 0;
        } else if (globals.action.moveDown) {
            this.handleIdleAttackVertical();
            this.physics.vy = this.physics.vLimit;
            this.physics.vx = 0;
        }
    }

    handleIdleAttackVertical(){
        this.state = this.state === State.LUCRETIA_ATTACK_LEFT ? 
        State.LUCRETIA_IDLE_LEFT : this.state === State.LUCRETIA_ATTACK_RIGHT ? 
        State.LUCRETIA_IDLE_RIGHT : this.state;
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

    readKeyboardAndAssignState() {
        this.state = globals.action.moveLeft ? State.LUCRETIA_LEFT :   // Left key
            globals.action.moveRight ? State.LUCRETIA_RIGHT :  // Right Key
            this.state === State.LUCRETIA_LEFT ? State.LUCRETIA_IDLE_LEFT : // No key pressed and previous state LEFT
            this.state === State.LUCRETIA_RIGHT ? State.LUCRETIA_IDLE_RIGHT : // No key pressed and previous state RIGHT
            this.state;
    }

    updateCollisions(){
        this.detectCollisionBetweenPlayerAndMap();
        this.detectCollisionBetweenPlayerAndMapObstaclesAbove();
        this.detectCollisionBetweenPlayerAndMapObstaclesTree();
    }

    // funcion que detecta si hay colision entre el player y el mapa
    detectCollisionBetweenPlayerAndMap() {

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

        const brickSize = globals.level.imageSet.xGridSize;
        const direction = this.state;

        const ObstacleId = Block2.BLOQUE_4;

        switch (direction) {
            case State.LUCRETIA_RIGHT:

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
                break;
            case State.LUCRETIA_LEFT:
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
                break;
            default:
                break;


        }
    }

    // funcion que dice si hay colision dependiendo de xPos, yPos, y el tile id
    isCollidingWithObstacleAt(xPos, yPos, ObstacleId) {
        let isColliding;

        const id = this.getMapTileId(xPos, yPos);

        // Calculamos colision con bloque limite del mapa
        if (id === ObstacleId) {

            isColliding = true;
        } else {

            isColliding = false;
        }

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

    // funcion que detecta si hay colision entre el player y la parte de arriba del mapa
    detectCollisionBetweenPlayerAndMapObstaclesAbove() {
        // Reset collision state
        this.isCollidingWithObstacleOnTheTop = false;

        // Variables to use
        let xPos;
        let yPos;
        let isCollidingOnPos1;
        let isCollidingOnPos2;
        let yOverlap;

        const brickSize = globals.obstacles.imageSet.xGridSize;
        const ObstacleId = Block2.BLOQUE_2;

        if (globals.action.moveUp) {
            // Primera colision en este bloque
            xPos = this.xPos + this.hitBox.xOffSet;
            yPos = this.yPos + this.hitBox.yOffSet;

            isCollidingOnPos1 = this.isCollidingWithObstacleAt(xPos, yPos, ObstacleId);

            //Segunda posicion en X
            xPos = this.xPos + this.hitBox.xOffSet + this.hitBox.xSize;
            isCollidingOnPos2 = this.isCollidingWithObstacleAt(xPos, yPos, ObstacleId);

            if (isCollidingOnPos1 || isCollidingOnPos2) {
                // Existe colision arriba
                this.isCollidingWithObstacleOnTheTop = true;

                // Ajuste: Calculamos el solapamiento en Y lo eliminamos
                yOverlap = Math.floor(yPos) % brickSize;
                this.yPos += brickSize - yOverlap;
            }
        }
    }



    // funcion que detecta colision entre el player y los obstaculos del mapa
    detectCollisionBetweenPlayerAndMapObstaclesTree() {

        // Reset collision state
        this.isCollidingWithObstacleOnTheBottom = false;
        this.isCollidingWithObstacleOnTheLeft = false;
        this.isCollidingWithObstacleOnTheRight = false;
        this.isCollidingWithObstacleOnTheTop = false;

        // Variables to use
        let xPos;
        let yPos;

        // bloque arribas
        let isCollidingOnPos1;
        let isCollidingOnPos2;
        let isCollidingOnPos3;


        // Detectar colisiones
        let isColliding;

        let yOverlap;
        let xOverlap;

        const brickSize = globals.obstacles.imageSet.xGridSize;
        const direction = this.state;

        const obstacleId = Obstacles.BLOQUE_3;
        const obstacleId2 = Obstacles.BLOQUE_2;
        const obstacleId3 = Obstacles.BLOQUE_6;
        const obstacleId4 = Obstacles.BLOQUE_5;
        const obstacleId5 = Obstacles.BLOQUE_8;
        const obstacleId6 = Obstacles.BLOQUE_7;

        const obstaclesId = [obstacleId, obstacleId2, obstacleId3, obstacleId4, obstacleId5, obstacleId6];


        switch (direction) {
            case State.LUCRETIA_LEFT:
                // Primera colisión en (xPos - 1, yPos)
                xPos = this.xPos + this.hitBox.xOffSet;
                yPos = this.yPos + this.hitBox.yOffSet;
                isCollidingOnPos1 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, 0);


                // Segunda colisión en (xPos, yPos + brickSize)
                yPos = this.yPos + this.hitBox.yOffSet + brickSize;
                isCollidingOnPos2 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, 0);


                // Última colisión en (xPos, yPos + xSize - 1)
                yPos = this.yPos + this.hitBox.yOffSet + this.hitBox.ySize - 1;
                isCollidingOnPos3 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, 0);

                // Habrá colisión si toca algun bloque en cualquiera de las 3 posiciones
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
            case State.LUCRETIA_RIGHT:

                //Primera colisión en (xPos + xSize -1, yPos)
                xPos = this.xPos + this.hitBox.xOffSet + this.hitBox.xSize - 1;
                yPos = this.yPos + this.hitBox.yOffSet;
                isCollidingOnPos1 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, 0);

                //Segunda colision en (xPos + xSize -1, yPos + brickSize)
                yPos = this.yPos + this.hitBox.yOffSet + brickSize;
                isCollidingOnPos2 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, 0);


                //Ultima collision en (xPos + xSize -1, yPos + xSize -1)
                yPos = this.yPos + this.hitBox.yOffSet + this.hitBox.ySize - 1;
                isCollidingOnPos3 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, 0);


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

        if (globals.action.moveDown) {

            //Primera colision 
            xPos = this.xPos + this.hitBox.xOffSet;
            yPos = this.yPos + this.hitBox.yOffSet + this.hitBox.ySize - 1;
            isCollidingOnPos1 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, 0);


            // Segunda Colision
            xPos = this.xPos + this.hitBox.xOffSet + this.hitBox.xSize - 1;
            isCollidingOnPos2 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, 0);

            //Comprobaciones
            isColliding = isCollidingOnPos1 || isCollidingOnPos2;

            if (isColliding) {

                // Existe colision hacia abajo
                this.isCollidingWithObstacleOnTheBottom = true;
                // Ajuste: Calculamos el solapamiento en Y 

                yOverlap = Math.floor(yPos) % brickSize;
                this.yPos -= yOverlap + 1;

            }
        } else if (globals.action.moveUp) {

            // Primera colision en este bloque
            xPos = this.xPos + this.hitBox.xOffSet;
            yPos = this.yPos + this.hitBox.xOffSet - 1;
            isCollidingOnPos1 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, 0);


            //Segunda posicion en X
            xPos = this.xPos + this.hitBox.xOffSet + this.hitBox.xSize - 1;
            isCollidingOnPos2 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, 0);


            //Comprobaciones 
            isColliding = isCollidingOnPos1 || isCollidingOnPos2;

            if (isColliding) {

                // Existe colision hacia arriba
                this.isCollidingWithObstacleOnTheTop = true;

                // Ajuste: Calculamos el solapamiento en Y
                yOverlap = Math.floor(yPos) % brickSize;
                this.yPos += brickSize - yOverlap + 1;
            }
        }

    }


    // Funcion que uso para saber si el player esta colisionando con el obstaculo del mapa
    isCollidingWithObstacleTreeAt(xPos, yPos, ObstacleId, mapObstaclesId) {
        let isColliding;

        const brickSize = globals.obstacles.imageSet.xGridSize;
        const obstaclesData = globals.obstacles.data;
        const levelData = globals.level.data;

        const idLevel = this.getObstaclesTileId(brickSize, levelData, xPos, yPos);
        const id = this.getObstaclesTileId(brickSize, obstaclesData, xPos, yPos);

        if (mapObstaclesId.length > 0 && ObstacleId.length > 0) {

            if (id === ObstacleId[0] || id === ObstacleId[1] || id === ObstacleId[2] || id === ObstacleId[3] || id === ObstacleId[4] || id === ObstacleId[5] ||
                idLevel === mapObstaclesId[0] || idLevel === mapObstaclesId[1]) {

                isColliding = true;
            } else {

                isColliding = false;
            }

        } else if (mapObstaclesId.length > 0) {
            if (idLevel === mapObstaclesId[0] || idLevel === mapObstaclesId[1]) {

                isColliding = true;
            } else {

                isColliding = false;
            }

        } else if (ObstacleId.length > 0) {

            // Calculamos colisión con el arbol
            if (id === ObstacleId[0] || id === ObstacleId[1] || id === ObstacleId[2] || id === ObstacleId[3] || id === ObstacleId[4] || id === ObstacleId[5]) {

                isColliding = true;
            } else {

                isColliding = false;
            }
        }

        return isColliding;
    }

    // Devuelve el Id del tile del mapa para las coordenadas xPos, yPos
    getObstaclesTileId(brickSize, levelData, xPos, yPos) {

        const fil = Math.floor(yPos / brickSize);
        const col = Math.floor(xPos / brickSize);

        return levelData[fil][col];
    }

}