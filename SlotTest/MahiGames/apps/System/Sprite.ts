import Graphics2D from "./Graphics2D";

export default interface Sprite
{
    Render(g2d:Graphics2D): void;
    Update(msDelta: number):void;
    Width: number;
    Height: number;
}
