import SpinningSprite from "./SpinningSprite";
import NumericalMapper from "../NumericalMapper";

/**
 * This class implements a sprite that spins with an increasing/creasing rate set by a mapping class
 * that maps 0:1 =>0:1 values.  It is used in WheelofFish
 * @class
 * @TTODO: Current only supports decreasing to 0 and increasing to a set max speed
 */
export default class AcceleratingSpinningSprite extends SpinningSprite {
    /**
     * The speed we are increasing or decreasing to over time
     */
    private targetSpeed:number = 0;
    /**
     * Time over which to interpolate reachign enw speed
     */
    private timeToReachMS:number=0;
    /**
     * A function that takes the lienar time curve and maps it to a arbitrarily defined curve
     */
    private mapper:NumericalMapper;
    /**
     * Internal tracker for how much time has passed since start of change
     */
    private timer:number = 0;




    /**
     * Used internally to track the speed changes
     */
    private startingSpeed:number;

    /**
     *  This method starts an acceleration or deceletation
     *  @TODO: currently any speed less then current speed is treated as a 0.  Shoudl be improved
     * @param spd the final speed to reach
     * @param timeToReachMS how long the accel/deccel will take
     * @param mappingFunc the function used to map the time to a more realistic non-linear curve
     * @method
     */
    public AcclToRadsPerSec(spd:number, timeToReachMS:number,mappingFunc:NumericalMapper){
        this.targetSpeed = spd;
        this.timeToReachMS = timeToReachMS;
        this.timer=0;
        this.mapper = mappingFunc;
        this.startingSpeed = this.Speed;
    }


    /**
     * This update function does the actual speed modficiation and Transform rotation
     * @param deltaMS numbre of MS since last called
     * @method
     */

    // first cut only knows how to accelerate
    public Update(deltaMS:number){
        if (this.timer>=this.timeToReachMS){
            this.Speed = this.targetSpeed;
        }
        else
        {
            this.timer = this.timer + deltaMS;
            let linearTimePos = this.timer/this.timeToReachMS
            let maxSpeed  =Math.max(this.startingSpeed,this.targetSpeed);

            if (this.targetSpeed<this.startingSpeed){
                // decellerating
                linearTimePos = 1-linearTimePos;
            }
            let newSpeed = maxSpeed*this.mapper.Map(linearTimePos);
           // console.log("Time: "+this.timer+", Speed: "+newSpeed);
            this.Speed = newSpeed;
        }
        super.Update(deltaMS);
    }
}