import Sprite from "../Sprite";
import Graphics2D, {MouseEventHandler} from "../Graphics2D";
import Rect from "../Rect";
import Matrix2D from "../Matrix2D";
import Vector2 from "../Vector2";


/**
 * A basic image drawing sprite. It is a super-class for a number fo fancier sprites.
 * It has a bitmap source, basic dimensions, a Transform, and a click CB
 * @class
 */
export default class SimpleImageSprite implements Sprite {
    /**
     * The CanvasImageSource that holds the actual bitmap
     */
    protected source: CanvasImageSource;
    /**
     * A Transformation matrix to apply when drawing the bitmap
     */
    public Transform: Matrix2D = new Matrix2D();
    /**
     * A client supplied method to call if the mosue is clicked within the sprite's bounding rectangle
     */
    private onClickCB: MouseEventHandler;


    /**
     * This creates a SimpleImageSprite from an HTML5 CanvasImageSource
     * @param source the CanvasImageSource providing the bitmap
     * @constructor
     */
    constructor(source: CanvasImageSource) {
        this.source = source;
    }

    /**
     * The width of the sprite's bounding rectangle
     * @property
     */
    get Width(): number {
        return <number>this.source.width;
    }

    /**
     * The height of the sprite's bounding rectangle
     * @property
     */
    get Height(): number {
        return <number>this.source.height;
    }

    /**
     * The user provided callback on mosue click, or undefined if not set
     * @property
     */
    get OnClckCB(): MouseEventHandler {
        return this.onClickCB
    }

    /**
     * Sets the user provided callback on mouse click
     * @property
     */
    set OnClickCB(cb: MouseEventHandler) {
        this.onClickCB = cb;
    }

    /**
     * Called by the Gaphics2D to render the image
     * @param g2d the G2D to use to render
     * @method
     */
    public Render(g2d: Graphics2D): void {

        g2d.DrawImage(this.source, this.Transform);
    }

    /***
     * A null update because a SimpleImageSprite has no behavior other then rendering
     * @param msDelta
     * @method
     */
    public Update(msDelta: number): void {
        //nop nothing time based
    }

    /**
     * A callback on mouse click that checks to se eif the click is in the sprite's boundng
     * rectangle.  if so it calls the user defined callback if defined.
     * @param worldPos where in drawspace the click ocurred
     * @method
     */
    public OnClick(worldPos:Vector2):boolean {
        console.log("got click event");
        if (this.onClickCB == undefined){
            return true;
        } else {
            let testRect =new Rect(0,0,<number>this.source.width,<number>this.source.height);
            let localPos:Vector2 = this.Transform.Invert().DotVec(worldPos);
            if (testRect.Contains(localPos)) {
                console.log("click in my space");
                return this.onClickCB(localPos);
            } else {
                console.log("click out of my space");
            }
        }
    }


}