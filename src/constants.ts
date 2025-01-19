//CONSTANTES 

//ESTADOS DEL JUEGO
export const Game = {
    INVALID: -1,
    LOADING: 0,
    PLAYING: 1,
    OVER: 2,
    NEW_GAME: 3,
    STORY: 4,
    CONTROLS: 6,
    HIGHSCORES: 7,
    LOAD_SCORES: 8
}

//Velocidad del juego
export const FPS = 30;

//Identificador de tipo de Sprite (ID)
export const SpriteID = {
    // GAME SPRITES
    KNIGHT: 0,
    KNIGHT_SHIELD: 1,
    KNIGHT_ARCHER: 2,
    LUCRETIA: 3,
    HEAL_POTION: 4,
    DAMAGE_POTION: 5,
    FIRE: 6,
    PERGAMINO: 7,
    MANDO: 8,
    RIGHT_KEY: 9,
    LEFT_KEY: 10,
    UP_KEY: 11,
    DOWN_KEY: 12,
    Z_KEY: 13,
    P_KEY: 14,
    X_KEY: 15,
    C_KEY: 16,
    LIFE_ICON: 17,
    LUCRETIA_PROYECTILE: 19,
    ARCHER_PROYECTILE: 20,
    ARCHER_PROYECTILE_LEFT: 21

}

//Identificador de estado de sprite (direccion)
export const State = {
    //Estados Enemigo 
    KNIGHT_RIGHT: 0,
    KNIGHT_LEFT: 1,
    KNIGHT_ATTACK: 2,
    KNIGHT_ATTACK_2: 3,
    KNIGHT_HIT: 4,
    KNIGHT_DIE: 5,
    KNIGHT_ROLL: 6,
    KNIGHT_ROLL_LEFT: 7,

    //Estados caballero escudo
    KNIGHT_SHIELD_RIGHT: 0,
    KNIGHT_SHIELD_LEFT: 1,
    KNIGHT_SHIELD_ATTACK: 2,
    KNIGHT_SHIELD_BLOCK: 3,
    KNIGHT_SHIELD_DIE: 4,

    //Estado caballero con arco
    KNIGHT_ARCHER_STILL: 0,
    KNIGHT_ARCHER_RIGHT: 1,
    KNIGHT_ARCHER_LEFT: 2,
    KNIGHT_ARCHER_ATTACK_RIGHT: 3,
    KNIGHT_ARCHER_ATTACK_LEFT: 4,

    //Estado de lucretia
    LUCRETIA_IDLE_LEFT: 0,
    LUCRETIA_IDLE_RIGHT: 1,
    LUCRETIA_LEFT: 2,
    LUCRETIA_RIGHT: 3,
    LUCRETIA_ATTACK_LEFT: 4,
    LUCRETIA_ATTACK_RIGHT: 5,
    LUCRETIA_HIT_LEFT: 6,
    LUCRETIA_HIT_RIGHT: 7,

    //ESTADO POCIONES
    HEAL: 0,


    //ESTADO POCIONES DAÑO
    DAMAGE: 0,

    //ESTADOS FIRE
    FIRE_LOOP: 0,

    //ESTADOS CALAVERA
    STILL_CALAVERA: 0,

    //ESTADO PERGAMINO
    STILL_PERGAMINO: 0,

    //IMAGEN MANDO
    STILL_MANDO: 0,

    //TECLAS
    RIGHT_KEY: 0,
    LEFT_KEY: 0,
    UP_KEY: 0,
    DOWN_KEY: 0,
    Z_KEY: 0,
    P_KEY: 0,
    X_KEY: 0,
    C_KEY: 0,

    // ICONO DE SALUD
    LIFE_ICON: 0,
    LIFE_ICON_WASTED: 0,

    //PROYECTILES
    LUCRETIA_PROYECTILE_RIGHT: 1,
    LUCRETIA_PROYECTILE_LEFT: 2,
    LUCRETIA_PROYECTILE_UP: 3,
    LUCRETIA_PROYECTILE_DOWN: 4,

    ARCHER_PROYECTILE_HORIZONTAL: 0,
    ARCHER_PROYECTILE_VERTICAL: 1,


    // Estados Pintar sprite
    ON: 0,
    OFF: -1
}

//Tamaños de tileSet 
export const Tile = {
    SIZE_64: 0, //Sprites 64 x 64
    SIZE_32: 1  //Tiles de mapa 32 x 32
}

export const Block2 = {
    BLOQUE_1: 41,
    BLOQUE_2: 34,
    BLOQUE_3: 42,
    BLOQUE_4: 33,
    BLOQUE_5: 203,
    BLOQUE_6: 152,
    BLOQUE_7: 200,
    BLOQUE_8: 202,
    BLOQUE_9: 115,
    BLOQUE_10: 205,
    BLOQUE_11: 201,
    BLOQUE_12: 120,
    BLOQUE_13: 206,
    BLOQUE_14: 119,
    BLOQUE_15: 207,
    BLOQUE_16: 186,
    BLOQUE_17: 204,
    BLOQUE_18: 0,
    BLOQUE_19: 214,
    BLOQUE_20: 215,
    BLOQUE_21: 221,
    BLOQUE_22: 218,
    BLOQUE_23: 219,
    BLOQUE_24: 216,
    BLOQUE_25: 217,
    BLOQUE_26: 220,
    BLOQUE_27: 222,
}

export const Obstacles = {
    BLOQUE_1: 0,
    BLOQUE_2: 214,
    BLOQUE_3: 215,
    BLOQUE_4: 221,
    BLOQUE_5: 218,
    BLOQUE_6: 219,
    BLOQUE_7: 216,
    BLOQUE_8: 217,
    BLOQUE_9: 220,
    BLOQUE_10: 222,
}



// Keyboard key codes
export const Key = {
    UP: 38,
    DOWN: 40,
    RIGHT: 39,
    LEFT: 37,
    ATTACK: 88,
    DAMAGE: 90,
    HEAL: 67,
    ENTER: 13,
    ESCAPE: 27
}

// ID de particulas
export const ParticleID = {
    EXPLOSION: 0,
    FIRE: 1,
    FIREWORKS: 2
}

// Estados de particula
export const ParticleState = {
    ON: 0,
    FADE: 1,
    OFF: -1
}

export const GRAVITI = 9.8;

export const Sound = {

    NO_SOUND: -1,
    GAME_MUSIC: 0,
    JUMP: 1
}

export const ProyectileType = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
}