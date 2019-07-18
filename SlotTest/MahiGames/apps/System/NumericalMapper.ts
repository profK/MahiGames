/**
 * This is a simple interface that defines an object with a Map function that maps a real input to a real output
 * It is generally assumed that the input and output are both in the 0-1 inclusive range
 * @interface
 */

export default interface NumericalMapper{
    /**
     * This method maps a real input to a real output
     * It is generally assumed that the input and output are both in the 0-1 inclusive range
     * @param input the input number (expects 0-1 inclusive)
     * @returns the output number (expected to be 0-1 inclusive)
     * @method
     */
    Map(input:number):number;

}