import Sprite from "../Sprite";
import Graphics2D, {MouseEventHandler} from "../Graphics2D";
import Rect from "../Rect";
import Matrix2D from "../Matrix2D";
import Vector2 from "../Vector2";


export default class SimpleImageSprite implements Sprite {
    protected source: CanvasImageSource;
    public Transform: Matrix2D = new Matrix2D();
    private onClickCB: MouseEventHandler;


    constructor(source: CanvasImageSource) {
        this.source = source;
    }

    get Width(): number {
        return <number>this.source.width;
    }

    get Height(): number {
        return <number>this.source.height;
    }

    get OnClckCB(): MouseEventHandler {
        return this.onClickCB
    }

    set OnClickCB(cb: MouseEventHandler) {
        this.onClickCB = cb;
    }

    Render(g2d: Graphics2D): void {

        g2d.DrawImage(this.source, this.Transform);
    }

    Update(msDelta: number): void {
        //nop nothing time based
    }

    OnClick(worldPos:Vector2):boolean {
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