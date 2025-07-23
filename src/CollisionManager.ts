import Sprite from "./Sprites/Sprite.js";
import { Block2, Obstacles, SpriteID, State } from "./constants.js";
import globals from "./globals.js";

type collisionSide = 'top' | 'bottom' | 'left' | 'right';

export default class CollisionManager {
	private sprites: Sprite[];
	private static BRICK_SIZE: number;
	private static OBSTACLE_TYPES: number[];
	private static MAP_OBSTACLES: number[];

	constructor(sprites: Sprite[]) {
		this.sprites = sprites;
	}

	public static initialize() {
		this.BRICK_SIZE = globals.level.imageSet.xGridSize;
		this.OBSTACLE_TYPES = [Obstacles.BLOQUE_3, Obstacles.BLOQUE_2,
		Obstacles.BLOQUE_6, Obstacles.BLOQUE_5, Obstacles.BLOQUE_8,
		Obstacles.BLOQUE_7
		];
		this.MAP_OBSTACLES = [Block2.BLOQUE_4];
	}

	public detectAllCollisions(): void {
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

	private getPlayer(): Sprite | undefined {
		return this.sprites.find(sprite => sprite.id === SpriteID.LUCRETIA);
	}

	private getCollidables(): Sprite[] {
		return this.sprites.filter(sprite =>
			!sprite.hitBox.isTrigger && // ignore triggers
			sprite !== this.getPlayer() &&
			!this.isProyectile(sprite)
		)
	}

	private getProyectiles(): Sprite[] {
		return this.sprites.filter(sprite => this.isProyectile(sprite));
	}

	private isProyectile(sprite: Sprite): boolean {
		return sprite.id === SpriteID.LUCRETIA_PROYECTILE;
	}

	private detectEntityCollision(entity: Sprite, target: Sprite): void {
		const entityBox = this.getBoundingBox(entity);
		const targetBox = this.getBoundingBox(target);

		if (this.rectIntersect(entityBox, targetBox)) {
			this.updateCollisionFlags(entity, target);
		}
	}

	private getBoundingBox(sprite: Sprite): {
		left: number;
		right: number;
		top: number;
		bottom: number;
	} {
		return {
			left: sprite.xPos + sprite.hitBox.xOffSet,
			right: sprite.xPos + sprite.hitBox.xOffSet + sprite.hitBox.xSize,
			top: sprite.yPos + sprite.hitBox.yOffSet,
			bottom: sprite.yPos + sprite.hitBox.yOffSet + sprite.hitBox.ySize
		};
	}

	private rectIntersect(a: ReturnType<typeof this.getBoundingBox>, b: ReturnType<typeof this.getBoundingBox>): boolean {
		return !(
			a.right < b.left ||
			a.left > b.right ||
			a.bottom < b.top ||
			a.top > b.bottom
		);
	}

	private updateCollisionFlags(entity: Sprite, target: Sprite): void {
		// Colissions player
		if (entity === this.getPlayer()) {
			target.isCollidingWithPlayer = true;
			this.determineCollisionSide(entity, target);
		}
	}

	private determineCollisionSide(entity: Sprite, target: Sprite): void {
		const entityBox = this.getBoundingBox(entity);
		const targetBox = this.getBoundingBox(target);

		const overlapX = Math.min(entityBox.right, targetBox.right) - Math.max(entityBox.left, targetBox.left);
		const overlapY = Math.min(entityBox.bottom, targetBox.bottom) - Math.max(entityBox.top, targetBox.top);

		if (overlapX > overlapY) { // Vertical collision
			if (entityBox.top < targetBox.top) {
				entity.isCollidingWithObstacleOnTheBottom = true;
			} else {
				entity.isCollidingWithObstacleOnTheTop = true;
			}
		} else { // horizontal collision
			if (entityBox.left < targetBox.left) {
				entity.isCollidingWithObstacleOnTheRight = true;
			} else {
				entity.isCollidingWithObstacleOnTheLeft = true;
			}
		}
	}

	private detectProjectileCollision(projectile: Sprite, target: Sprite): boolean {
		const projectileBox = this.getBoundingBox(projectile);
		const targetBox = this.getBoundingBox(target);
		return this.rectIntersect(projectileBox, targetBox);
	}

	private handleProjectileHit(projectile: Sprite, target: Sprite): void {
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

