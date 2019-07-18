import Sprite from "../Sprite";
import Graphics2D, {MouseEventHandler} from "../Graphics2D";
import Matrix2D from "../Matrix2D";
import Vector2 from "../Vector2";

export default class TextSprite implements Sprite {
    public Transform: Matrix2D = new Matrix2D();
    private onClickCB: MouseEventHandler;
    private textSize:Vector2;
    protected g2d:Graphics2D; // needed for font metrics

    get Height(): number {
        return this.textSize.Y;
    }
    get Width(): number{
        return this.textSize.X;
    }

    get Text():string {
        return this.text;
    }

    // always use this because it sets the size
    set Text(t:string){
        this.text=t;
        this.textSize = this.g2d.GetTextSize(this.text);
    }

    private text:string;

    constructor(g2d:Graphics2D,text?:string){
        this.g2d = g2d;
        if (text==undefined){
            this.Text= "Ipsum lorum";
        }
        this.Text = text;
    }

    Render(g2d: Graphics2D): void {
        g2d.DrawText(this.Text,this.Transform);
    }

    Update(msDelta: number): void {
    }

}