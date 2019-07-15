// This is the main game file for the slot machine game


import SimpleImageSprite from "./System/Sprites/SimpleImageSprite";
import Matrix2D from "./System/Matrix2D";
import Vector2 from "./System/Vector2";
import Graphics2D from "./System/Graphics2D";
import ScrollingImageSprite from "./System/Sprites/ScrollingImageSprite";

let g2d = new Graphics2D();
g2d.SetDrawspaceSize(new Vector2(1920,1080));
let screenSize:Vector2 = g2d.Size;
// add slot machine to screen
let slot_image = new Image();
slot_image.onerror = () => {
    console.log("Failed loading slot body");
}
slot_image.onload = () => {
    let sprite: SimpleImageSprite = new SimpleImageSprite(slot_image);
    //sprite.Transform= sprite.Transform.Translate(
    //    new Vector2((g2d.Size.X-sprite.Width) / 2, (g2d.Size.Y-sprite.Height / 2)));
    g2d.AddSprite(sprite);
    let reel_image = new Image();
    reel_image.onerror = () => {
        console.log("Failed loading reel");
    }
    reel_image.onload = () => {
        let reel:ScrollingImageSprite = new ScrollingImageSprite(reel_image,1,5);
        g2d.AddSprite(reel);
        reel.Transform = new Matrix2D().Translate(new Vector2(472, 298));
        g2d.Redraw();
    }
    reel_image.src="apps/assets/reel_cropped.png";

};
slot_image.src="apps/assets/slot.png"  // starts the load
