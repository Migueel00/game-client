import globals from "./globals.js";
import { SpriteID, State } from "./constants.js";
export default class CollisionManager {
    sprites;
    constructor(sprites) {
        this.sprites = sprites;
    }
    detectAllCollisions() {
        const player = this.getPlayer();
        const collidables = this.getCollidables();
        const proyectiles = this.getProyectiles(); // Lucretia Proyectiles
        if (player) {
            collidables.forEach(sprite => {
                this.detectEntityCollision(player, sprite);
            });
            // detect collisions proyectiles
            proyectiles.forEach(proyectile => {
                collidables.forEach(sprite => {
                    if (this.detectProjectileCollision(proyectile, sprite)) {
                        this.handleProjectileHit(proyectile, sprite);
                    }
                });
            });
        }
    }
    getPlayer() {
        return this.sprites.find(sprite => sprite.id === SpriteID.LUCRETIA);
    }
    getCollidables() {
        return this.sprites.filter(sprite => !sprite.hitBox.isTrigger && // ignore triggers
            sprite !== this.getPlayer() &&
            !this.isProyectile(sprite));
    }
    getProyectiles() {
        return this.sprites.filter(sprite => this.isProyectile(sprite));
    }
    isProyectile(sprite) {
        return sprite.id === SpriteID.LUCRETIA_PROYECTILE;
    }
    detectEntityCollision(entity, target) {
        const entityBox = this.getBoundingBox(entity);
        const targetBox = this.getBoundingBox(target);
        if (this.rectIntersect(entityBox, targetBox)) {
            this.updateCollisionFlags(entity, target);
        }
    }
    getBoundingBox(sprite) {
        return {
            left: sprite.xPos + sprite.hitBox.xOffSet,
            right: sprite.xPos + sprite.hitBox.xOffSet + sprite.hitBox.xSize,
            top: sprite.yPos + sprite.hitBox.yOffSet,
            bottom: sprite.yPos + sprite.hitBox.yOffSet + sprite.hitBox.ySize
        };
    }
    rectIntersect(a, b) {
        return !(a.right < b.left ||
            a.left > b.right ||
            a.bottom < b.top ||
            a.top > b.bottom);
    }
    updateCollisionFlags(entity, target) {
        // Colissions player
        if (entity === this.getPlayer()) {
            target.isCollidingWithPlayer = true;
            this.determineCollisionSide(entity, target);
        }
    }
    determineCollisionSide(entity, target) {
        const entityBox = this.getBoundingBox(entity);
        const targetBox = this.getBoundingBox(target);
        const overlapX = Math.min(entityBox.right, targetBox.right) - Math.max(entityBox.left, targetBox.left);
        const overlapY = Math.min(entityBox.bottom, targetBox.bottom) - Math.max(entityBox.top, targetBox.top);
        if (overlapX > overlapY) { // Vertical collision
            if (entityBox.top < targetBox.top) {
                entity.isCollidingWithObstacleOnTheBottom = true;
            }
            else {
                entity.isCollidingWithObstacleOnTheTop = true;
            }
        }
        else { // horizontal collision
            if (entityBox.left < targetBox.left) {
                entity.isCollidingWithObstacleOnTheRight = true;
            }
            else {
                entity.isCollidingWithObstacleOnTheLeft = true;
            }
        }
    }
    detectProjectileCollision(projectile, target) {
        const projectileBox = this.getBoundingBox(projectile);
        const targetBox = this.getBoundingBox(target);
        return this.rectIntersect(projectileBox, targetBox);
    }
    handleProjectileHit(projectile, target) {
        // Marcar colisiones
        projectile.physics.vx = 0;
        projectile.physics.vy = 0;
        target.isCollidingWithPlayer = true; // O crear propiedad específica para proyectiles
        target.state = State.OFF;
        projectile.state = State.OFF;
        // Actualizar puntos
        globals.points += 100;
        // Opcional: Eliminar proyectil
        this.sprites = this.sprites.filter(sprite => sprite !== projectile);
        return;
    }
}
