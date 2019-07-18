import TextSprite from "./TextSprite";
import Vector2 from "../Vector2";
import Graphics2D from "../Graphics2D";


/***
 * This is a simple extension of texSprite that draws the text with a centered origin
 * @class
 */
export default class AutocenterTextSprite extends TextSprite {
    /**
     * Renders text centered on origin
     * @param g2d the Graphics2d to use for rendering
     * @method
     */
    public Render(g2d: Graphics2D): void {
        g2d.DrawText(this.Text,this.Transform,true);
    }
}