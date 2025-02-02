// clase que gestiona el HitBox de un sprite
export default class HitBox{
    xSize: number;
    ySize: number;
    xOffSet: number;
    yOffSet: number;
    isTrigger: boolean;

    constructor(xSize : number, ySize: number, xOffSet: number, yOffSet: number, isTrigger: boolean = false){
        this.xSize          = xSize; // Tamaño en pixeles del hitbox(x)
        this.ySize          = ySize; // Tamaño en pixeles del hitbox(y)
        this.xOffSet        = xOffSet; // Offset en X de comienzo de dibujo del Hitbox respecto xPos
        this.yOffSet        = yOffSet; // Offset en Y
        this.isTrigger = isTrigger; 
    }
}