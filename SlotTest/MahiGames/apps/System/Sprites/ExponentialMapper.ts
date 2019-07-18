import NumericalMapper from "../NumericalMapper";

export default class ExponentialMapper implements NumericalMapper {
    private expo:number=2;

    constructor(exponent:number){
        this.expo = exponent;
    }

    //expects 0 .. 1 and returns 1 to the N
    Map(n: number): number {
        return Math.pow(n,this.expo);
    }


}