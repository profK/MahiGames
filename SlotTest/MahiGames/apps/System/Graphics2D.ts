import Sprite from "./Sprite";
import Rect from "./Rect";
import Matrix2D from "./Matrix2D";
import SimpleImageSprite from "./Sprites/SimpleImageSprite";
import Vector2 from "./Vector2";

// X and Y are the canvas relative coords of the click
// a return of tue means to continue processing lcick on other sprites,
// false means to consume the evnrt and stop further processing
export type MouseEventHandler = (localPos: Vector2)=>boolean;

export default class Graphics2D
{
    
    private ctx:CanvasRenderingContext2D; 
    private canvas: HTMLCanvasElement;
    private spriteList: Sprite[] = new Array();
    private worldXform: Matrix2D = new Matrix2D();
    private screenSize:Vector2;
    private drawspaceSize:Vector2;


    get PhysicalSize(): Vector2{
        return this.screenSize;
    }

    get Size():Vector2{
        return this.drawspaceSize;
    }

    set WorldXform(xform:Matrix2D) {
        this.worldXform = xform;
    }

    ///  this is a safe access that returns a copy.
    get WorldXform() {
        return this.worldXform.Clone();
    }



    // default is idnetity matrix

    constructor(divname?: string) {
        if (divname == undefined) {
            divname = "canvas";
        }
        this.canvas = <HTMLCanvasElement>document.getElementById(divname);
        this.ctx = this.canvas.getContext('2d');
        // set up the size relative to the actual device
        this.ResetCanvasSize(window.innerWidth,window.innerHeight);
        this.screenSize = new Vector2(this.canvas.clientWidth,this.canvas.clientHeight);
        this.Redraw(); // initial frame
        // add in mouse click hook
        var self=this;
        this.canvas.addEventListener('mousedown',  (event) => {
            let x = event.offsetX;
            let y = event.offsetY;
            let skip: boolean = false;
            self.spriteList.forEach(sprite => {
                let sssprite = <SimpleImageSprite>sprite;
                if ((!skip)&&(sssprite.OnClick!=undefined)) {
                    let worldRelativeClick = self.WorldXform.Invert().DotVec(new Vector2(x, y));
                    skip = !sssprite.OnClick(worldRelativeClick); //eturns true if continuing, false if consumed
                }
            });
        });

    }

    public SetDrawspaceSize(size:Vector2):void {
        this.drawspaceSize= size;
        let scaleX = this.PhysicalSize.X/this.drawspaceSize.X;
        let scaleY = this.PhysicalSize.Y/this.drawspaceSize.Y;
        this.worldXform = new Matrix2D().Scale(new Vector2(scaleX,scaleY));
    }

    public ResetCanvasSize(width:number,height:number):void{
        this.canvas.width = width;
        this.canvas.height = height;
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

        this.SetBkgdColor(bkgdColor);
        this.FillRect(new Rect(0, 0, this.PhysicalSize.X, this.PhysicalSize.Y));
    }

    

    public DrawImage(image: CanvasImageSource, xform?: Matrix2D,subRect?:Rect, destSize?:Vector2) {
        
        if (xform == undefined) {
            xform = this.worldXform; // dont use getter to avoid an unecessary copy
        } else {
            xform = xform.Dot(this.worldXform); // ditto
        }
        if (subRect == undefined){
            subRect = new Rect(0,0,<number>image.width,<number>image.height);
        }
        if (destSize == undefined){
            destSize = new Vector2(subRect.Width,subRect.Height);
        }
        xform.SetContextTransform(this.ctx);
        this.ctx.drawImage(image, subRect.Position.X, subRect.Position.Y, subRect.Width, subRect.Height,
            0,0,destSize.X,destSize.Y);
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

function Teapottest():void {

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
    image.src = "utah_teapot.png"
}



