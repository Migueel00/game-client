// clase que gestiona el HitBox de un sprite
export default class HitBox {
    xSize;
    ySize;
    xOffSet;
    yOffSet;
    constructor(xSize, ySize, xOffSet, yOffSet) {
        this.xSize = xSize; // Tamaño en pixeles del hitbox(x)
        this.ySize = ySize; // Tamaño en pixeles del hitbox(y)
        this.xOffSet = xOffSet; // Offset en X de comienzo de dibujo del Hitbox respecto xPos
        this.yOffSet = yOffSet; // Offset en Y
    }
}
