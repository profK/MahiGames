import assert from "assert";
import Matrix2D from "../Matrix2D";
import Vector2 from "../Vector2";
//Matrix2D tests
export function Matrix2DIdentityTest() {
    let m2d = new Matrix2D();
    assert.equal(m2d.IsIdentity(), true, "Identity matrixx created and tested");
}
;
export function VecDotUnitTest() {
    let m2d = new Matrix2D();
    let v = new Vector2(1, 0);
    assert.equal(m2d.DotVec(v).equals(v), true, "Testing dot vec with identity");
    // lets try a matrix rotation
    let rotm2 = m2d.Rotate(Math.PI / 2);
    let v2 = rotm2.DotVec(v);
    let vtest = new Vector2(0, 1);
    assert.equal(v2.equals(vtest), true, "testing 90 degree rotation");
    let transm = new Matrix2D().Translate(new Vector2(2, 2));
    vtest = transm.DotVec(vtest);
    assert.equal(vtest.equals(new Vector2(2, 3)), true, "Translate test");
    transm = new Matrix2D().Scale(new Vector2(0.5, 1));
    vtest = transm.DotVec(new Vector2(2, 2));
    assert.equal(vtest.equals(new Vector2(1, 2)), true, "testing with scale as well");
    transm = transm.Translate(new Vector2(3, -2));
    vtest = transm.DotVec(new Vector2(2, 2));
    assert.equal(vtest.equals(new Vector2(4, 0)), true, "testing with scale as well");
}
//# sourceMappingURL=UnitTest1.js.map