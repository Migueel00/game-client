export default class Text {
    text;
    xPos;
    yPos;
    Physics;
    constructor(text, xPos, yPos, Physics) {
        this.text = text;
        this.xPos = xPos;
        this.yPos = yPos;
        this.Physics = Physics;
    }
}
