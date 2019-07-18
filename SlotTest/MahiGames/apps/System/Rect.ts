import Vector2  from "./Vector2";

/**
 * This is a simple geometric class that defiens a rectangle by its top left corner, width and height.
 * its is inclusive of  the boundaries
 * It also provides a method to test a point for inclusion in the rectangle
 * @class
 */
export default class Rect
{
    /**
     * The top left corner of the rectangle
     * @property
     */
    public Position:Vector2;
    /**
     * The width of the rectangle
     * @property
     */
    public Width:number;
    /**
     * The height of the rectangle
     * @property
     */
    public Height: number;

    /**
     * This reates a new rectangle with the passed in parameters
     * @param x the left side of the rectangle
     * @param y the top of the rectangle
     * @param width the width of the rectangle
     * @param height the height of the rectangle
     */
    constructor(x: number, y: number, width: number, height: number) {
        this.Position = new Vector2(x, y);
        this.Width = width;
        this.Height = height;
    }

    /**
     * This tests a point passed a sa Vector2 for inclusion in the space defined  by the ractangle
     * @param vec the point to test as a Vector2
     * @returns true if the point is inside or on the boundaries of the rectangle, false if not
     * @method
     */
    public Contains(vec:Vector2){
        return (vec.X>=this.Position.X)&&(vec.X<=this.Position.X+this.Width)&&
            (vec.Y>=this.Position.Y)&&(vec.Y<=this.Position.Y+this.Height);

    }
}
