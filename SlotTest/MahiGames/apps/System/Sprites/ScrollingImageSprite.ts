import SimpleImageSprite from "./SimpleImageSprite";
import Vector2 from "../Vector2";
import Rect from "../Rect";
import Graphics2D from "../Graphics2D";

/**
 * This class implements a sprite that displays a scrolling window from the total image
 * It is used to simulate slot reels in SlotMachine
 * @class
 *
 * @TODO: currently only supports Y scrolling, X shoudl be implemnted eventually
 */

export default class ScrollingImageSprite extends SimpleImageSprite {
    /**
     * The currently dislayed window on the image data
     */
    private cellRect:Rect;
    /**
     * If true then the scrolling loops.  This functionality assumes that the start and end of the loop are
     * the same in order to create a smoothly repeating scrolling view.
     */
    private loop:boolean=false;
    /**
     * Speed to scroll the window at.  currentyl only  Y is used.
     */
    private pixPerSec:Vector2 = new Vector2(0,0);
    /**
     * A multiple of the cell size to stop at.  The loo pends when y = stopAt*cellRect.Height
     */
    private stopAt:number = -1; // -1 means don't stop

    /**
     * Sets the scroll rate.  If non-zero then scrolling starts immediately
     * @TODO:  Currently only Y is supported, X should be added in the future
     * @param vec A Vector2 representing the pixels per second in X and y to scroll
     * @property
     */
    set PixPerSec(vec:Vector2){
        this.pixPerSec = vec;
        this.stopAt = -1;
    }

    /**
     * A constructor that makes a ScrollingImageSprite
     * @param source the CanvasImageSource to use for bitmap data
     * @param widthInCells the number of cells wide the image is, source width in pixels should divide evenly by this number
     * @param heightInCells the number of cells high the image is, source height in pixels should divide evenly by this number
     * @param loop if true then this is a looping scroll, undefined means false
     * @param pixPerSec the nubmer of pixels the image should move at as a vector2. currently only Y is supported, default is 0
     * @see PixPerSec
     */
    constructor(source: CanvasImageSource,widthInCells:number,heightInCells:number,loop?:boolean,
                pixPerSec?:Vector2){
        super(source);
        if (loop!= undefined){
            this.loop=loop;
        }
        if (pixPerSec!=undefined){
            this.pixPerSec = pixPerSec;
        }
        this.cellRect = new Rect(0,0,super.Width/widthInCells,super.Height/heightInCells)
        this.pixPerSec = new Vector2(0,0);
    }


    /**
     * This calculates the position of the new sub-rect based on PixPerSec and msDelta
     * @param msDelta elapsed milliseconds snce last call
     * @method
     */
    public Update(msDelta: number):void {
        let moveVec:Vector2=this.pixPerSec.TimesScalar(msDelta/1000);
        let movePos:Vector2 = this.cellRect.Position.Add(moveVec);
        if (this.loop){ // go to top when bottom in full vuew, assumes matchign top and bttom
            if ((movePos.X) >= (super.Width - this.cellRect.Width)){
                movePos.X = 0;
            }
            if ((movePos.Y) >= (super.Height - this.cellRect.Height)){
                movePos.Y = 0;

            }
        } else { // stop if at last cell
            if ((movePos.X) >= (super.Width - this.cellRect.Width)){
                this.pixPerSec.X = 0;
                movePos.X = this.Width - this.cellRect.Width
            }
            if ((movePos.Y) >= (super.Height - this.cellRect.Height)){
                this.pixPerSec.Y = 0;
                movePos.Y = super.Height - this.cellRect.Height
            }
        }
        //check for stop, IMPORTANT: currently only does y, might need to be added to in the future
        if (this.stopAt>-1){
            let stopCellY:number = this.stopAt * this.cellRect.Height;
            if ((stopCellY<=movePos.Y)&&(movePos.Y< (stopCellY+this.cellRect.Height))){
                // stop on this cell
                movePos.Y = this.cellRect.Height * this.stopAt;
                this.PixPerSec = new Vector2(0,0);
                this.stopAt=-1;

            }
        }
        this.cellRect.Position = movePos;
    }

    /**
     * This sets the stopAt number, a loopign scroll cell to stop at.  The loop ends when y = stopAt*cellRect.Height
     * @param cellNum the ordinal Y number of the cell to stop scrolling at
     * @method
     * @TODO: Only supports Y, should look at X as well in the future
     */
    public StopAtYCell(cellNum:number){
        this.stopAt = Math.trunc(cellNum);
    }

    /**
     * Called by the Gaphics2D to render the image
     * @param g2d the G2D to use to render
     * @method
     */
    public Render(g2d: Graphics2D): void {

        g2d.DrawImage(this.source,this.Transform,this.cellRect);
    }
}