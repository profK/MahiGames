import SimpleImageSprite from "./SimpleImageSprite";
import Vector2 from "../Vector2";
import Rect from "../Rect";
import Graphics2D from "../Graphics2D";

export default class ScrollingImageSprite extends SimpleImageSprite {
    private cellRect:Rect;

    private loop:boolean=false;
    private pixPerSec:Vector2 = new Vector2(0,0);
    private stopAt:number = -1; // -1 means don't stop
    set PixPerSec(vec:Vector2){
        this.pixPerSec = vec;
        this.stopAt = -1;
    }

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

    Update(msDelta: number):void {
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

    public StopAtYCell(cellNum:number){
        this.stopAt = Math.trunc(cellNum);
    }

    Render(g2d: Graphics2D): void {

        g2d.DrawImage(this.source,this.Transform,this.cellRect);
    }
}