import globals from "./globals.js";

export default function detectCollisions() {

    // array para enemigos
    const enemies = [];

    // array para proyectiles
    const proyectiles = [];

    // calcular colision del player con cada uno de los sprites
    for (let i = 0; i < globals.sprites.length; i++) {
        const sprite = globals.sprites[i];

        if (!sprite.hud && !sprite.lucretiaProyectile) {
            detectCollisionBetweenPlayerAndSprite(sprite);
        }
    }
    colisionPlayerProyectileSprite(proyectiles, enemies);
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
    } else {

        isOverlap = true;
    }

    return isOverlap;
}



