export default class Timer {
    value: number;
    timeChangeCounter: number;
    timeChangeValue: number;

    constructor(value : number, timeChangeValue : number){
        this.value              = value;     // Valor del temporizador
        this.timeChangeCounter  = 0;         // temporizador para cambio valor(seconds)
        this.timeChangeValue    = timeChangeValue // tiempo para cambiar valor
    }

    
}