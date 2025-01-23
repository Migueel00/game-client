import Potion from "./Potion.js";
import ImageSet from "../ImageSet.js";
import Frames from "../Frames.js";
import Timer from "../Timer.js";
import { SpriteID, State } from "../constants.js";
import Knight from "../../Sprites/Knight.js";
import KnightShield from "../../Sprites/KnightShield.js";
import EnemyArcher from "../../Sprites/EnemyArcher.js";

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

    
}