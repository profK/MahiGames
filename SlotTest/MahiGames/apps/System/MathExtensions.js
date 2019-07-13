"use strict";
// monkey patches additional math funcitonality
Object.defineProperty(exports, "__esModule", { value: true });
Number.prototype.round = function (places) {
    return +(Math.round(Number(this + "e+" + places + "e-" + places)));
};
//# sourceMappingURL=MathExtensions.js.map