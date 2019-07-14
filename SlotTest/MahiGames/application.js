/**
 * license: MIT
 * author: markus.johnsson@infviz.com
 */
var System;
/**
 * license: MIT
 * author: markus.johnsson@infviz.com
 */
(function (System) {
    const modules = {};
    const registers = {};
    function register(name, deps, factory) {
        registers[name] = {
            deps: deps,
            factory: factory
        };
    }
    System.register = register;
    function registerExternal(name, mod) {
        modules[name] = mod;
    }
    System.registerExternal = registerExternal;
    function require(name) {
        if (name in modules)
            return modules[name];
        return create(name);
    }
    System.require = require;
    function _import(name) {
        var result = require(name);
        return Promise.resolve(result);
    }
    window.require = require;
    function create(name) {
        if (!(name in registers))
            throw new Error("Cannot resolve '" + name + "'");
        const register = registers[name];
        const result = {};
        modules[name] = result;
        function exportImpl(n, impl) {
            result[n] = impl;
        }
        const innerFactory = register.factory(exportImpl, { id: name, import: _import });
        for (var index = 0; index < register.deps.length; index++) {
            const dependency = register.deps[index];
            innerFactory.setters[index](require(dependency));
        }
        innerFactory.execute();
        return result;
    }
})(System || (System = {}));
System.register("apps/System/AudioClip", [], function (exports_1, context_1) {
    "use strict";
    var AudioClip;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            AudioClip = class AudioClip {
            };
            exports_1("default", AudioClip);
        }
    };
});
System.register("apps/System/Sprite", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("apps/System/Vector2", [], function (exports_3, context_3) {
    "use strict";
    var Vector2;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
            Vector2 = class Vector2 {
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
            };
            exports_3("default", Vector2);
        }
    };
});
System.register("apps/System/Rect", ["apps/System/Vector2"], function (exports_4, context_4) {
    "use strict";
    var Vector2_1, Rect;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (Vector2_1_1) {
                Vector2_1 = Vector2_1_1;
            }
        ],
        execute: function () {
            Rect = class Rect {
                constructor(x, y, width, height) {
                    this.Position = new Vector2_1.default(x, y);
                    this.Width = width;
                    this.Height = height;
                }
            };
            exports_4("default", Rect);
        }
    };
});
System.register("apps/System/Matrix2D", ["apps/System/Vector2"], function (exports_5, context_5) {
    "use strict";
    var Vector2_2, Matrix2D;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (Vector2_2_1) {
                Vector2_2 = Vector2_2_1;
            }
        ],
        execute: function () {
            Matrix2D = class Matrix2D {
                Clone() {
                    return new Matrix2D(this.values);
                }
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
                    let v2 = new Vector2_2.default(1, 0);
                    // remeber that matrix access is [row][position], which means [y][x], and idexes are zero based
                    v2.X = this.values[0].reduce((sum, v, k) => sum + (v * vec.values[k]), 0);
                    v2.Y = this.values[1].reduce((sum, v, k) => sum + (v * vec.values[k]), 0);
                    v2.W = this.values[2].reduce((sum, v, k) => sum + (v * vec.values[k]), 0);
                    return v2;
                }
                SetContextTransform(ctx) {
                    let v = this.values; //convenience
                    ctx.setTransform(v[0][0], v[1][0], v[0][1], v[1][1], v[0][2], v[1][2]);
                }
            };
            exports_5("default", Matrix2D);
        }
    };
});
System.register("apps/System/Sprites/SimpleImageSprite", ["apps/System/Rect"], function (exports_6, context_6) {
    "use strict";
    var Rect_1, SimpleImageSprite;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (Rect_1_1) {
                Rect_1 = Rect_1_1;
            }
        ],
        execute: function () {
            SimpleImageSprite = class SimpleImageSprite {
                constructor(source) {
                    this.source = source;
                }
                Render(g2d) {
                    g2d.DrawImage(this.source, new Rect_1.default(0, 0, this.source.width, this.source.height));
                }
                Update(msDelta) {
                    //nop nothing time based
                }
            };
            exports_6("default", SimpleImageSprite);
        }
    };
});
System.register("apps/System/Graphics2D", ["apps/System/Rect", "apps/System/Matrix2D", "apps/System/Sprites/SimpleImageSprite"], function (exports_7, context_7) {
    "use strict";
    var Rect_2, Matrix2D_1, SimpleImageSprite_1, Graphics2D, g2d, image;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (Rect_2_1) {
                Rect_2 = Rect_2_1;
            },
            function (Matrix2D_1_1) {
                Matrix2D_1 = Matrix2D_1_1;
            },
            function (SimpleImageSprite_1_1) {
                SimpleImageSprite_1 = SimpleImageSprite_1_1;
            }
        ],
        execute: function () {
            Graphics2D = class Graphics2D {
                constructor(divname) {
                    this.spriteList = new Array();
                    this.worldXform = new Matrix2D_1.default(); // default is idnetity matrix
                    if (divname == undefined) {
                        divname = "canvas";
                    }
                    this.canvas = document.getElementById(divname);
                    this.ctx = this.canvas.getContext('2d');
                    // paint the background black 
                    this.Redraw(); // initisl frame
                }
                set WorldXform(xform) {
                    this.worldXform = xform;
                }
                ///  this is a safe access that returns a copy.
                get WorldXform() {
                    return this.worldXform.Clone();
                }
                AddSprite(sprite) {
                    this.spriteList.push(sprite);
                }
                RemoveSprite(sprite) {
                    let idx = this.spriteList.findIndex(a => a == sprite); //note == used because we DO want to compare references not values
                    if (idx >= 0) { // found a match
                        this.spriteList.splice(idx, 1);
                    }
                }
                SetBkgdColor(style) {
                    if (style == undefined) {
                        style = "blue";
                    }
                    this.ctx.fillStyle = style;
                }
                FillRect(rect) {
                    this.ctx.fillRect(rect.Position.X, rect.Position.Y, rect.Width, rect.Height);
                }
                Clear(bkgdColor) {
                    let clientHeight = this.canvas.clientHeight;
                    let clientWidth = this.canvas.clientWidth;
                    this.SetBkgdColor(bkgdColor);
                    this.FillRect(new Rect_2.default(0, 0, clientWidth, clientHeight));
                }
                DrawImage(image, subRect, xform) {
                    if (xform == undefined) {
                        xform = this.worldXform; // dont use getter to avoid an unecessary copy
                    }
                    else {
                        xform = xform.Dot(this.worldXform); // ditto
                    }
                    xform.SetContextTransform(this.ctx);
                    this.ctx.drawImage(image, subRect.Position.X, subRect.Position.Y, subRect.Width, subRect.Height);
                }
                Redraw(bkgdColor) {
                    if (this.lastTime == undefined) { // first call
                        this.lastTime = new Date();
                        return;
                    }
                    let currentTime = new Date();
                    let msDelta = currentTime.getMilliseconds();
                    this.Clear();
                    this.spriteList.forEach(a => a.Update(msDelta));
                    this.spriteList.forEach(a => a.Render(this));
                }
            };
            exports_7("default", Graphics2D);
            // stand alone web page test
            console.log("Making a G2D");
            g2d = new Graphics2D();
            image = new Image();
            image.onerror = () => {
                console.log("Failed loading teapot");
            };
            image.onload = () => {
                let sprite = new SimpleImageSprite_1.default(image);
                g2d.AddSprite(sprite);
                g2d.Redraw();
            };
            image.src = "utah_teapot.png";
        }
    };
});
System.register("apps/System/Image", [], function (exports_8, context_8) {
    "use strict";
    var Image;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [],
        execute: function () {
            Image = class Image {
                get Dimensions() {
                    return this.dimensions;
                }
                get Source() {
                    return this.source;
                }
            };
            exports_8("default", Image);
        }
    };
});
System.register("apps/System/Mixer", [], function (exports_9, context_9) {
    "use strict";
    var Mixer;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [],
        execute: function () {
            Mixer = class Mixer {
                AddClip(clip) {
                }
                RemoveClip(clip) {
                }
            };
            exports_9("default", Mixer);
        }
    };
});
System.register("apps/System/tests/UnitTest1", ["assert", "apps/System/Matrix2D", "apps/System/Vector2"], function (exports_10, context_10) {
    "use strict";
    var assert_1, Matrix2D_2, Vector2_3;
    var __moduleName = context_10 && context_10.id;
    //Matrix2D tests
    function Matrix2DIdentityTest() {
        let m2d = new Matrix2D_2.default();
        assert_1.default.equal(m2d.IsIdentity(), true, "Identity matrixx created and tested");
    }
    exports_10("Matrix2DIdentityTest", Matrix2DIdentityTest);
    function VecDotUnitTest() {
        let m2d = new Matrix2D_2.default();
        let v = new Vector2_3.default(1, 0);
        assert_1.default.equal(m2d.DotVec(v).equals(v), true, "Testing dot vec with identity");
        // lets try a matrix rotation
        let rotm2 = m2d.Rotate(Math.PI / 2);
        let v2 = rotm2.DotVec(v);
        let vtest = new Vector2_3.default(0, 1);
        assert_1.default.equal(v2.equals(vtest), true, "testing 90 degree rotation");
        let transm = new Matrix2D_2.default().Translate(new Vector2_3.default(2, 2));
        vtest = transm.DotVec(vtest);
        assert_1.default.equal(vtest.equals(new Vector2_3.default(2, 3)), true, "Translate test");
        transm = new Matrix2D_2.default().Scale(new Vector2_3.default(0.5, 1));
        vtest = transm.DotVec(new Vector2_3.default(2, 2));
        assert_1.default.equal(vtest.equals(new Vector2_3.default(1, 2)), true, "testing with scale as well");
        transm = transm.Translate(new Vector2_3.default(3, -2));
        vtest = transm.DotVec(new Vector2_3.default(2, 2));
        assert_1.default.equal(vtest.equals(new Vector2_3.default(4, 0)), true, "testing with scale as well");
    }
    exports_10("VecDotUnitTest", VecDotUnitTest);
    return {
        setters: [
            function (assert_1_1) {
                assert_1 = assert_1_1;
            },
            function (Matrix2D_2_1) {
                Matrix2D_2 = Matrix2D_2_1;
            },
            function (Vector2_3_1) {
                Vector2_3 = Vector2_3_1;
            }
        ],
        execute: function () {
            ;
        }
    };
});
//# sourceMappingURL=application.js.map