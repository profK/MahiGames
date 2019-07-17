// This is the main game file for the slot machine game


import SimpleImageSprite from "./System/Sprites/SimpleImageSprite";
import Matrix2D from "./System/Matrix2D";
import Vector2 from "./System/Vector2";
import Graphics2D from "./System/Graphics2D";
import ScrollingImageSprite from "./System/Sprites/ScrollingImageSprite";
import Sprite from "./System/Sprite";
import SpinningSprite from "./System/Sprites/SpinningSprite";

// set up environemnt
let g2d = new Graphics2D();
g2d.SetDrawspaceSize(new Vector2(1080,1080));
let screenSize:Vector2 = g2d.Size;


// holders for the wheel and text sprites
let wheel:SpinningSprite;


//load assets in parallel
let loadCount:number=0;
let assetNum:number=0;

let drawList:Sprite[] = Array(6); // used to assemble in right draw order


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

function AssetLoaded():void{
    loadCount +=1;
    if (loadCount==assetNum) { // all assets loaded}
        drawList.forEach(s => g2d.AddSprite(s)); // gets tem in the right order
        StartGame();
    }
}

function ImageLoadFailed(img):void
{
    console.log("Failed to load image at "+img.src);
}



LoadImage("apps/assets/wheel.png",(img)=>{
    wheel = new SpinningSprite(img);
    drawList[0] = wheel;
    AssetLoaded();
},ImageLoadFailed);


/// game logic starts here

function StartGame():void{
   ;
    let wheeldiameter:number = .5 * Math.min(screenSize.X,screenSize.Y);
    // transform wheel to center it and to make 80% of smaller dimension
    wheel.Transform = new Matrix2D().Translate(new Vector2(-wheel.Width/2,-wheel.Height/2)); // center
    wheel.Transform = wheel.Transform.Scale(new Vector2(wheeldiameter/wheel.Width,wheeldiameter/wheel.Height)); //scale
    wheel.Transform = wheel.Transform.Translate(new Vector2(g2d.Size.X/2,g2d.Size.Y/2));

    // start game engine
    //initial screen draw
    g2d.Redraw();

    // start animation
    setInterval(()=> g2d.Redraw());
}





