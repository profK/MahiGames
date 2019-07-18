/**
 * This is amath class that implents a 2D vector as an array of numbers.
 * A TypeScript array format allows for the use of map/reduce when dot  multiplying by a Matrix2D
 * This class does not yet implement all rasonable math functions, but only those needed right now
 * by the Graphics2D engine
 * It provides setters and getters to access the array elements as X,Y and W
 *
 */

export default class Vector2
{
    /**
     * Holds the values
     * @TODO: should really be made private with an acessor to make the interface  immutable
     * @property
     */
    public values: number[] = new Array(3);

    /**
     * gets the X position of the array and retruns its value
     * @property
     */
    get X(): number { return this.values[0]; }
    /**
     * sets the X position of the array
     * @property
     */
    set X(v: number) { this.values[0] = v;}
    /**
     * gets the Y position of the array and retruns its value
     * @property
     */
    get Y(): number { return this.values[1]; }
    /**
     * sets the Y position of the array
     * @property
     */
    set Y(v: number) { this.values[1] = v; }
    /**
     * gets the W position of the array and retruns its value
     * @property
    */
    get W(): number { return this.values[2]; }
    /**
     * sets the W position of the array
     * @property
     */
    set W(v: number) { this.values[2] = v; }

    /**
     * This creates a new Vector2 with the passed in values
     * @param x the X value
     * @param y the Y value
     * @param w the W value, default is 1
     * @constructor
     */
    constructor(x: number, y: number, w?: number) {
        if (w == undefined) {
            w = 1;
        }
        this.X = x;
        this.Y = y;
        this.W = w;
    }

    /**
     * tests two vectors for euqality to the passed numebr of places
     * Note that the number of places is necessary to deal with rounding errors in the Javascript engine
     * Default number of places is 6 after the decimal
     * @param v2 the other Vector2 to comapre against
     * @param numplaces the number of places after the decimal to check
     * @returns true if equal, false if not
     * @method
     */
    public equals(v2: Vector2, numplaces?: number): boolean {
        if (numplaces == undefined) {
            numplaces = 6; //round after 6 palces after the decimal
        }
        for (let i = 0; i < 3; i++) {
            if (+this.values[i].toFixed(numplaces) != +v2.values[i].toFixed(numplaces)) {
                return false;
            }
        }
        return true;
    }

    /**
     * This multiples this Vector2 times a scalar and returns the result as a new Vector2
     * @param mult scalar to multiply by
     * @constructor
     * @returns the resulting Vector2
     */
    TimesScalar(mult: number) {
        return new Vector2(this.X*mult,this.Y*mult);
    }

    /**
     * This adds this Vector2 to another Vector2 and returns the result as a new Vector2
     * @param other
     * @returns the resulting Vector2
     * @method
     */
    Add(other: Vector2) {
        return new Vector2(this.X+other.X,this.Y+other.Y);
    }

    /**
     * This subtracts another Vector2 from this one and returns the result as a new Vector2
     * @param other
     * @returns the resulting Vector2
     * @method
     */
    Minus(other: Vector2):Vector2 {
        return new Vector2(this.X-other.X,this.Y-other.Y);
    }

    /**
     * This divides this Vector2 times a scalar and returns the result as a new Vector2
     * @param mult scalar to multiply by
     * @constructor
     * @returns the resulting Vector2
     */
    DivScalar(scalar:number):Vector2{
        return new Vector2(this.X/scalar,this.Y/scalar);
    }

    /**
     * This returns the length of this Vector2 as a scalar
     * @returns a number holding the resulting length
     * @method
     */
    Magnitude():number {
        return Math.sqrt((this.X*this.X)+(this.Y*this.Y));
    }

    /**
     * This returns the normalized version of this Vector2 as a vector2
     * @returns a Vector2 holding the normalized vector
     * @method
     */
    Normalized():Vector2{
        return this.DivScalar(this.Magnitude());
    }
}
