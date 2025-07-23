import Frames from "../Frames.js";
import HitBox from "../HitBox.js";
import ImageSet from "../ImageSet.js";
import Physics from "../Physics.js";
import { Block2, Obstacles, SpriteID, State } from "../constants.js";
import { positionLucretia } from "../gameLogic.js";
import globals from "../globals.js";
import { initArcherProyectile, initArcherProyectileLeft } from "../initialize.js";
import Sprite from "./Sprite.js";
export default class EnemyArcher extends Sprite {
    isCollidingWithPlayerProyectile;
    constructor(id, state, xPos, yPos, imageSet, frames, physics, hitBox) {
        super(id, state, xPos, yPos, imageSet, frames, physics, hitBox);
        this.isCollidingWithPlayerProyectile = false;
    }
    static create() {
        const imageSet = new ImageSet(16, 0, 80, 80, 120, 80, 0, 0);
        const frames = new Frames(6, 10);
        // valores iniciales para Physics 
        const initAngle = 90 * Math.PI / 180;
        const omega = 0.10;
        const xRotCenter = globals.canvas.width / 2;
        const yRotCenter = globals.canvas.height / 2;
        // Objeto physics 
        const physics = new Physics(0, omega, initAngle, xRotCenter, yRotCenter);
        const hitBox = new HitBox(16, 40, 37, 22);
        return new EnemyArcher(SpriteID.KNIGHT_ARCHER, State.KNIGHT_ARCHER_RIGHT, 0, 0, imageSet, frames, physics, hitBox);
    }
    update() {
        this.updateKnightArcher();
        // updateCollisions
        this.collisionBetweenArcherAndTree();
    }
    //actualizar estado de caballero arquero
    updateKnightArcher() {
        // Actualizar el angulo de giro
        this.physics.angle += this.physics.omega * globals.deltaTime;
        // calcular nueva posicion
        this.setKnightArcherPosition();
        this.updateAnimationFrame();
        const time = globals.shootTimer.value;
        let xPosLucretia = positionLucretia().xPos;
        if (xPosLucretia > this.xPos) {
            this.state = State.KNIGHT_ARCHER_ATTACK_RIGHT;
            if (time % 56 === 0) {
                initArcherProyectile(this.xPos, this.yPos + this.hitBox.ySize - 20);
            }
        }
        else {
            if (time % 56 === 0) {
                initArcherProyectileLeft(this.xPos, this.yPos + this.hitBox.ySize - 20);
            }
            this.state = State.KNIGHT_ARCHER_ATTACK_LEFT;
        }
        if (this.isCollidingWithObstacleOnTheLeft || this.isCollidingWithObstacleOnTheRight || this.isCollidingWithObstacleOnTheTop || this.isCollidingWithObstacleOnTheBottom) {
            this.physics.omega = -this.physics.omega;
        }
        if (this.isCollidingWithPlayerProyectile) {
            this.state = State.OFF;
        }
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
    setKnightArcherPosition() {
        // Movimiento circular
        // x = xCenter + Acos(angle)
        // y = yCenter + Asin(angle)
        const radius = 110;
        let xPos = 40;
        let yPos = 40;
        this.xPos = xPos + radius * Math.cos(this.physics.angle);
        this.yPos = yPos + radius * Math.sin(this.physics.angle);
        // Centramos el giro respecto del centro del sprite (Lucretia)
        this.xPos -= this.imageSet.xSize / 2;
        this.yPos -= this.imageSet.ySize / 2;
    }
    collisionBetweenArcherAndTree() {
        //Reset the collision state
        this.isCollidingWithObstacleOnTheBottom = false;
        this.isCollidingWithObstacleOnTheLeft = false;
        this.isCollidingWithObstacleOnTheRight = false;
        this.isCollidingWithObstacleOnTheTop = false;
        //variables a usar
        let xPos;
        let yPos;
        let isCollidingOnPos1;
        let isCollidingOnPos2;
        let isCollidingOnPos3;
        let isCollidingOnPos4;
        let isCollidingOnPos5;
        let isCollidingOnPos6;
        const brickSize = globals.obstacles.imageSet.xGridSize;
        // ID de los obstaculos
        const ObstacleIdRightTop = Obstacles.BLOQUE_3;
        const obstacleId = Obstacles.BLOQUE_2;
        const obstaclesIdMiddleRight = Obstacles.BLOQUE_6;
        const obstaclesIdMiddleLeft = Obstacles.BLOQUE_5;
        const obstaclesBottomRight = Obstacles.BLOQUE_8;
        const obstaclesBottomLeft = Obstacles.BLOQUE_7;
        const obstaclesId = [ObstacleIdRightTop, obstacleId, obstaclesIdMiddleLeft, obstaclesIdMiddleRight, obstaclesBottomRight, obstaclesBottomLeft];
        const mapObstacleId = Block2.BLOQUE_4;
        const mapObstacleId2 = Block2.BLOQUE_2;
        const mapObstaclesId = [mapObstacleId, mapObstacleId2];
        let overlapX;
        let overlapY;
        // tema condiciones acabar
        // Calculamos colisiones en los 6 puntos
        if ((this.physics.omega < 0 && this.physics.angle > 0 && this.physics.vx > 0)) {
            //Punto 6
            xPos = this.xPos + this.hitBox.xOffSet;
            yPos = this.yPos + this.hitBox.yOffSet;
            isCollidingOnPos6 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, mapObstaclesId);
            if (isCollidingOnPos6) { // Hay colision en punto 6
                // Se trata de una esquina
                this.isCollidingWithObstacleOnTheTop = true;
                // calculamos overlap en y
                overlapY = brickSize - Math.floor(yPos) % brickSize;
                // Colision en eje y
                this.yPos += overlapY;
            }
            //Punto 4
            // Última colision en (xPos, yPos + ySize -1)
            xPos = this.xPos + this.hitBox.xOffSet;
            yPos = this.yPos + this.hitBox.yOffSet + this.hitBox.ySize - 1;
            isCollidingOnPos4 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, mapObstaclesId);
            if (isCollidingOnPos4) { // Hay colision P4
                this.isCollidingWithObstacleOnTheBottom = true;
                // Calculamos overlap en Y
                overlapY = Math.floor(yPos) % brickSize + 1;
                this.yPos -= overlapY;
            }
            //Punto 2
            xPos = this.xPos + this.hitBox.xOffSet + this.hitBox.xSize - 1;
            yPos = this.yPos + this.hitBox.yOffSet + brickSize;
            isCollidingOnPos2 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, mapObstaclesId);
            if (isCollidingOnPos2) {
                this.isCollidingWithObstacleOnTheRight = true;
                overlapX = Math.floor(xPos) % brickSize + 1;
                this.xPos -= overlapX;
            }
            //Punto 1
            xPos = this.xPos + this.hitBox.xOffSet + this.hitBox.xSize - 1;
            yPos = this.yPos + this.hitBox.yOffSet;
            isCollidingOnPos1 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, mapObstaclesId);
            if (isCollidingOnPos1) { //Hay colision en el P1
                //Calculamos el overlap en X y en Y
                overlapX = Math.floor(xPos) % brickSize + 1;
                overlapY = brickSize - Math.floor(yPos) % brickSize;
                if (overlapX <= overlapY) {
                    //Colision en eje X
                    this.xPos -= overlapX;
                    this.isCollidingWithObstacleOnTheRight = true;
                }
                else {
                    this.isCollidingWithObstacleOnTheTop = true;
                    //Colision en eje x
                    this.yPos += overlapY;
                }
            }
            //Punto 3
            xPos = this.xPos + this.hitBox.xOffSet + this.hitBox.xSize - 1;
            yPos = this.yPos + this.hitBox.xOffSet + this.hitBox.xSize - 1;
            isCollidingOnPos3 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, mapObstaclesId);
            if (isCollidingOnPos3) { //Hay colision en P3
                //Calculamos el overlap en X y en Y
                overlapX = Math.floor(xPos) % brickSize + 1;
                overlapY = Math.floor(yPos) % brickSize + 1;
                if (overlapX <= overlapY) {
                    this.isCollidingWithObstacleOnTheRight = true;
                    //Colision en eje X
                    this.xPos -= overlapX;
                }
                else {
                    this.isCollidingWithObstacleOnTheBottom = true;
                    //colision en eje y
                    this.yPos -= overlapY;
                }
            }
        }
        else if ((this.physics.omega > 0 && this.physics.angle > 1)) {
            //Punto 1
            xPos = this.xPos + this.hitBox.xOffSet + this.hitBox.xSize - 1;
            yPos = this.yPos + this.hitBox.yOffSet;
            isCollidingOnPos1 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, mapObstaclesId);
            if (isCollidingOnPos1) { //Hay colision en P1
                //Calculamos el overlap en Y
                this.isCollidingWithObstacleOnTheTop = true;
                overlapY = brickSize - Math.floor(yPos) % brickSize;
                this.yPos += overlapY;
            }
            //Punto 3
            xPos = this.xPos + this.hitBox.xOffSet + this.hitBox.xSize - 1;
            yPos = this.yPos + this.hitBox.yOffSet + this.hitBox.ySize - 1;
            isCollidingOnPos3 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, mapObstaclesId);
            if (isCollidingOnPos3) { //Hay colision en P3
                //calculamos overlap en Y
                this.isCollidingWithObstacleOnTheRight = true;
                overlapY = Math.floor(yPos) % brickSize + 1;
                this.yPos -= overlapY;
            }
            //Punto 5
            xPos = this.xPos + this.hitBox.xOffSet;
            yPos = this.yPos + this.hitBox.yOffSet + brickSize;
            isCollidingOnPos5 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, mapObstaclesId);
            if (isCollidingOnPos5) { //Hay colision en P5
                //Calculamos overlapX
                this.isCollidingWithObstacleOnTheLeft = true;
                overlapX = brickSize - Math.floor(xPos) % brickSize;
                this.xPos += overlapX;
                return;
            }
            //Punto 6
            xPos = this.xPos + this.hitBox.xOffSet;
            yPos = this.yPos + this.hitBox.yOffSet;
            isCollidingOnPos6 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, mapObstaclesId);
            if (isCollidingOnPos6) { //Hay colision en P6
                //calculamos overlap X e Y
                overlapX = brickSize - Math.floor(xPos) % brickSize;
                overlapY = brickSize - Math.floor(yPos) % brickSize;
                if (overlapX <= overlapY) {
                    //Colision en eje X
                    this.xPos += overlapX;
                    this.isCollidingWithObstacleOnTheLeft = true;
                }
                else {
                    this.isCollidingWithObstacleOnTheTop = true;
                    this.yPos += overlapY;
                }
            }
            //Punto 4
            xPos = this.xPos + this.hitBox.xOffSet;
            yPos = this.yPos + this.hitBox.yOffSet + this.hitBox.ySize - 1;
            isCollidingOnPos4 = this.isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, mapObstaclesId);
            if (isCollidingOnPos4) { //Hay colision en P4 
                //Calculamos overlap X e Y
                overlapX = brickSize - Math.floor(xPos) % brickSize;
                overlapY = Math.floor(yPos) % brickSize + 1;
                if (overlapX <= overlapY) {
                    this.isCollidingWithObstacleOnTheLeft = true;
                    //Colision en eje X
                    this.xPos += overlapX;
                }
                else {
                    this.isCollidingWithObstacleOnTheBottom = true;
                    //Colision en eje Y
                    this.yPos -= overlapY;
                }
            }
        }
    }
    // Funcion que uso para saber si el player esta colisionando con el obstaculo del mapa
    isCollidingWithObstacleTreeAt(xPos, yPos, ObstacleId, mapObstaclesId) {
        const brickSize = globals.obstacles.imageSet.xGridSize;
        const obstaclesData = globals.obstacles.data;
        const levelData = globals.level.data;
        const idLevel = this.getObstaclesTileId(brickSize, levelData, xPos, yPos);
        const id = this.getObstaclesTileId(brickSize, obstaclesData, xPos, yPos);
        const isCollidingWithObstacle = ObstacleId.includes(id);
        const isColidingWithMapObstacle = mapObstaclesId.includes(idLevel);
        return isColidingWithMapObstacle || isCollidingWithObstacle;
    }
    // Devuelve el Id del tile del mapa para las coordenadas xPos, yPos
    getObstaclesTileId(brickSize, levelData, xPos, yPos) {
        const fil = Math.floor(yPos / brickSize);
        const col = Math.floor(xPos / brickSize);
        return levelData[fil][col];
    }
}
