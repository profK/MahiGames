import SimpleImageSprite from "./SimpleImageSprite";
import Vector2 from "../Vector2";

export default class SpinningSprite extends SimpleImageSprite {
    private rotationSpeed:number=0;

    get Speed(){
        return this.rotationSpeed;
    }

    set Speed(radsPerSec:number){
        this.rotationSpeed = radsPerSec;
    }

    constructor(source:CanvasImageSource){
        super(source);
    }

    Update(msDelta: number):void {
        super.Update(msDelta);
        let center:Vector2 = this.Transform.DotVec(new Vector2(this.Width/2,this.Height/2));
        //zero the center
        this.Transform = this.Transform.Translate(new Vector2(-center.X,-center.Y));
        this.Transform = this.Transform.Rotate(this.rotationSpeed*msDelta/1000);
        this.Transform = this.Transform.Translate(center);
    }
}