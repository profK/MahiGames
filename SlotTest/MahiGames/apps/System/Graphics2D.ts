import Sprite from "./Sprite";
import Rect from "./Rect";

export default class Graphics2D
{
    
    private ctx; 
    private canvas:HTMLCanvasElement;

    constructor(divname?: string) {
        if (divname == undefined) {
            divname = "canvas";
        }
        this.canvas = <HTMLCanvasElement>document.getElementById(divname);
        this.ctx = this.canvas.getContext('2d');
        // paint the background black 
        this.Redraw(); // initisl frame
       

    }
    
    public AddSprite (sprite: Sprite): void
    {
        
    }        
    
    public RemoveSprite (sprite: Sprite): void
    {
        
    } 

    public SetBkgdColor(style?: string): void {

        if (style == undefined) {
            style = "blue";    
        }
        this.ctx.fillstyle = style;
    }

    public FillRect(rect: Rect): void {
        this.ctx.fillRect(rect.Position.X, rect.Position.Y, rect.Width, rect.Height);
    }

    public Clear(bkgdColor?: string) {
        let clientHeight = this.canvas.clientHeight;
        let clientWidth = this.canvas.clientWidth;
        this.SetBkgdColor(bkgdColor);
        this.FillRect(new Rect(0, 0, clientWidth, clientHeight));
    }

    public Redraw(bkgdColor?: string): void {
        this.Clear();
       
    }

   
}


    // stand alone web page test
    console.log("Making a G2D");
    new Graphics2D();



