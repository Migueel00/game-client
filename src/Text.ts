import Physics from "./Physics.js";

export default class Text {
    text: string;
    xPos: number;
    yPos: number;
    Physics: Physics;

    constructor(
        text: string,
        xPos: number,
        yPos: number,
        Physics: Physics
    ){

        this.text    = text;
        this.xPos    = xPos;
        this.yPos    = yPos;
        this.Physics = Physics;
    }



}