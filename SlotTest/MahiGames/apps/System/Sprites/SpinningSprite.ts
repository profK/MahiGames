import SimpleImageSprite from "./SimpleImageSprite";
import Vector2 from "../Vector2";

/**
 * A child of SimpleImageSprite that implements a self-rotating image
 * @class
 */
export default class SpinningSprite extends SimpleImageSprite {
    /**
     * Speed to rotate in clockwise radians per second
     */
    private rotationSpeed:number=0;


    /**
    * S
     * Gets the  speed to rotate in clockwise radians per second
     * @property
    */
    get Speed(){
        return this.rotationSpeed;
    }

    /**
     * Sets the  speed to rotate in clockwise radians per second
     * @property
     */
    set Speed(radsPerSec:number){
        this.rotationSpeed = radsPerSec;
    }


    /**
     * Rotates the sprite by applying a rotation to its Transform based
     * on rotationSpeed and the elapsed time in ms
     * @param msDelta elasped time in MS
     * @method
     */
    public Update(msDelta: number):void {
        super.Update(msDelta);
        let center:Vector2 = this.Transform.DotVec(new Vector2(this.Width/2,this.Height/2));
        //zero the center
        this.Transform = this.Transform.Translate(new Vector2(-center.X,-center.Y));
        this.Transform = this.Transform.Rotate(this.rotationSpeed*msDelta/1000);
        this.Transform = this.Transform.Translate(center);
    }
}