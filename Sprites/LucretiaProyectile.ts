import Sprite from "./Sprite.js";
import ImageSet from "../src/ImageSet.js";
import Frames from "../src/Frames.js";
import Physics from "../src/Physics.js";
import HitBox from "../src/HitBox.js";
import { ProyectileType, SpriteID, State } from "../src/constants.js";
import globals from "../src/globals.js";

export default class LucretiaProyectile extends Sprite {
    lucretiaProyectile: boolean;
    isCollidingWithSprite: boolean;

    constructor(
        id: number, 
        state: number, 
        xPos: number, 
        yPos: number, 
        imageSet: ImageSet, 
        frames: Frames, 
        physics: Physics, 
        hitBox: HitBox
    ){

        super(id, state, xPos, yPos, imageSet, frames, physics, hitBox);

        this.lucretiaProyectile = true; // variable que indica si es un proyectil de lucretia
        this.isCollidingWithSprite = false; // variable que indica si colisiona con un sprite
        this.isCollidingWithSprite = false; // Variable que indica si colisiona con un sprite
    }

    public static create(xPos : number, yPos : number, type : number) : LucretiaProyectile{
        const frames        = new Frames(1);
        const physics       = new Physics(150, 0, 0, 0, 0); 

        let hitBox : HitBox;
        let sprite : LucretiaProyectile;
        let imageSet: ImageSet;

        switch(type){
            case ProyectileType.UP:
                hitBox = new HitBox(25, 25, 5, 8);
                imageSet = new ImageSet(27, 2, 50, 50, 120, 80, 45, 20);
                sprite = new LucretiaProyectile(SpriteID.LUCRETIA_PROYECTILE, State.LUCRETIA_PROYECTILE_UP, xPos, yPos, imageSet, frames, physics, hitBox);

                break;

            case ProyectileType.DOWN:
                hitBox = new HitBox(25, 25, 2, 15);
                imageSet = new ImageSet(26, 3, 50, 50, 120, 80, 45, 20);
                sprite = new LucretiaProyectile(SpriteID.LUCRETIA_PROYECTILE, State.LUCRETIA_PROYECTILE_DOWN, xPos, yPos, imageSet, frames, physics, hitBox);
                break;

            case ProyectileType.LEFT:
                hitBox = new HitBox(25, 25, 14, 8);
                imageSet = new ImageSet(28, 1, 50, 50, 120, 80, 45, 20);
                sprite = new LucretiaProyectile(SpriteID.LUCRETIA_PROYECTILE, State.LUCRETIA_PROYECTILE_LEFT, xPos, yPos, imageSet, frames, physics, hitBox);
                break;

            case ProyectileType.RIGHT:
                hitBox = new HitBox(25, 25, 14, 8);
                imageSet = new ImageSet(29, 0, 50, 50, 120, 80, 45, 20);
                sprite = new LucretiaProyectile(SpriteID.LUCRETIA_PROYECTILE, State.LUCRETIA_PROYECTILE_RIGHT, xPos, yPos, imageSet, frames, physics, hitBox); 
                break;

            default:
                throw new Error(`Error al crear el tipo de proyectil ${type}`);
        }

        return sprite;
    }

    public update(){

        switch(this.state){
            case State.LUCRETIA_PROYECTILE_UP:
                this.updateLucretiaProyectile(0, -this.physics.vLimit);
                break;

            case State.LUCRETIA_PROYECTILE_DOWN:
                this.updateLucretiaProyectile(0, this.physics.vLimit);
                break;

            case State.LUCRETIA_PROYECTILE_LEFT:
                this.updateLucretiaProyectile(-this.physics.vLimit, 0);
                break;

            case State.LUCRETIA_PROYECTILE_RIGHT:
                this.updateLucretiaProyectile(this.physics.vLimit, 0);
                break;
            case State.OFF:
                console.log("Proyectil de lucretia desactivado");
                break;

            default:
                console.error(`Error al actualizar el proyectil de lucretia con estado ${this.state}`);
        }


        if(this.isCollidingWithSprite){
            this.state = State.OFF;
        }
    }

    

    private updateLucretiaProyectile(vx : number, vy : number){
        // Maquina de estados
        this.physics.vx = vx;
        this.physics.vy = vy;

        // Calcula la distancia que se mueve
        this.xPos += this.physics.vx * globals.deltaTime;
        this.yPos += this.physics.vy * globals.deltaTime;
    
        // Al colisionar con los bordes del mapa saca el sprite del array de sprites
        this.calculateCollisionSpriteAndRemove();
    
    }

    private calculateCollisionSpriteAndRemove(){
        const isCollision = this.calculateCollisionWithBorders();
    
        if(isCollision){
            this.state = State.OFF;
        }
    }
    
    private calculateCollisionWithBorders() : boolean{
        const { xPos, yPos, imageSet } = this;
        const { width, height } = globals.canvas as any;

        return (
            xPos + imageSet.xSize > width ||
            yPos + imageSet.ySize > height || 
            xPos < 0 || 
            yPos < 0
        );
    }
    
}
