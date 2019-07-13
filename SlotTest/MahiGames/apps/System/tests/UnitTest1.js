"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const Matrix2D_1 = require("../Matrix2D");
const Vector2_1 = require("../Vector2");
//Matrix2D tests
function Matrix2DIdentityTest() {
    let m2d = new Matrix2D_1.default();
    assert.equal(m2d.IsIdentity(), true, "Identity matrixx created and tested");
}
exports.Matrix2DIdentityTest = Matrix2DIdentityTest;
;
function VecDotUnitTest() {
    let m2d = new Matrix2D_1.default();
    let v = new Vector2_1.default(1, 0);
    assert.equal(m2d.DotVec(v).equals(v), true, "Testing dot vec with identity");
    // lets try a matrix rotation
    let rotm2 = m2d.Rotate(Math.PI / 2);
    let v2 = rotm2.DotVec(v);
    let vtest = new Vector2_1.default(0, 1);
    assert.equal(v2.equals(vtest), true, "testing 90 degree rotation");
    let transm = new Matrix2D_1.default().Translate(new Vector2_1.default(2, 2));
    vtest = transm.DotVec(vtest);
    assert.equal(vtest.equals(new Vector2_1.default(2, 3)), true, "Translate test");
    transm = new Matrix2D_1.default().Scale(new Vector2_1.default(0.5, 1));
    vtest = transm.DotVec(new Vector2_1.default(2, 2));
    assert.equal(vtest.equals(new Vector2_1.default(1, 2)), true, "testing with scale as well");
    transm = transm.Translate(new Vector2_1.default(3, -2));
    vtest = transm.DotVec(new Vector2_1.default(2, 2));
    assert.equal(vtest.equals(new Vector2_1.default(4, 0)), true, "testing with scale as well");
}
exports.VecDotUnitTest = VecDotUnitTest;
//# sourceMappingURL=UnitTest1.js.map