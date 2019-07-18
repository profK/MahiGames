export default class Vector2
{
    public values: number[] = new Array(3);
    get X(): number { return this.values[0]; }
    set X(v: number) { this.values[0] = v;}
    get Y(): number { return this.values[1]; }
    set Y(v: number) { this.values[1] = v; }
    get W(): number { return this.values[2]; }
    set W(v: number) { this.values[2] = v; }

    constructor(x: number, y: number, w?: number) {
        if (w == undefined) {
            w = 1;
        }
        this.X = x;
        this.Y = y;
        this.W = w;
    }

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

    TimesScalar(mult: number) {
        return new Vector2(this.X*mult,this.Y*mult);
    }

    Add(other: Vector2) {
        return new Vector2(this.X+other.X,this.Y+other.Y);
    }

    Sub(other: Vector2):Vector2 {
        return new Vector2(this.X-other.X,this.Y-other.Y);
    }

    Minus(other: Vector2):Vector2 {
        return new Vector2(this.X-other.X,this.Y-other.Y);
    }

    DivScalar(scalar:number):Vector2{
        return new Vector2(this.X/scalar,this.Y/scalar);
    }

    Magnitude():number {
        return Math.sqrt((this.X*this.X)+(this.Y*this.Y));
    }

    Normalized():Vector2{
        return this.DivScalar(this.Magnitude());
    }
}
