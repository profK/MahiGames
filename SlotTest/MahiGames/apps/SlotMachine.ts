/**
 * This is the main script for the slot machien game.
 * It uses the Graphics2D system in the System folder for all its drawing.
 *
 * It automatically adjusts for window size.
 *
 * At the moment it uses a hacked async loading mechanism that has a very unlikely but possible race condition if all
 * previous loads end before all loads are started.  This coudl be fixed with a proper async loading queue.  This
 * was a compromsie for time.
 *
 * The slot machine also only uses about half the available screen width.  This comes from an early art error that
 * would be fixable but relative positionings might have to be changed so I decided to live with it as a first cut
 * rather then ship late.
 *
 * @TODO:  A button debounce  on spin would be a good idea before ship
 *
 *
 */

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


// holders for the 4 reel images
let reel1:ScrollingImageSprite;
let reel2:ScrollingImageSprite;
let reel3:ScrollingImageSprite;
let reel4:ScrollingImageSprite;


//used to know when parallel loaded assetsare all in
let loadCount:number=0;
let assetNum:number=0;

/**
 * This is used to assign the assets to a draw order.  the Graphics2D engine assumes that
 * draw order is the order in which they are added to its list.
 * This holds them in the right order until they are all loaded and cna be transferred
 * to Graphics2D
 */
let drawList:Sprite[] = Array(6); // used to assemble in right draw order

/**
 * This callback method monitors loading and starst the game when all assets have bene loaded
 * @method
 */
function AssetLoaded():void{
    loadCount +=1;
    if (loadCount==assetNum) { // all assets loaded}
        drawList.forEach(s => g2d.AddSprite(s)); // gets tem in the right order
        StartGame();
    }
}

/**
 * This is the function used to load all images
 * @param path where to liad the image from
 * @param success a callback for when the inage is loaded
 * @param failure a callback if the load fails
 * @method
 */
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

/**
 * A failure nethod to let us knwo if an image didnt load, for debugging
 * @param img
 * @constructor
 */
function ImageLoadFailed(img):void
{
   console.log("Failed to load image at "+img.src);
}


// start loading the game images here

LoadImage("apps/assets/slot.png",(img)=>{
    let slot = new SimpleImageSprite(img);
    drawList[0] = slot;
    AssetLoaded();
},ImageLoadFailed);

// Note that we are going to use the same  image data for 4 independant reel sprites to save time
// and memory
LoadImage("apps/assets/reel_cropped.png",(img)=> {
    reel1 = new ScrollingImageSprite(img, 1, 5, true,
        new Vector2(0, 100));
    drawList[1] = reel1;
    reel1.Transform = new Matrix2D().Translate(new Vector2(475, 302));
    reel2 = new ScrollingImageSprite(img, 1, 5, true,
        new Vector2(0, 100));
    drawList[2] = reel2;
    reel2.Transform = new Matrix2D().Translate(new Vector2(625, 302));
    reel3 = new ScrollingImageSprite(img, 1, 5, true,
        new Vector2(0, 100));
    drawList[3] = reel3;
    reel3.Transform = new Matrix2D().Translate(new Vector2(775, 302));
    reel4 = new ScrollingImageSprite(img, 1, 5, true,
        new Vector2(0, 100));
    drawList[4] = reel4;
    reel4.Transform = new Matrix2D().Translate(new Vector2(925, 302));
    AssetLoaded();
},ImageLoadFailed);

// This loads the spin button and sets up a callback on click
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

/**
 * This is the function called when all images are loaded
 * it does an initial screen rdraw and starts the game loop
 * @methodthod
 */
function StartGame():void{
    //initial screen draw
    g2d.Redraw();

    // start animation
    setInterval(()=> g2d.Redraw());


}

// This next section has to do with the spinning state.  It starts the reels spinning
// and plays a ratchet noise

/**
 * This is used to count down the asynchronously stopped reels so we know when we are done
 */
let reelStopCount=4;
/** This is a quick and dirty holder for an audio loop.  In the future it aught to be abstracted
 * into a proper audio manager
 */
let audio;

/**
 * This function is called by each reel when it stops to keep track of when the have all stopped and
 * end the audio.
 *
 * In the future it would also proceed to the win/lose state.  We know whether its a win or loss actually when we
 * start since the stop points are set in the Spin method, but we would wait til now to tell the player ;)
 * @method
 */
function StopReel(){
    reelStopCount -= 1;
    if (reelStopCount==0){
        audio.pause();
        // TODO: go to win/loss
    }
}

/***
 * This is the logic of the game that spins the reels.  It uses features built into the ScrollingImageSprite
 * to roll the reel and tell it where to stop visually.  It starst them at different times and sets them up to stop
 * at random different times to proivde some visual interest
 * @param r1 where the first reel will stop
 * @param r2 where the second reel will stop
 * @param r3 where the third reel will stop
 * @param r4 where the fourth reel will stop
 * @method
 */
function Spin(r1:number,r2:number,r3:number,r4:number){
    //set reels spinning
    let vec:Vector2  = new Vector2(0,1800);
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

