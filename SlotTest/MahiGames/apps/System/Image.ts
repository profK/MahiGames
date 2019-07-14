import Rect from "./Rect";

export default class Image
{
    private name: string;    
    private source: CanvasImageSource; 
    private dimensions: Rect;

    get Dimensions():Rect {
        return this.dimensions;
    }

    get Source(): CanvasImageSource {
        return this.source;
    }
}
