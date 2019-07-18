import Sprite from "./Sprite";
import Rect from "./Rect";
import Matrix2D from "./Matrix2D";
import SimpleImageSprite from "./Sprites/SimpleImageSprite";
import Vector2 from "./Vector2";

// X and Y are the canvas relative coords of the click
// a return of tue means to continue processing lcick on other sprites,
// false means to consume the evnrt and stop further processing
export type MouseEventHandler = (localPos: Vector2)=>boolean;

/**
 * This class is an abstraction of the underlying drawing system.  It serves to isolate the ret of the code from
 * the low level rendering details.
 *
 * It also owns the update/render list which is called to draw a frame through the Render method
 * @class
 */
export default class Graphics2D
{

    /**
     * This private field holds a reference to the HTML5 CanvasRederingContext to use to draw
     */
    private ctx:CanvasRenderingContext2D;
    /**
     * This private field holds a reference to the HTMl <canvas> element of the page
     */
    private canvas: HTMLCanvasElement;
    /**
     * This is the update/draw list.  Sprites are invoked in their order in the list
     */
    private spriteList: Sprite[] = new Array();
    /**
     * This holds a base transform from the virtual draw space to the canvas space
     * It allows for transformation of the entire presentation and is typiaclly used to scale the
     * game for different display sizes
     *
     * This is also called a "camera transform" in some game engines
     */
    private worldXform: Matrix2D = new Matrix2D();
    /**
     * This is the actual size of the canvas in pixels
     */
    private screenSize:Vector2;
    /**
     * This is the size of the virtual draw space, which is mapped to the canvas by the worldXform
     */
    private drawspaceSize:Vector2;


    /**
     * Returns the size of the actual canvas as a Vector2 where X is the width and Y is the height
     * @property
     */
    get PhysicalSize(): Vector2{
        return this.screenSize;
    }

    /**
     * Returns the size of the virtual drawspace as a Vector2 where X is the width and Y is the height
     * @property
     */
    get Size():Vector2{
        return this.drawspaceSize;
    }


    /***
     * This sets the world transform, also called a camera transform, that maps from virtual draw space to
     * canvas space
     * @param xform  a Matrix2D used to transform from virtual draw space to canvas space
     * @property
     */
    set WorldXform(xform:Matrix2D) {
        this.worldXform = xform;
    }

    /**
     * This returns a copy of the current world transform. Changing it will NOT change the
     * world transform unless it is set back with the setter
     * @property
     */
    get WorldXform() {
        return this.worldXform.Clone();
    }


    /**
     * This creates a Graphics2D which is necessary for all drawing operations.
     * It retrieves the graphics context from an HTML5  canvas element named "canvas" by default but this can be
     * overidden
     * @param divname  the name of the canvas element to render to, defaults to "canvas"
     * @constructor
     */
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
        // NOTE: this is temporary, eventually proper font support shouldbe added
        this.ctx.font = 'bold 48px serif';
        this.ctx.fillStyle = 'black';
        var self = this;
        window.addEventListener('resize', ()=>{
            self.ResetCanvasSize(window.innerWidth,window.innerHeight);
            self.screenSize = new Vector2(this.canvas.clientWidth,this.canvas.clientHeight);
            self.SetDrawspaceSize(self.Size); // reset world transform
        });


    }


    /**
     * This sets the virtual draw space size.  It re-writes the world transform as a scaling transform
     * from the given size to the actual canvas size
     * @param size a Vector2 where X is the width of the draw space, and Y is the height
     * @method
     */
    public SetDrawspaceSize(size:Vector2):void {
        this.drawspaceSize= size;
        let scaleX = this.PhysicalSize.X/this.drawspaceSize.X;
        let scaleY = this.PhysicalSize.Y/this.drawspaceSize.Y;
        this.worldXform = new Matrix2D().Scale(new Vector2(scaleX,scaleY));
    }

    /**
     * This is used to make the actual canvas element the size of the available browser window
     * @param width the width to set the canvas element to
     * @param height the height to set the canvas element to
     * @method
     */
    private ResetCanvasSize(width:number,height:number):void{
        this.canvas.width = width;
        this.canvas.height = height;
    }


    /**
     * This adds a sprite to the list to be updated and drawn each frame
     * @param sprite An object that implements the Sprite interface
     * Note that a sprite that is added multiple tiems will get multiple Update and Redraw
     * calls every frame. (Which is probably not what you want.)
     * @method
     */
    public AddSprite(sprite: Sprite): void
    {
        this.spriteList.push(sprite);
    }

    /**
     /**
     * This removes a sprite to the list to be updated and drawn each frame
     * It only removes the first encountered instance of a sprite in the draw list
     * @param sprite An object that implements the Sprite interface
     * @method
     */
    public RemoveSprite (sprite: Sprite): void
    {
        let idx = this.spriteList.findIndex(a => a == sprite); //note == used because we DO want to compare references not values
        if (idx >= 0) { // found a match
            this.spriteList.splice(idx, 1);
        }
        
    }

    /**
     *
     * This method sets the background color/style to use with following fills.
     * Valid values are any valid Canvas fill style.
     * @param style The style to use to fill the background, default is blue
     * @method
     */
    public SetBkgdColor(style?: string): void {

        if (style == undefined) {
            style = "blue";    
        }
        this.ctx.fillStyle = style;
    }

    /**
     * This method draws a filled rectangle using the already set fill style
     * @param rect a Rect object that defiens the rectangle to fill (inclusive)
     * @method
     */
    public FillRect(rect: Rect): void {
        this.ctx.fillRect(rect.Position.X, rect.Position.Y, rect.Width, rect.Height);
    }


    /**
     * This method fills the canvas with a passed in background color, default is blue
     * @param bkgdColor  The color to fill the canvas with
     * @method
     */
    public Clear(bkgdColor?: string) {
        this.ctx.resetTransform();
        this.SetBkgdColor(bkgdColor);
        this.FillRect(new Rect(0, 0, this.PhysicalSize.X, this.PhysicalSize.Y));
    }


    /**
     * This method draws an image to the screen using the passed in Transformm, sub rectangle, and destination size
     * In genreal destination size should be left undefined and all scaling shoudl be done through the transform.
     * destSize just exists for very special corner cases.
     * @param image the source of pixel data
     * @param xform a transform to apply to the image's position, rotation, and size, defaults to the identity xform
     * @param subRect A portion of the image to draw, defaults to the entire image
     * @param destSize The size the image is to drawn in.  It dafaults to the size of the source sub rectangle
     * @method
     */
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

    /**
     * This method draws text using the current canvas context setitngs for font and fill
     * The passed in transform is used to position the text.  By defeault, the text is left justified at the
     * origin point.  If center is true, it is instead centered on the origin point
     * IMPORTANT: Due to apprent limitations in Canvas drawtest scalling and rotation are not supported
     * This routine should eventually be re-written to use sprite-based text graphics
     * @param text a string to render
     * @param xform the position transform, defaults to identity which makes text position 0,0
     * @param center if true then text is centered, if not or udnefined then text is left justified
     * @method
     */
    public DrawText(text:string, xform?:Matrix2D,center?:boolean){
        if (xform == undefined) {
            xform = this.worldXform; // dont use getter to avoid an unecessary copy
        } else {
            xform = xform.Dot(this.worldXform); // ditto
        }
        if (center == undefined){
            center=false;
        }
        this.ctx.resetTransform(); // becasue we apply the transform ourselves
        this.ctx.fillStyle = 'black';
        let pos:Vector2 = xform.DotVec(new Vector2(0,0)); // transform does not appear to move text, this is a hack
        if (center){
            this.ctx.textAlign = "center";
        } else {
            this.ctx.textAlign = "start";
        }
        this.ctx.fillText(text, pos.X, pos.Y);

    }

    /**
     * This method attempts to get the text size.  It currently returns the size in CSS pixels, whose mapping to
     * Canvas pixels is unclear at the moment.  Height also is estimated by the width of an M and seems reaosnably close.
     * @bug It is unclear how this value maps to drawspace right now
     * @param text the text to measure
     * @param xform the text transform, defaults to identity, not clear this is working
     * @method
     * @return a Vector2 where the X is text stirng width and Y is text string height
     */
    public GetTextSize(text:string,xform?:Matrix2D):Vector2{
        if (xform == undefined) {
            xform = this.worldXform; // dont use getter to avoid an unecessary copy
        } else {
            xform = xform.Dot(this.worldXform); // ditto
        }

        var text_measures = this.ctx.measureText(text);
        let pixelWidth:number = text_measures.width;

        // this is a dirty hack based on some typography pseudo standards
        let pixelHeight:number =this.ctx.measureText('M').width;
        let transformed:Vector2 = xform.Invert().DotVec(new Vector2(pixelWidth,pixelHeight));
        return transformed;
    }

    /**
     * This is an internal value used to track the milliseconds between updates
     */
    private lastTime:DOMHighResTimeStamp;

    /**
     * Calling this method updates all the sprites with the delta in ms since last update call.
     * It then requests that they draw themselves
     * All updates happen before renders.  The sprites are called in order of addition to the sprite list
     * @param bkgdColor
     * @method
     */
    public Redraw(bkgdColor?: string): void {
        var self = this;
        window.requestAnimationFrame((currentTime:DOMHighResTimeStamp)=>{
            if (self.lastTime == undefined) { // first call
                self.lastTime =currentTime;
                return;
            }

            let msDelta = currentTime - self.lastTime;
            self.lastTime = currentTime;
            self.Clear();
            for( let i = 0;i<self.spriteList.length;i++) {
                self.spriteList[i].Update(msDelta);
            }
            for( let i = 0;i<this.spriteList.length;i++)
            {
                self.spriteList[i].Render(this);
            }
        });

    }

   
}

/**
 * This was a little test of drawing an image with transforms used  in debugging
 * @constructor
 */
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



