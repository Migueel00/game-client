//Clase que gestiona el tileSet de un sprite
export default class ImageSet {
    constructor(initFil, initCol, xSize, ySize, xGridSize, yGridSize, xOffset, yOffset) {
        this.initFil = initFil; // Fila de inicio del imageSet
        this.initCol = initCol; // Columna de inicio del imageSet
        this.xSize = xSize; // Tamaña en pixeles de la imagen(X)
        this.ySize = ySize; // Tamaño en pixeles de la imagen (Y)
        this.yOffset = yOffset; // Offset en Y de comienzo de dibujo dle personaje respecto de la rejilla
        this.xOffset = xOffset; // Offset en X de comienzo de dibujo del personaje respecto a la rejilla
        this.xGridSize = xGridSize; // Tamaño en pixeles de la rejilla contenedora de la imagen (X)
        this.yGridSize = yGridSize; // Tamaño en pixeles de la rejilla contenedora de la imagen (Y)
    }
}
