import Sprite from "./Sprite";
import Rect from "./Rect";
import Matrix2D from "./Matrix2D";
import SimpleImageSprite from "./Sprites/SimpleImageSprite";
import Vector2 from "./Vector2";

export default class Graphics2D
{
    
    private ctx:CanvasRenderingContext2D; 
    private canvas: HTMLCanvasElement;
    private spriteList: Sprite[] = new Array();
    private worldXform: Matrix2D = new Matrix2D(); // default is idnetity matrix

    constructor(divname?: string) {
        if (divname == undefined) {
            divname = "canvas";
        }
        this.canvas = <HTMLCanvasElement>document.getElementById(divname);
        this.ctx = this.canvas.getContext('2d');
        // paint the background black 
        this.Redraw(); // initisl frame
       

    }
    
    set WorldXform(xform:Matrix2D) {
        this.worldXform = xform;
    }

    ///  this is a safe access that returns a copy.
    get WorldXform() {
        return this.worldXform.Clone();
    }

    public AddSprite(sprite: Sprite): void
    {
        this.spriteList.push(sprite);
    }        
    
    public RemoveSprite (sprite: Sprite): void
    {
        let idx = this.spriteList.findIndex(a => a == sprite); //note == used because we DO want to compare references not values
        if (idx >= 0) { // found a match
            this.spriteList.splice(idx, 1);
        }
        
    } 

    public SetBkgdColor(style?: string): void {

        if (style == undefined) {
            style = "blue";    
        }
        this.ctx.fillStyle = style;
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

    

    public DrawImage(image: CanvasImageSource, subRect: Rect, xform?: Matrix2D) {
        
        if (xform == undefined) {
            xform = this.worldXform; // dont use getter to avoid an unecessary copy
        } else {
            xform = xform.Dot(this.worldXform); // ditto
        }
        xform.SetContextTransform(this.ctx);
        this.ctx.drawImage(image, subRect.Position.X, subRect.Position.Y, subRect.Width, subRect.Height);
    }

    private lastTime:Date;
    public Redraw(bkgdColor?: string): void {
        if (this.lastTime == undefined) { // first call
            this.lastTime =new  Date();
            return;
        }
        let currentTime:Date = new Date();
        let msDelta = currentTime.getMilliseconds();
        this.Clear();
        this.spriteList.forEach(a => a.Update(msDelta));
        this.spriteList.forEach(a => a.Render(this));
    }

   
}


    // stand alone web page test
    console.log("Making a G2D");
let g2d = new Graphics2D();
let image = new Image();
image.onerror = () => {
    console.log("Failed loading teapot");
}
image.onload = () => {
    let sprite: SimpleImageSprite = new SimpleImageSprite(image);
    let m: Matrix2D = sprite.Transform.Translate(new Vector2(-sprite.Width / 2, -sprite.Height / 2));
    m = m.Rotate(Math.PI / 4);
    m = m.Translate(new Vector2(200, 200));
    sprite.Transform = m;
    g2d.AddSprite(sprite);
    g2d.Redraw();
};
image.src="utah_teapot.png"



