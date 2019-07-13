import Sprite from "./Sprite";

export default class Graphics2D
{

    constructor(divname?: string) {
        if (divname == undefined) {
            divname = "canvas";
        }
        const canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(divname);
        const ctx = canvas.getContext('2d');
        // paint the background black 
        var clientHeight = canvas.clientHeight;
        var clientWidth = canvas.clientWidth;
        ctx.fillRect(0, 0, clientWidth, clientHeight);
    }
    
    public AddSprite (sprite: Sprite): void
    {
        
    }        
    
    public RemoveSprite (sprite: Sprite): void
    {
        
    }    

   
}

 // stand alone web page test
console.log("Making a G2D");
new Graphics2D();

