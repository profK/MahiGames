// This is the main game file for the slot machine game


import SimpleImageSprite from "./System/Sprites/SimpleImageSprite";
import Matrix2D from "./System/Matrix2D";
import Vector2 from "./System/Vector2";
import Graphics2D from "./System/Graphics2D";
import ScrollingImageSprite from "./System/Sprites/ScrollingImageSprite";
import Sprite from "./System/Sprite";
import SpinningSprite from "./System/Sprites/SpinningSprite";
import AcceleratingSpinningSprite from "./System/Sprites/AcceleratingSpinningSprite";
import ExponentialMapper from "./System/Sprites/ExponentialMapper";
import ArcsinMapper from "./System/Sprites/ArcsinMapper";
import TextSprite from "./System/Sprites/TextSprite";
import AutocenterTextSprite from "./System/Sprites/AutocenterTextSprite";

// set up environemnt
let g2d = new Graphics2D();
g2d.SetDrawspaceSize(new Vector2(1080,1080));
let screenSize:Vector2 = g2d.Size;



// holders for the wheel and text sprites
let wheel:AcceleratingSpinningSprite;
let spin:SimpleImageSprite;
let arrow:SimpleImageSprite;
let textDisplay:TextSprite;


//load assets in parallel
let loadCount:number=0;
let assetNum:number=0;

let drawList:Sprite[] = Array(6); // used to assemble in right draw order

let fishpuns:string[] = [
    "Aspirin is good for a haddock!",
    "You seem to be floundering",
    "Spin again just for the halibut",
    "I never could carry a tuna!",
    "Don't be koi, spin again",
    "I'm herring you!",
    "AMBERJACKPOT!",
    "Well, Carp!"
]


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
    if (loadCount==assetNum) { // all assets loaded
        drawList.forEach(s => g2d.AddSprite(s)); // gets tem in the right order
        //g2d.AddSprite(textDisplay); debug used to test individual elements in isolation
        StartGame();
    }
}

function ImageLoadFailed(img):void
{
    console.log("Failed to load image at "+img.src);
}

// load all the sprites
textDisplay = new AutocenterTextSprite(g2d,"Wheel of Fish!");
drawList[3] = textDisplay;

LoadImage("apps/assets/colored_wheel.png",(img)=>{
    wheel = new AcceleratingSpinningSprite(img);
    drawList[0] = wheel;
    AssetLoaded();
},ImageLoadFailed);

LoadImage("apps/assets/Arrow.png",(img)=>{
    arrow = new SimpleImageSprite(img);
    drawList[1] = arrow;
    AssetLoaded();
},ImageLoadFailed);

LoadImage("apps/assets/spin_button.png",(img)=>{
        spin = new SimpleImageSprite(img);
        spin.Transform = new Matrix2D().Translate(new Vector2(475,600));
        spin.OnClickCB = (localPos:Vector2) => {
            Spin();
            return true;
        }
        drawList[2] = spin;
        AssetLoaded();
    }
)


/// game logic starts here

function StartGame():void{

    let wheeldiameter:number = .5 * Math.min(screenSize.X,screenSize.Y);
    // transform wheel to center it and to make 80% of smaller dimension
    wheel.Transform = new Matrix2D().Translate(new Vector2(-wheel.Width/2,-wheel.Height/2)); // center
    wheel.Transform = wheel.Transform.Scale(new Vector2(wheeldiameter/wheel.Width,wheeldiameter/wheel.Width)); //scale
    wheel.Transform = wheel.Transform.Translate(new Vector2(g2d.Size.X/2,g2d.Size.Y/2));
    //move spin button to middle top
    spin.Transform = new Matrix2D().Translate(new Vector2(-spin.Width/2,-spin.Height/2)); // center
    spin.Transform =spin.Transform.Translate(new Vector2(g2d.Size.X/2,10+spin.Height/2));
    //place arrow
    arrow.Transform = new Matrix2D().Translate(new Vector2(-arrow.Width,-arrow.Height/2)); // set handle to tip of point
    arrow.Transform = arrow.Transform.Translate(new Vector2((g2d.Size.X-spin.Width)/2,g2d.Size.Y/2));
    // set text
    textDisplay.Transform = new Matrix2D().Translate(new Vector2(
          g2d.Size.X/2,g2d.Size.Y-(2*textDisplay.Height))); // center

    // test rotation
    //wheel.Speed= Math.PI/4;WheelOfFish.



    // start game engine
    //initial screen draw
    g2d.Redraw();

    // start animation
    setInterval(()=> g2d.Redraw());

    //this was for test in development, not needed now that we have a button
    //Spin();
}

function Spin(){

    wheel.AcclToRadsPerSec(Math.PI*2,3000,new ArcsinMapper());
    setTimeout(()=>{
        console.log("slowing down");
        //note this currently always decels to 0.
        wheel.AcclToRadsPerSec(0,3000,new ArcsinMapper());
        setTimeout(DoFish,3000);
    },10000)
}


function DoFish(){
    let angle = wheel.Transform.GetRotation()- (Math.PI/32); //a  fudge for imperfect art
    let index = Math.trunc(angle/(Math.PI*2/8));
    index = (index + 2)%8 ; // rotates the sleection 3 c clockwise for more convenient arrow placement
    textDisplay.Text= fishpuns[7- index];
}


