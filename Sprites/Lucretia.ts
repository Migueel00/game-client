import Sprite from "./Sprite.js";
import ImageSet from "../src/ImageSet.js";
import Frames from "../src/Frames.js";
import Physics from "../src/Physics.js";
import HitBox from "../src/HitBox.js";
import { SpriteID, State, Block2, Obstacles } from "../src/constants.js";
import globals from "../src/globals.js";
import { initLucretiaProyectile, initLucretiaProyectileDown, initLucretiaProyectileLeft, initLucretiaProyectileUp } from "../src/initialize.js";

export default class Lucretia extends Sprite {
    constructor(
        id: number,
        state: number,
        xPos: number,
        yPos: number,
        imageSet: ImageSet,
        frames: Frames,
        hud: boolean,
        physics: Physics,
        hitBox: HitBox
    ){
        super(id, state, xPos, yPos, imageSet, frames, hud, physics, hitBox);
    }

    public static create() : Lucretia{
        const imageSet = new ImageSet(22, 0, 90, 80, 120, 80, 30, 0);

        const frames = new Frames(6, 2);

        const physics = new Physics(80);

        const hitBox = new HitBox(16, 41, 30, 28);

        return new Lucretia(SpriteID.LUCRETIA, State.LUCRETIA_IDLE_LEFT, globals.canvas.width / 2, globals.canvas.height / 2, imageSet, frames, false, physics, hitBox);
    }

    //actualizar estado lucretia
    public update() {

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

        // Actualizar las colisiones 
        this.updateCollisions();

    }

    private assignVelocityBasedOnState() : void {
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

    private handleVerticalMovement(): void{

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

    private handleIdleAttackVertical(): void{
        this.state = this.state === State.LUCRETIA_ATTACK_LEFT ? 
        State.LUCRETIA_IDLE_LEFT : this.state === State.LUCRETIA_ATTACK_RIGHT ? 
        State.LUCRETIA_IDLE_RIGHT : this.state;
    }

    private lucretiaAttackDirection() : number{
        let directionProyectile = 1;
        if (this.state === State.LUCRETIA_RIGHT || this.state === State.LUCRETIA_IDLE_RIGHT) {

            this.state = State.LUCRETIA_ATTACK_RIGHT;
            directionProyectile = 1;
        } else if (this.state === State.LUCRETIA_LEFT || this.state === State.LUCRETIA_IDLE_LEFT) {

            this.state = State.LUCRETIA_ATTACK_LEFT;

            directionProyectile = 2;
        }

        return directionProyectile;
    }

    private updateAnimationFrame() : void{
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

    private readKeyboardAndAssignState() : void{
        this.state = globals.action.moveLeft ? State.LUCRETIA_LEFT :   // Left key
            globals.action.moveRight ? State.LUCRETIA_RIGHT :  // Right Key
            this.state === State.LUCRETIA_LEFT ? State.LUCRETIA_IDLE_LEFT : // No key pressed and previous state LEFT
            this.state === State.LUCRETIA_RIGHT ? State.LUCRETIA_IDLE_RIGHT : // No key pressed and previous state RIGHT
            this.state;
    }

    private updateCollisions() : void{
        this.detectCollisionBetweenPlayerAndMap();
        this.detectCollisionBetweenPlayerAndMapObstaclesAbove();
        this.detectCollisionBetweenPlayerAndMapObstaclesTree();
    }

    // funcion que detecta si hay colision entre el player y el mapa
    private detectCollisionBetweenPlayerAndMap(): void{

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
    private isCollidingWithObstacleAt(xPos : number, yPos: number, ObstacleId: number) : boolean {
        let isColliding = false;

        const id = this.getMapTileId(xPos, yPos);

        // Calculamos colision con bloque limite del mapa
        id === ObstacleId ? isColliding = true : isColliding;

        return isColliding;
    }

    // Devuelve el Id del tile del mapa para las coordenadas xPos, yPos
    private getMapTileId(xPos : number, yPos : number) : number {


        const brickSize = globals.level.imageSet.xGridSize;

        const levelData = globals.level.data;

        const fil = Math.floor(yPos / brickSize);
        const col = Math.floor(xPos / brickSize);

        return levelData[fil][col];
    }

    // funcion que detecta si hay colision entre el player y la parte de arriba del mapa
    private detectCollisionBetweenPlayerAndMapObstaclesAbove() : void{
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
    private detectCollisionBetweenPlayerAndMapObstaclesTree() :void{

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
                isCollidingOnPos1 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId);


                // Segunda colisión en (xPos, yPos + brickSize)
                yPos = this.yPos + this.hitBox.yOffSet + brickSize;
                isCollidingOnPos2 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId);


                // Última colisión en (xPos, yPos + xSize - 1)
                yPos = this.yPos + this.hitBox.yOffSet + this.hitBox.ySize - 1;
                isCollidingOnPos3 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId);

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

        if (globals.action.moveDown) {

            //Primera colision 
            xPos = this.xPos + this.hitBox.xOffSet;
            yPos = this.yPos + this.hitBox.yOffSet + this.hitBox.ySize - 1;
            isCollidingOnPos1 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId);


            // Segunda Colision
            xPos = this.xPos + this.hitBox.xOffSet + this.hitBox.xSize - 1;
            isCollidingOnPos2 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId);

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
            isCollidingOnPos1 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId);


            //Segunda posicion en X
            xPos = this.xPos + this.hitBox.xOffSet + this.hitBox.xSize - 1;
            isCollidingOnPos2 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId);


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
    private isCollidingWithObstacleTreeAt(xPos : number, yPos: number, ObstacleId: number[]) : boolean {
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
    private getObstaclesTileId(brickSize : number, levelData : number[][], xPos: number, yPos: number) : number {

        const fil = Math.floor(yPos / brickSize);
        const col = Math.floor(xPos / brickSize);

        return levelData[fil][col];
    }

}