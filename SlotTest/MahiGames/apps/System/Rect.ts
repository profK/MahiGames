import Vector2  from "./Vector2";

export default class Rect
{
    public Position:Vector2;
    public Width:number;
    public Height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.Position = new Vector2(x, y);
        this.Width = width;
        this.Height = height;
    }
}
