import TextSprite from "./TextSprite";
import Vector2 from "../Vector2";
import Graphics2D from "../Graphics2D";


export default class AutocenterTextSprite extends TextSprite {
    Render(g2d: Graphics2D): void {
        g2d.DrawText(this.Text,this.Transform,true);
    }
}