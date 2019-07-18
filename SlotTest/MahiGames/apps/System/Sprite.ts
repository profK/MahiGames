import Graphics2D from "./Graphics2D";

/**
 * This defines the generic Sprite interface expected by the update and render code of Graphics2D
 * All sprites must implement this interface either directly or through duck-typing
 */
export default interface Sprite
{
    /**
     * Called by Graphics2D to draw the sprite every frame
     * @param g2d the Graphics2D requesting the draw
     * @method
     */
    Render(g2d:Graphics2D): void;
    /**
     * Called by Graphics2D to update the sprite every frame
     * @param msDelta the number of miliseconds since te last time it was called
     * @method
     */
    Update(msDelta: number):void;

    /**
     * A getter for the Width of the sprite
     * @property
     */
    Width: number;
    /**
     * A getter for the Height of the sprite
     * @property
     */
    Height: number;
}
