import Rect from "./Rect";
export default class Graphics2D {
    constructor(divname) {
        if (divname == undefined) {
            divname = "canvas";
        }
        this.canvas = document.getElementById(divname);
        this.ctx = this.canvas.getContext('2d');
        // paint the background black 
        this.Redraw(); // initisl frame
    }
    AddSprite(sprite) {
    }
    RemoveSprite(sprite) {
    }
    SetBkgdColor(style) {
        if (style == undefined) {
            style = "blue";
        }
        this.ctx.fillstyle = style;
    }
    FillRect(rect) {
        this.ctx.fillRect(rect.Position.X, rect.Position.Y, rect.Width, rect.Height);
    }
    Clear(bkgdColor) {
        let clientHeight = this.canvas.clientHeight;
        let clientWidth = this.canvas.clientWidth;
        this.SetBkgdColor(bkgdColor);
        this.FillRect(new Rect(0, 0, clientWidth, clientHeight));
    }
    Redraw(bkgdColor) {
        this.Clear();
    }
}
// stand alone web page test
console.log("Making a G2D");
new Graphics2D();
//# sourceMappingURL=Graphics2D.js.map