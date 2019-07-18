import NumericalMapper from "../NumericalMapper";

/**
 * This class defines a mapping function that maps the input to an exponential curve, limited to 0 - 1  inclusive
 * @class
 */
export default class ExponentialMapper implements NumericalMapper {
    private expo:number=2;

    /**
     * Creates an exponential mapper with the given exponent
     * @param exponent the exponent of the map functions
     */
    constructor(exponent:number){
        this.expo = exponent;
    }

    /**
     * Implements the arcsin based mapping function.
     * @param input a numebr to map,
     * @return the number passed in raised to the set exponent
     * @method
     */
    Map(n: number): number {
        return Math.pow(n,this.expo);
    }


}