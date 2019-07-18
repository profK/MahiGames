import NumericalMapper from "../NumericalMapper";

export default class ArcsinMapper implements NumericalMapper {
    private reverse;boolean = false;


    Map(input: number): number {
        //asymptotes and limits
        if (input>=1){ return 1; }
        if (input<=0) { return 0 ;}

        return Math.asin(input)/(Math.PI/2);

    }

}