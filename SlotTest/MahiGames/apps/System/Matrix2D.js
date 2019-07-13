"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector2_1 = require("./Vector2");
class Matrix2D {
    constructor(init) {
        if (init != undefined) {
            // this clones a 2D array
            this.values = init.map(row => {
                return row.map(element => {
                    return element;
                });
            });
        }
        else {
            this.values = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        }
    }
    IsIdentity() {
        for (let y = 0; y < this.values.length; y++) {
            for (let x = 0; x < this.values[y].length; x++) {
                if (x == y) {
                    if (this.values[y][x] != 1) {
                        return false;
                    }
                }
                else {
                    if (this.values[y][x] != 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    Translate(delta) {
        return this.Dot(new Matrix2D([
            [1, 0, delta.X],
            [0, 1, delta.Y],
            [0, 0, 1]
        ]));
    }
    Rotate(radians) {
        return this.Dot(new Matrix2D([
            [Math.cos(radians), -Math.sin(radians), 0],
            [Math.sin(radians), Math.cos(radians), 0],
            [0, 0, 1]
        ]));
    }
    Scale(mult) {
        return this.Dot(new Matrix2D([
            [mult.X, 0, 0],
            [0, mult.Y, 0],
            [0, 0, 1]
        ]));
    }
    Dot(other) {
        let result = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        result = result.map((row, i) => {
            return row.map((val, j) => {
                return other.values[i].reduce((sum, elm, k) => sum + (elm * this.values[k][j]), 0);
            });
        });
        return new Matrix2D(result);
    }
    DotVec(vec) {
        let v2 = new Vector2_1.default(1, 0);
        // remeber that matrix access is [row][position], which means [y][x], and idexes are zero based
        v2.X = this.values[0].reduce((sum, v, k) => sum + (v * vec.values[k]), 0);
        v2.Y = this.values[1].reduce((sum, v, k) => sum + (v * vec.values[k]), 0);
        v2.W = this.values[2].reduce((sum, v, k) => sum + (v * vec.values[k]), 0);
        return v2;
    }
}
exports.default = Matrix2D;
//# sourceMappingURL=Matrix2D.js.map