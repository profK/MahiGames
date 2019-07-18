import SpinningSprite from "./SpinningSprite";
import NumericalMapper from "../NumericalMapper";

export default class AcceleratingSpinningSprite extends SpinningSprite {
    private targetSpeed:number = 0;
    private timeToReachMS:number=0;
    private mapper:NumericalMapper;
    private timer:number = 0;


    constructor(source:CanvasImageSource,accelFunc:NumericalMapper){
        super(source);
        this.mapper = accelFunc;

    }

    private startingSpeed:number;

    public AcclToRadsPerSec(spd:number, timeToReachMS:number,mappingFunc:NumericalMapper){
        this.targetSpeed = spd;
        this.timeToReachMS = timeToReachMS;
        this.timer=0;
        this.mapper = mappingFunc;
        this.startingSpeed = this.Speed;
    }




    // first cut only knows how to accelerate
    Update(deltaMS:number){
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