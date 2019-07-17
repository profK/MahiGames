import SimpleImageSprite from "./SimpleImageSprite";

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
        this.Transform = this.Transform.Rotate(this.rotationSpeed*msDelta/1000);
    }
}