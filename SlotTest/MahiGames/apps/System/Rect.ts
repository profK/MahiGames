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

    public Contains(vec:Vector2){
        return (vec.X>=this.Position.X)&&(vec.X<=this.Position.X+this.Width)&&
            (vec.Y>=this.Position.Y)&&(vec.Y<=this.Position.Y+this.Height);

    }
}
