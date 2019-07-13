"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Graphics2D {
    constructor(divname) {
        if (divname == undefined) {
            divname = "canvas";
        }
        const canvas = document.getElementById(divname);
        const ctx = canvas.getContext('2d');
        ctx.fillRect(0, 0, 40, 60);
    }
    AddSprite(sprite) {
    }
    RemoveSprite(sprite) {
    }
}
exports.default = Graphics2D;
// stand alone web page test
console.log("Making a G2D");
new Graphics2D();
//# sourceMappingURL=Graphics2D.js.map