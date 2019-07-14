import Sprite from "../Sprite";
import Graphics2D from "../Graphics2D";
import Rect from "../Rect";
import Matrix2D from "../Matrix2D";


export default class SimpleImageSprite implements Sprite {
    private source: CanvasImageSource;
    public Transform: Matrix2D = new Matrix2D();

    constructor(source: CanvasImageSource) {
        this.source = source;
    }

    get Width(): number {
        return <number>this.source.width;
    }

    get Height(): number {
        return <number>this.source.height;
    }

    Render(g2d: Graphics2D): void {

        g2d.DrawImage(this.source, new Rect(0, 0, <number>this.source.width, <number>this.source.height),this.Transform);
    }

    Update(msDelta: number):void {
       //nop nothing time based
    }


}