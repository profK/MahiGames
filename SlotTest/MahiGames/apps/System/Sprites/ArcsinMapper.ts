import NumericalMapper from "../NumericalMapper";

/**
 * This class defines a mapping function that maps the input to an arcsin curve, limited to 0 - 1  inclusive
 * @class
 */
export default class ArcsinMapper implements NumericalMapper {
    private reverse;boolean = false;


    /**
     * Implements the arcsin based mapping function.
     * @param input a numebr to map, clipped to 0 to 1 inclusive
     * @return a 0-1 inclusive mappign result
     * @method
     */
    public Map(input: number): number {
        //asymptotes and limits
        if (input>=1){ return 1; }
        if (input<=0) { return 0 ;}

        return Math.asin(input)/(Math.PI/2);

    }

}