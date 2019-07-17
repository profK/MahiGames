// This is the main game file for the slot machine game


import SimpleImageSprite from "./System/Sprites/SimpleImageSprite";
import Matrix2D from "./System/Matrix2D";
import Vector2 from "./System/Vector2";
import Graphics2D from "./System/Graphics2D";
import ScrollingImageSprite from "./System/Sprites/ScrollingImageSprite";
import Sprite from "./System/Sprite";

// set up environemnt
let g2d = new Graphics2D();
g2d.SetDrawspaceSize(new Vector2(1920,1080));
let screenSize:Vector2 = g2d.Size;


// holders for the 3 reel sprites
let reel1:ScrollingImageSprite;
let reel2:ScrollingImageSprite;
let reel3:ScrollingImageSprite;
let reel4:ScrollingImageSprite;


//load assets in parallel
let loadCount:number=0;
let assetNum:number=0;

let drawList:Sprite[] = Array(6); // used to assemble in right draw order

function AssetLoaded():void{
    loadCount +=1;
    if (loadCount==assetNum) { // all assets loaded}
        drawList.forEach(s => g2d.AddSprite(s)); // gets tem in the right order
        StartGame();
    }
}

function LoadImage(path:string, success?:(asset:any)=>void,failure?:(asset:any)=>void):void{
    assetNum +=1; // incr wait count
    let image = new Image();
    image.onerror = () => {
        if (failure!=undefined){
            failure(image);
        }
    };
    image.onload = () => {
        if (success!=undefined){
            success(image);
        }
    };
    image.src = path;
}

function ImageLoadFailed(img):void
{
   console.log("Failed to load image at "+img.src);
}


LoadImage("apps/assets/slot.png",(img)=>{
    let slot = new SimpleImageSprite(img);
    drawList[0] = slot;
    AssetLoaded();
},ImageLoadFailed);

LoadImage("apps/assets/reel_cropped.png",(img)=> {
    reel1 = new ScrollingImageSprite(img, 1, 5, true,
        new Vector2(0, 100));
    drawList[1] = reel1;
    reel1.Transform = new Matrix2D().Translate(new Vector2(464, 298));
    reel2 = new ScrollingImageSprite(img, 1, 5, true,
        new Vector2(0, 100));
    drawList[2] = reel2;
    reel2.Transform = new Matrix2D().Translate(new Vector2(614, 298));
    reel3 = new ScrollingImageSprite(img, 1, 5, true,
        new Vector2(0, 100));
    drawList[3] = reel3;
    reel3.Transform = new Matrix2D().Translate(new Vector2(764, 298));
    reel4 = new ScrollingImageSprite(img, 1, 5, true,
        new Vector2(0, 100));
    drawList[4] = reel4;
    reel4.Transform = new Matrix2D().Translate(new Vector2(914, 298));
    AssetLoaded();
},ImageLoadFailed);

LoadImage("apps/assets/spin_button.png",(img)=>{
    let spin = new SimpleImageSprite(img);
    spin.Transform = new Matrix2D().Translate(new Vector2(475,600));
    spin.OnClickCB = (localPos:Vector2) => {
        console.log("click!");
        Spin(
            Math.trunc((Math.random()*3)),
            Math.trunc((Math.random()*3)),
            Math.trunc((Math.random()*3)),
            Math.trunc((Math.random()*3))
        );
        return true;
    }
    drawList[5] = spin;
    AssetLoaded();
    }
)

function StartGame():void{
    //initial screen draw
    g2d.Redraw();

    // start animation
    setInterval(()=> g2d.Redraw());


}

let reelStopCount=4;
let audio;

function StopReel(){
    reelStopCount -= 1;
    if (reelStopCount==0){
        audio.pause();
    }
}

function Spin(r1:number,r2:number,r3:number,r4:number){
    //set reels spinning
    let vec:Vector2  = new Vector2(0,30);
    reelStopCount=4;
    setTimeout(()=>  {
        reel1.PixPerSec = vec;
        setTimeout(()=> {
            reel1.StopAtYCell(r1);
            StopReel();
        }, (Math.random()*1000) + 3000
        );

    },10);
    setTimeout(()=>  {
        reel2.PixPerSec = vec;
        setTimeout(()=> {
            reel2.StopAtYCell(r2);
            StopReel();
        }, (Math.random()*1000) + 3000
        )
    },30);
    setTimeout(()=>  {
        reel3.PixPerSec = vec;
        setTimeout(()=> {
            reel3.StopAtYCell(r3);
            StopReel();
            }, (Math.random()*1000) + 3000
        )
    },50);
    setTimeout(()=>  {
        reel4.PixPerSec = vec;
        setTimeout(()=> {
            reel4.StopAtYCell(r4);
            StopReel();
            }, (Math.random()*1000) + 3000
        )
    },80);
    // tepoaray audio code

    audio = new Audio("apps/assets/ratchet.mp3");
    audio.play();



}

