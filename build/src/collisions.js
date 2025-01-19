import globals from "./globals.js";
import { Block2, Obstacles, SpriteID, State } from "./constants.js";
export default function detectCollisions() {
    // array para enemigos
    const enemies = [];
    // array para proyectiles
    const proyectiles = [];
    // calcular colision del player con cada uno de los sprites
    for (let i = 0; i < globals.sprites.length; i++) {
        const sprite = globals.sprites[i];
        switch (sprite.id) {
            case SpriteID.LUCRETIA:
                sprite.updateCollisions();
                break;
        }
        if (!sprite.hud && !sprite.lucretiaProyectile) {
            detectCollisionBetweenPlayerAndSprite(sprite);
            detetcCollisionBetweenEnemiesAndMap(sprite);
            detectCollisionBetweenSpritesAndMapObstaclesTree(sprite);
        }
        if (sprite.lucretiaProyectile) {
            proyectiles.push(sprite);
        }
        if (sprite.enemy) {
            enemies.push(sprite);
        }
        if (sprite.enemyArcher) {
            collisionBetweenArcherAndTree(sprite);
        }
    }
    colisionPlayerProyectileSprite(proyectiles, enemies);
    if (enemies.length > 0) {
        detectCollisionBetweenSpritesAndMapObstaclesTree(enemies);
        detetcCollisionBetweenEnemiesAndMap(enemies);
        detetcCollisionBetweenEnemiesAndMap(enemies);
    }
}
function colisionPlayerProyectileSprite(projectiles, sprites) {
    for (let i = 0; i < projectiles.length; i++) {
        const playerProjectile = projectiles[i];
        playerProjectile.isCollidingWithSprite = false;
        for (let j = 0; j < sprites.length; j++) {
            const sprite = sprites[j];
            sprite.isCollidingWithPlayerProyectile = false;
            const x1 = playerProjectile.xPos + playerProjectile.hitBox.xOffSet;
            const y1 = playerProjectile.yPos + playerProjectile.hitBox.yOffSet;
            const w1 = playerProjectile.hitBox.xSize;
            const h1 = playerProjectile.hitBox.ySize;
            let x2, y2, w2, h2;
            if (!sprite.hud) {
                x2 = sprite.xPos + sprite.hitBox.xOffSet;
                y2 = sprite.yPos + sprite.hitBox.yOffSet;
                w2 = sprite.hitBox.xSize;
                h2 = sprite.hitBox.ySize;
            }
            const isOverlap = rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2);
            if (isOverlap) {
                sprite.isCollidingWithPlayerProyectile = true;
                playerProjectile.isCollidingWithSprite = true;
                globals.points += 100;
                return;
            }
        }
    }
}
// Funcion que detecta la colision entre el player y un sprite
function detectCollisionBetweenPlayerAndSprite(sprite) {
    // Reset the collision state
    sprite.isCollidingWithPlayer = false;
    // Nuestro player esta en la posicion 0
    const player = globals.sprites[0];
    //Datos del player
    const x1 = player.xPos + player.hitBox.xOffSet;
    const y1 = player.yPos + player.hitBox.yOffSet;
    const w1 = player.hitBox.xSize;
    const h1 = player.hitBox.ySize;
    let x2, y2, w2, h2;
    if (!sprite.hud) {
        x2 = sprite.xPos + sprite.hitBox.xOffSet;
        y2 = sprite.yPos + sprite.hitBox.yOffSet;
        w2 = sprite.hitBox.xSize;
        h2 = sprite.hitBox.ySize;
    }
    const isOverlap = rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2);
    if (isOverlap) {
        //Existe colision
        sprite.isCollidingWithPlayer = true;
    }
}
// Función que calcula si 2 rectángulos interseccionan
function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    let isOverlap;
    // Check x and y for overlap
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
        isOverlap = false;
    }
    else {
        isOverlap = true;
    }
    return isOverlap;
}
// Devuelve el Id del tile del mapa para las coordenadas xPos, yPos
function getMapTileId(xPos, yPos) {
    const brickSize = globals.level.imageSet.xGridSize;
    const levelData = globals.level.data;
    const fil = Math.floor(yPos / brickSize);
    const col = Math.floor(xPos / brickSize);
    return levelData[fil][col];
}
// Devuelve el Id del tile del mapa para las coordenadas xPos, yPos
function getObstaclesTileId(brickSize, levelData, xPos, yPos) {
    const fil = Math.floor(yPos / brickSize);
    const col = Math.floor(xPos / brickSize);
    return levelData[fil][col];
}
// Funcion que uso para saber si el player esta colisionando con el obstaculo del mapa
function isCollidingWithObstacleTreeAt(xPos, yPos, ObstacleId, mapObstaclesId) {
    let isColliding;
    const brickSize = globals.obstacles.imageSet.xGridSize;
    const obstaclesData = globals.obstacles.data;
    const levelData = globals.level.data;
    const idLevel = getObstaclesTileId(brickSize, levelData, xPos, yPos);
    const id = getObstaclesTileId(brickSize, obstaclesData, xPos, yPos);
    if (mapObstaclesId.length > 0 && ObstacleId.length > 0) {
        if (id === ObstacleId[0] || id === ObstacleId[1] || id === ObstacleId[2] || id === ObstacleId[3] || id === ObstacleId[4] || id === ObstacleId[5] ||
            idLevel === mapObstaclesId[0] || idLevel === mapObstaclesId[1]) {
            isColliding = true;
        }
        else {
            isColliding = false;
        }
    }
    else if (mapObstaclesId.length > 0) {
        if (idLevel === mapObstaclesId[0] || idLevel === mapObstaclesId[1]) {
            isColliding = true;
        }
        else {
            isColliding = false;
        }
    }
    else if (ObstacleId.length > 0) {
        // Calculamos colisión con el arbol
        if (id === ObstacleId[0] || id === ObstacleId[1] || id === ObstacleId[2] || id === ObstacleId[3] || id === ObstacleId[4] || id === ObstacleId[5]) {
            isColliding = true;
        }
        else {
            isColliding = false;
        }
    }
    return isColliding;
}
// funcion que dice si hay colision dependiendo de xPos, yPos, y el tile id
function isCollidingWithObstacleAt(xPos, yPos, ObstacleId) {
    let isColliding;
    const id = getMapTileId(xPos, yPos);
    // Calculamos colision con bloque limite del mapa
    if (id === ObstacleId) {
        isColliding = true;
    }
    else {
        isColliding = false;
    }
    return isColliding;
}
// funcion que detecta colision entre el player y los obstaculos del mapa
function detectCollisionBetweenSpritesAndMapObstaclesTree(enemy) {
    // Reset collision state
    enemy.isCollidingWithObstacleOnTheBottom = false;
    enemy.isCollidingWithObstacleOnTheLeft = false;
    enemy.isCollidingWithObstacleOnTheRight = false;
    enemy.isCollidingWithObstacleOnTheTop = false;
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
    const direction = enemy.state;
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
            xPos = enemy.xPos + enemy.hitBox.xOffSet - 1;
            yPos = enemy.yPos + enemy.hitBox.yOffSet;
            isCollidingOnPos1 = isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, 0);
            // Segunda colisión en (xPos, yPos + brickSize)
            yPos = enemy.yPos + enemy.hitBox.yOffSet + brickSize;
            isCollidingOnPos2 = isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, 0);
            // Última colisión en (xPos, yPos + xSize - 1)
            yPos = enemy.yPos + enemy.hitBox.yOffSet + enemy.hitBox.ySize - 1;
            isCollidingOnPos3 = isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, 0);
            // Habrá colisión si toca alguno de los 3 bloques
            isColliding = isCollidingOnPos1 || isCollidingOnPos2 || isCollidingOnPos3;
            if (isColliding) {
                // Existe colisión a la izquierda
                enemy.isCollidingWithObstacleOnTheLeft = true;
                // AJUSTE: Calculamos solapamiento (overlap) y lo eliminamos
                // Movemos el personaje tantos píxeles como overlap a la derecha
                xOverlap = Math.floor(xPos) % brickSize;
                enemy.xPos += brickSize - xOverlap;
            }
            break;
        case State.KNIGHT_RIGHT:
        case State.KNIGHT_SHIELD_RIGHT:
            //Primera colisión en (xPos + xSize -1, yPos)
            xPos = enemy.xPos + enemy.hitBox.xOffSet + enemy.hitBox.xSize - 1;
            yPos = enemy.yPos + enemy.hitBox.yOffSet;
            isCollidingOnPos1 = isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, 0);
            //Segunda colision en (xPos + xSize -1, yPos + brickSize)
            yPos = enemy.yPos + enemy.hitBox.yOffSet + brickSize;
            isCollidingOnPos2 = isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, 0);
            //Ultima collision en (xPos + xSize -1, yPos + xSize -1)
            yPos = enemy.yPos + enemy.hitBox.yOffSet + enemy.hitBox.ySize - 1;
            isCollidingOnPos3 = isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, 0);
            // Habra colision si toca algunos de los 3 bloques 
            isColliding = isCollidingOnPos1 || isCollidingOnPos2 || isCollidingOnPos3;
            if (isColliding) {
                //Existe colision a la derecha
                enemy.isCollidingWithObstacleOnTheRight = true;
                //AJUSTE: Calculamos solapamiento (overlap) y lo elimina
                //Movimiento el personaje tantos pixeles como overlap a la izquierda
                xOverlap = Math.floor(xPos) % brickSize + 1;
                enemy.xPos -= xOverlap;
            }
            break;
        default:
            break;
    }
}
// funcion que detecta colision entre el mapa y los sprites
function detetcCollisionBetweenEnemiesAndMap(enemies) {
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        // Reset collision state
        enemy.isCollidingWithObstacleOnTheRight = false;
        enemy.isCollidingWithObstacleOnTheLeft = false;
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
        if (enemy.physics.vx > 0) {
            //Primera colisión en (xPos + xSize -1, yPos)
            xPos = enemy.xPos + enemy.hitBox.xOffSet + enemy.hitBox.xSize - 1;
            yPos = enemy.yPos + enemy.hitBox.yOffSet;
            isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, ObstacleId, 0);
            //Segunda colision en (xPos + xSize -1, yPos + brickSize)
            yPos = enemy.yPos + enemy.hitBox.yOffSet + brickSize;
            isCollidingOnPos2 = isCollidingWithObstacleAt(xPos, yPos, ObstacleId, 0);
            //Ultima collision en (xPos + xSize -1, yPos + xSize -1)
            yPos = enemy.yPos + enemy.hitBox.yOffSet + enemy.hitBox.ySize - 1;
            isCollidingOnPos3 = isCollidingWithObstacleAt(xPos, yPos, ObstacleId, 0);
            // Habra colision si toca algunos de los 3 bloques 
            isColliding = isCollidingOnPos1 || isCollidingOnPos2 || isCollidingOnPos3;
            if (isColliding) {
                //Existe colision a la derecha
                enemy.isCollidingWithObstacleOnTheRight = true;
                //AJUSTE: Calculamos solapamiento (overlap) y lo elimina
                //Movimiento el personaje tantos pixeles como overlap a la izquierda
                overlap = Math.floor(xPos) % brickSize + 1;
                enemy.xPos -= overlap;
            }
        }
        else if (enemy.physics.vx < 0) {
            // Primera colisión en (xPos - 1, yPos)
            xPos = enemy.xPos + enemy.hitBox.xOffSet - 1;
            yPos = enemy.yPos + enemy.hitBox.yOffSet;
            isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, ObstacleId, 0);
            // Segunda colisión en (xPos, yPos + brickSize)
            yPos = enemy.yPos + enemy.hitBox.yOffSet + brickSize;
            isCollidingOnPos2 = isCollidingWithObstacleAt(xPos, yPos, ObstacleId, 0);
            // Última colisión en (xPos, yPos + xSize - 1)
            yPos = enemy.yPos + enemy.hitBox.yOffSet + enemy.hitBox.ySize - 1;
            isCollidingOnPos3 = isCollidingWithObstacleAt(xPos, yPos, ObstacleId, 0);
            // Habrá colisión si toca alguno de los 3 bloques
            isColliding = isCollidingOnPos1 || isCollidingOnPos2 || isCollidingOnPos3;
            if (isColliding) {
                // Existe colisión a la izquierda
                enemy.isCollidingWithObstacleOnTheLeft = true;
                // AJUSTE: Calculamos solapamiento (overlap) y lo eliminamos
                // Movemos el personaje tantos píxeles como overlap a la derecha
                overlap = Math.floor(xPos) % brickSize;
                enemy.xPos += brickSize - overlap;
            }
        }
    }
}
function collisionBetweenArcherAndTree(archer) {
    //Reset the collision state
    archer.isCollidingWithObstacleOnTheBottom = false;
    archer.isCollidingWithObstacleOnTheLeft = false;
    archer.isCollidingWithObstacleOnTheRight = false;
    archer.isCollidingWithObstacleOnTheTop = false;
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
    if ((archer.physics.omega < 0 && archer.physics.angle > 0 && archer.physics.vx > 0)) {
        //Punto 6
        xPos = archer.xPos + archer.hitBox.xOffSet;
        yPos = archer.yPos + archer.hitBox.yOffSet;
        isCollidingOnPos6 = isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, mapObstaclesId);
        if (isCollidingOnPos6) { // Hay colision en punto 6
            // Se trata de una esquina
            archer.isCollidingWithObstacleOnTheTop = true;
            // calculamos overlap en y
            overlapY = brickSize - Math.floor(yPos) % brickSize;
            // Colision en eje y
            archer.yPos += overlapY;
        }
        //Punto 4
        // Última colision en (xPos, yPos + ySize -1)
        xPos = archer.xPos + archer.hitBox.xOffSet;
        yPos = archer.yPos + archer.hitBox.yOffSet + archer.hitBox.ySize - 1;
        isCollidingOnPos4 = isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, mapObstaclesId);
        if (isCollidingOnPos4) { // Hay colision P4
            archer.isCollidingWithObstacleOnTheBottom = true;
            // Calculamos overlap en Y
            overlapY = Math.floor(yPos) % brickSize + 1;
            archer.yPos -= overlapY;
        }
        //Punto 2
        xPos = archer.xPos + archer.hitBox.xOffSet + archer.hitBox.xSize - 1;
        yPos = archer.yPos + archer.hitBox.yOffSet + brickSize;
        isCollidingOnPos2 = isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, mapObstaclesId);
        if (isCollidingOnPos2) {
            archer.isCollidingWithObstacleOnTheRight = true;
            overlapX = Math.floor(xPos) % brickSize + 1;
            archer.xPos -= overlapX;
        }
        //Punto 1
        xPos = archer.xPos + archer.hitBox.xOffSet + archer.hitBox.xSize - 1;
        yPos = archer.yPos + archer.hitBox.yOffSet;
        isCollidingOnPos1 = isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, mapObstaclesId);
        if (isCollidingOnPos1) { //Hay colision en el P1
            //Calculamos el overlap en X y en Y
            overlapX = Math.floor(xPos) % brickSize + 1;
            overlapY = brickSize - Math.floor(yPos) % brickSize;
            if (overlapX <= overlapY) {
                //Colision en eje X
                archer.xPos -= overlapX;
                archer.isCollidingWithObstacleOnTheRight = true;
            }
            else {
                archer.isCollidingWithObstacleOnTheTop = true;
                //Colision en eje x
                archer.yPos += overlapY;
            }
        }
        //Punto 3
        xPos = archer.xPos + archer.hitBox.xOffSet + archer.hitBox.xSize - 1;
        yPos = archer.yPos + archer.hitBox.xOffSet + archer.hitBox.xSize - 1;
        isCollidingOnPos3 = isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, mapObstaclesId);
        if (isCollidingOnPos3) { //Hay colision en P3
            //Calculamos el overlap en X y en Y
            overlapX = Math.floor(xPos) % brickSize + 1;
            overlapY = Math.floor(yPos) % brickSize + 1;
            if (overlapX <= overlapY) {
                archer.isCollidingWithObstacleOnTheRight = true;
                //Colision en eje X
                archer.xPos -= overlapX;
            }
            else {
                archer.isCollidingWithObstacleOnTheBottom = true;
                //colision en eje y
                archer.yPos -= overlapY;
            }
        }
    }
    else if ((archer.physics.omega > 0 && archer.physics.angle > 1)) {
        //Punto 1
        xPos = archer.xPos + archer.hitBox.xOffSet + archer.hitBox.xSize - 1;
        yPos = archer.yPos + archer.hitBox.yOffSet;
        isCollidingOnPos1 = isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, mapObstaclesId);
        if (isCollidingOnPos1) { //Hay colision en P1
            //Calculamos el overlap en Y
            archer.isCollidingWithObstacleOnTheTop = true;
            overlapY = brickSize - Math.floor(yPos) % brickSize;
            archer.yPos += overlapY;
        }
        //Punto 3
        xPos = archer.xPos + archer.hitBox.xOffSet + archer.hitBox.xSize - 1;
        yPos = archer.yPos + archer.hitBox.yOffSet + archer.hitBox.ySize - 1;
        isCollidingOnPos3 = isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, mapObstaclesId);
        if (isCollidingOnPos3) { //Hay colision en P3
            //calculamos overlap en Y
            archer.isCollidingWithObstacleOnTheRight = true;
            overlapY = Math.floor(yPos) % brickSize + 1;
            archer.yPos -= overlapY;
        }
        //Punto 5
        xPos = archer.xPos + archer.hitBox.xOffSet;
        yPos = archer.yPos + archer.hitBox.yOffSet + brickSize;
        isCollidingOnPos5 = isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, mapObstaclesId);
        if (isCollidingOnPos5) { //Hay colision en P5
            //Calculamos overlapX
            archer.isCollidingWithObstacleOnTheLeft = true;
            overlapX = brickSize - Math.floor(xPos) % brickSize;
            archer.xPos += overlapX;
            return;
        }
        //Punto 6
        xPos = archer.xPos + archer.hitBox.xOffSet;
        yPos = archer.yPos + archer.hitBox.yOffSet;
        isCollidingOnPos6 = isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, mapObstaclesId);
        if (isCollidingOnPos6) { //Hay colision en P6
            //calculamos overlap X e Y
            overlapX = brickSize - Math.floor(xPos) % brickSize;
            overlapY = brickSize - Math.floor(yPos) % brickSize;
            if (overlapX <= overlapY) {
                //Colision en eje X
                archer.xPos += overlapX;
                archer.isCollidingWithObstacleOnTheLeft = true;
            }
            else {
                archer.isCollidingWithObstacleOnTheTop = true;
                archer.yPos += overlapY;
            }
        }
        //Punto 4
        xPos = archer.xPos + archer.hitBox.xOffSet;
        yPos = archer.yPos + archer.hitBox.yOffSet + archer.hitBox.ySize - 1;
        isCollidingOnPos4 = isCollidingWithObstacleTreeAt(xPos, yPos, obstaclesId, mapObstaclesId);
        if (isCollidingOnPos4) { //Hay colision en P4 
            //Calculamos overlap X e Y
            overlapX = brickSize - Math.floor(xPos) % brickSize;
            overlapY = Math.floor(yPos) % brickSize + 1;
            if (overlapX <= overlapY) {
                archer.isCollidingWithObstacleOnTheLeft = true;
                //Colision en eje X
                archer.xPos += overlapX;
            }
            else {
                archer.isCollidingWithObstacleOnTheBottom = true;
                //Colision en eje Y
                archer.yPos -= overlapY;
            }
        }
    }
}
