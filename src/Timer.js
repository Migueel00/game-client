export default class Timer {
    constructor(value, timeChangeValue){
        this.value              = value;     // Valor del temporizador
        this.timeChangeCounter  = 0;         // temporizador para cambio valor(seconds)
        this.timeChangeValue    = timeChangeValue // tiempo para cambiar valor

    }
}