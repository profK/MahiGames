import Sprite from "../Sprite";
import Graphics2D, {MouseEventHandler} from "../Graphics2D";
import Matrix2D from "../Matrix2D";
import Vector2 from "../Vector2";

/**
 * This is a sprite that draws left justified text at its origin.
 * @TODO: This is VERY preliminary and has a  number of limitations
 * @TODO:  Needs individually settbale font parameters
 * @TODO:  Currently  only uses position of Transform, doesnt play very will with the rest of the system
 * @TODO: Supporting code in Graphics2D probably needs a complete re-write to use sprite glyphs rather then
 * @TODO: canvas text
 */
export default class TextSprite implements Sprite {
    /**
     * Transform to transform the text. Currently only Translation is supported in Graphics2D
     */
    public Transform: Matrix2D = new Matrix2D();
    //private onClickCB: MouseEventHandler;  dino code to be removed
    /**
     * A cache for the calculated size of the current text string.  X is width, Y is height
     */
    private textSize:Vector2;
    /**
     * This sprite needs its own refernce to Graphis2D to do font metrics on demand
     */
    protected g2d:Graphics2D; // needed for font metrics

    /**
     * A holder for the string to render
     */
    private text:string;

    /**
     * The height of the text as returned by Graphics2D and cached locally
     * @property
     */
    get Height(): number {
        return this.textSize.Y;
    }

    /**
     * The width of the text as returned by Graphics2D and cached locally
     * @property
     */
    get Width(): number{
        return this.textSize.X;
    }

    /**
     * The string of text to render
     * @property
     */
    get Text():string {
        return this.text;
    }

    /**
     * Sets the text to be rendered.
     * It is important that ALL code that sets the text use this entyr point because it also
     * recalculates the text dimensions
     * @param t a string to render
     * @property
     */
    set Text(t:string){
        this.text=t;
        this.textSize = this.g2d.GetTextSize(this.text);
    }


    /**
     * This creates a TextSprite that renders the passed in string
     * @param g2d the Graphics2D that will be used to render the TextSprite
     * @param text an initialtext to render, may be reset with Text =
     */
    constructor(g2d:Graphics2D,text?:string){
        this.g2d = g2d;
        if (text==undefined){
            this.Text= "Ipsum lorum";
        }
        this.Text = text;
    }

    /**
     * This is called by the Graphics2D to render the sprite
     * @param g2d
     * @method
     */
    public Render(g2d: Graphics2D): void {
        g2d.DrawText(this.Text,this.Transform);
    }

    /***
     * A null update because a SimpleImageSprite has no behavior other then rendering
     * @param msDelta
     * @method
     */
    public Update(msDelta: number): void {
    }

}