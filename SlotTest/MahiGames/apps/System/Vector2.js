"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vector2 {
    constructor(x, y, w) {
        this.values = new Array(3);
        if (w == undefined) {
            w = 1;
        }
        this.X = x;
        this.Y = y;
        this.W = w;
    }
    get X() { return this.values[0]; }
    set X(v) { this.values[0] = v; }
    get Y() { return this.values[1]; }
    set Y(v) { this.values[1] = v; }
    get W() { return this.values[2]; }
    set W(v) { this.values[2] = v; }
    equals(v2, numplaces) {
        if (numplaces == undefined) {
            numplaces = 6; //round after 6 palces after the decimal
        }
        for (let i = 0; i < 3; i++) {
            if (+this.values[i].toFixed(numplaces) != +v2.values[i].toFixed(numplaces)) {
                return false;
            }
        }
        return true;
    }
}
exports.default = Vector2;
//# sourceMappingURL=Vector2.js.map