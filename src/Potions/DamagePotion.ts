import Frames from "../Frames.js";
import ImageSet from "../ImageSet.js";
import EnemyArcher from "../Sprites/EnemyArcher.js";
import Knight from "../Sprites/Knight.js";
import KnightShield from "../Sprites/KnightShield.js";
import Timer from "../Timer.js";
import { SpriteID, State } from "../constants.js";
import globals from "../globals.js";
import Potion from "./Potion.js";

export default class DamagePotion extends Potion {
    timer: Timer;
    enemies: (Knight | KnightShield | EnemyArcher)[];
    
    constructor(
        id: number,
        state: number,
        xPos: number,
        yPos: number,
        imageSet: ImageSet,
        frames: Frames,
        timer: Timer,
        enemies: (Knight | KnightShield | EnemyArcher)[]
    ) {
        super(id, state, xPos, yPos, imageSet, frames);

        this.timer = timer;
        this.enemies = enemies;
    }

    public static create(enemies : (Knight | KnightShield | EnemyArcher)[]): DamagePotion {
        const imageSet = new ImageSet(32, 0, 120, 80, 120, 80, 0, 10);
        const frames = new Frames(4, 0);
        const timer = new Timer(0, 5);
        return new DamagePotion(SpriteID.DAMAGE_POTION, State.DAMAGE, 0, 38, imageSet, frames, timer, enemies);
    }

    public update() : void{
        this.updateDamagePotion();
    }

    private updateDamagePotion() : void {
        const time = this.timer.value;
    
        for (let i = 1; i < 4; i++) {
            if (Math.floor(time / 10) === i) {
                this.frames.frameCounter = i;
            }
        }
    
        if (time >= 29) {
            this.timer.value = 30;
        }

        this.damagePotionEvent();
    }

    private damagePotionEvent(): void{ 
        if(this.frames.frameCounter === 3 && globals.action.damage){
    
            // Reset the states of the timer and frames
            this.frames.frameCounter = 0;
            this.timer.value = 0;
    
            // Random number of enemies to kill
            let randomNumberOfEnemiesToKill = Math.floor(Math.random() * this.enemies.length / 2); // max value enemies array length / 2
    
            // logic for the event
            for(let i = 0; i < randomNumberOfEnemiesToKill; i++){
                const randomIndexes = Math.floor(Math.random() * this.enemies.length);
                this.enemies.splice(randomIndexes, 1);
            }
        }
    }
}