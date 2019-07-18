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
System.register("apps/System/Vector2", [], function (exports_1, context_1) {
    "use strict";
    var Vector2;
    var __moduleName = context_1 && context_1.id;
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
                TimesScalar(mult) {
                    return new Vector2(this.X * mult, this.Y * mult);
                }
                Add(other) {
                    return new Vector2(this.X + other.X, this.Y + other.Y);
                }
                Sub(other) {
                    return new Vector2(this.X - other.X, this.Y - other.Y);
                }
                Minus(other) {
                    return new Vector2(this.X - other.X, this.Y - other.Y);
                }
                DivScalar(scalar) {
                    return new Vector2(this.X / scalar, this.Y / scalar);
                }
                Magnitude() {
                    return Math.sqrt((this.X * this.X) + (this.Y * this.Y));
                }
                Normalized() {
                    return this.DivScalar(this.Magnitude());
                }
            };
            exports_1("default", Vector2);
        }
    };
});
System.register("apps/System/Rect", ["apps/System/Vector2"], function (exports_2, context_2) {
    "use strict";
    var Vector2_1, Rect;
    var __moduleName = context_2 && context_2.id;
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
                Contains(vec) {
                    return (vec.X >= this.Position.X) && (vec.X <= this.Position.X + this.Width) &&
                        (vec.Y >= this.Position.Y) && (vec.Y <= this.Position.Y + this.Height);
                }
            };
            exports_2("default", Rect);
        }
    };
});
System.register("apps/System/Matrix2D", ["apps/System/Vector2"], function (exports_3, context_3) {
    "use strict";
    var Vector2_2, Matrix2D;
    var __moduleName = context_3 && context_3.id;
    ///This code is NOT my work.  But honestly, this is just math and anyone with half a brain
    /// looks it up hwne needed rathre then reinventing the wheel
    /// In this cas the author is Andrew Ippoliti,  http://blog.acipo.com/matrix-inversion-in-javascript/
    function matrix_invert(M) {
        // I use Guassian Elimination to calculate the inverse:
        // (1) 'augment' the matrix (left) by the identity (on the right)
        // (2) Turn the matrix on the left into the identity by elemetry row ops
        // (3) The matrix on the right is the inverse (was the identity matrix)
        // There are 3 elemtary row ops: (I combine b and c in my code)
        // (a) Swap 2 rows
        // (b) Multiply a row by a scalar
        // (c) Add 2 rows
        //if the matrix isn't square: exit (error)
        if (M.length !== M[0].length) {
            return;
        }
        //create the identity matrix (I), and a copy (C) of the original
        var i = 0, ii = 0, j = 0, dim = M.length, e = 0, t = 0;
        var I = [], C = [];
        for (i = 0; i < dim; i += 1) {
            // Create the row
            I[I.length] = [];
            C[C.length] = [];
            for (j = 0; j < dim; j += 1) {
                //if we're on the diagonal, put a 1 (for identity)
                if (i == j) {
                    I[i][j] = 1;
                }
                else {
                    I[i][j] = 0;
                }
                // Also, make the copy of the original
                C[i][j] = M[i][j];
            }
        }
        // Perform elementary row operations
        for (i = 0; i < dim; i += 1) {
            // get the element e on the diagonal
            e = C[i][i];
            // if we have a 0 on the diagonal (we'll need to swap with a lower row)
            if (e == 0) {
                //look through every row below the i'th row
                for (ii = i + 1; ii < dim; ii += 1) {
                    //if the ii'th row has a non-0 in the i'th col
                    if (C[ii][i] != 0) {
                        //it would make the diagonal have a non-0 so swap it
                        for (j = 0; j < dim; j++) {
                            e = C[i][j]; //temp store i'th row
                            C[i][j] = C[ii][j]; //replace i'th row by ii'th
                            C[ii][j] = e; //repace ii'th by temp
                            e = I[i][j]; //temp store i'th row
                            I[i][j] = I[ii][j]; //replace i'th row by ii'th
                            I[ii][j] = e; //repace ii'th by temp
                        }
                        //don't bother checking other rows since we've swapped
                        break;
                    }
                }
                //get the new diagonal
                e = C[i][i];
                //if it's still 0, not invertable (error)
                if (e == 0) {
                    return;
                }
            }
            // Scale this row down by e (so we have a 1 on the diagonal)
            for (j = 0; j < dim; j++) {
                C[i][j] = C[i][j] / e; //apply to original matrix
                I[i][j] = I[i][j] / e; //apply to identity
            }
            // Subtract this row (scaled appropriately for each row) from ALL of
            // the other rows so that there will be 0's in this column in the
            // rows above and below this one
            for (ii = 0; ii < dim; ii++) {
                // Only apply to other rows (we want a 1 on the diagonal)
                if (ii == i) {
                    continue;
                }
                // We want to change this element to 0
                e = C[ii][i];
                // Subtract (the row above(or below) scaled by e) from (the
                // current row) but start at the i'th column and assume all the
                // stuff left of diagonal is 0 (which it should be if we made this
                // algorithm correctly)
                for (j = 0; j < dim; j++) {
                    C[ii][j] -= e * C[i][j]; //apply to original matrix
                    I[ii][j] -= e * I[i][j]; //apply to identity
                }
            }
        }
        //we've done all operations, C should be the identity
        //matrix I should be the inverse:
        return I;
    }
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
                Invert() {
                    return new Matrix2D(matrix_invert(this.values));
                }
                Scale(mult) {
                    return this.Dot(new Matrix2D([
                        [mult.X, 0, 0],
                        [0, mult.Y, 0],
                        [0, 0, 1]
                    ]));
                }
                GetRotation() {
                    let centroid = this.DotVec(new Vector2_2.default(0, 0));
                    // move xform abck to the origina
                    let rotOnly = this.Translate(new Vector2_2.default(-centroid.X, -centroid.Y));
                    let unitVec = rotOnly.DotVec(new Vector2_2.default(1, 0));
                    unitVec = unitVec.Normalized(); // cancel out any scaling
                    // x is opp, y = adjacent tan=opp/adjacent
                    let rads = Math.atan2(unitVec.Y, unitVec.X);
                    if (rads < 0) { // cpnvrt to 0 to 2PI
                        rads = rads + (Math.PI * 2);
                    }
                    return rads;
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
            exports_3("default", Matrix2D);
        }
    };
});
System.register("apps/System/Graphics2D", ["apps/System/Rect", "apps/System/Matrix2D", "apps/System/Sprites/SimpleImageSprite", "apps/System/Vector2"], function (exports_4, context_4) {
    "use strict";
    var Rect_1, Matrix2D_1, SimpleImageSprite_1, Vector2_3, Graphics2D;
    var __moduleName = context_4 && context_4.id;
    /**
     * This was a little test of drawing an image with transforms used  in debugging
     * @constructor
     */
    function Teapottest() {
        // stand alone web page test
        console.log("Making a G2D");
        let g2d = new Graphics2D();
        let image = new Image();
        image.onerror = () => {
            console.log("Failed loading teapot");
        };
        image.onload = () => {
            let sprite = new SimpleImageSprite_1.default(image);
            let m = sprite.Transform.Translate(new Vector2_3.default(-sprite.Width / 2, -sprite.Height / 2));
            m = m.Rotate(Math.PI / 4);
            m = m.Translate(new Vector2_3.default(200, 200));
            sprite.Transform = m;
            g2d.AddSprite(sprite);
            g2d.Redraw();
        };
        image.src = "utah_teapot.png";
    }
    return {
        setters: [
            function (Rect_1_1) {
                Rect_1 = Rect_1_1;
            },
            function (Matrix2D_1_1) {
                Matrix2D_1 = Matrix2D_1_1;
            },
            function (SimpleImageSprite_1_1) {
                SimpleImageSprite_1 = SimpleImageSprite_1_1;
            },
            function (Vector2_3_1) {
                Vector2_3 = Vector2_3_1;
            }
        ],
        execute: function () {
            /**
             * This class is an abstraction of the underlying drawing system.  It serves to isolate the ret of the code from
             * the low level rendering details.
             *
             * It also owns the update/render list which is called to draw a frame through the Render method
             * @class
             */
            Graphics2D = class Graphics2D {
                /**
                 * This creates a Graphics2D which is necessary for all drawing operations.
                 * It retrieves the graphics context from an HTML5  canvas element named "canvas" by default but this can be
                 * overidden
                 * @param divname  the name of the canvas element to render to, defaults to "canvas"
                 * @constructor
                 */
                constructor(divname) {
                    /**
                     * This is the update/draw list.  Sprites are invoked in their order in the list
                     */
                    this.spriteList = new Array();
                    /**
                     * This holds a base transform from the virtual draw space to the canvas space
                     * It allows for transformation of the entire presentation and is typiaclly used to scale the
                     * game for different display sizes
                     *
                     * This is also called a "camera transform" in some game engines
                     */
                    this.worldXform = new Matrix2D_1.default();
                    if (divname == undefined) {
                        divname = "canvas";
                    }
                    this.canvas = document.getElementById(divname);
                    this.ctx = this.canvas.getContext('2d');
                    // set up the size relative to the actual device
                    this.ResetCanvasSize(window.innerWidth, window.innerHeight);
                    this.screenSize = new Vector2_3.default(this.canvas.clientWidth, this.canvas.clientHeight);
                    this.Redraw(); // initial frame
                    // add in mouse click hook
                    var self = this;
                    this.canvas.addEventListener('mousedown', (event) => {
                        let x = event.offsetX;
                        let y = event.offsetY;
                        let skip = false;
                        self.spriteList.forEach(sprite => {
                            let sssprite = sprite;
                            if ((!skip) && (sssprite.OnClick != undefined)) {
                                let worldRelativeClick = self.WorldXform.Invert().DotVec(new Vector2_3.default(x, y));
                                skip = !sssprite.OnClick(worldRelativeClick); //eturns true if continuing, false if consumed
                            }
                        });
                    });
                    // NOTE: this is temporary, eventually proper font support shouldbe added
                    this.ctx.font = 'bold 48px serif';
                    this.ctx.fillStyle = 'black';
                    var self = this;
                    window.addEventListener('resize', () => {
                        self.ResetCanvasSize(window.innerWidth, window.innerHeight);
                        self.screenSize = new Vector2_3.default(this.canvas.clientWidth, this.canvas.clientHeight);
                        self.SetDrawspaceSize(self.Size); // reset world transform
                    });
                }
                /**
                 * Returns the size of the actual canvas as a Vector2 where X is the width and Y is the height
                 * @property
                 */
                get PhysicalSize() {
                    return this.screenSize;
                }
                /**
                 * Returns the size of the virtual drawspace as a Vector2 where X is the width and Y is the height
                 * @property
                 */
                get Size() {
                    return this.drawspaceSize;
                }
                /***
                 * This sets the world transform, also called a camera transform, that maps from virtual draw space to
                 * canvas space
                 * @param xform  a Matrix2D used to transform from virtual draw space to canvas space
                 * @property
                 */
                set WorldXform(xform) {
                    this.worldXform = xform;
                }
                /**
                 * This returns a copy of the current world transform. Changing it will NOT change the
                 * world transform unless it is set back with the setter
                 * @property
                 */
                get WorldXform() {
                    return this.worldXform.Clone();
                }
                /**
                 * This sets the virtual draw space size.  It re-writes the world transform as a scaling transform
                 * from the given size to the actual canvas size
                 * @param size a Vector2 where X is the width of the draw space, and Y is the height
                 * @method
                 */
                SetDrawspaceSize(size) {
                    this.drawspaceSize = size;
                    let scaleX = this.PhysicalSize.X / this.drawspaceSize.X;
                    let scaleY = this.PhysicalSize.Y / this.drawspaceSize.Y;
                    this.worldXform = new Matrix2D_1.default().Scale(new Vector2_3.default(scaleX, scaleY));
                }
                /**
                 * This is used to make the actual canvas element the size of the available browser window
                 * @param width the width to set the canvas element to
                 * @param height the height to set the canvas element to
                 * @method
                 */
                ResetCanvasSize(width, height) {
                    this.canvas.width = width;
                    this.canvas.height = height;
                }
                /**
                 * This adds a sprite to the list to be updated and drawn each frame
                 * @param sprite An object that implements the Sprite interface
                 * Note that a sprite that is added multiple tiems will get multiple Update and Redraw
                 * calls every frame. (Which is probably not what you want.)
                 * @method
                 */
                AddSprite(sprite) {
                    this.spriteList.push(sprite);
                }
                /**
                 /**
                 * This removes a sprite to the list to be updated and drawn each frame
                 * It only removes the first encountered instance of a sprite in the draw list
                 * @param sprite An object that implements the Sprite interface
                 * @method
                 */
                RemoveSprite(sprite) {
                    let idx = this.spriteList.findIndex(a => a == sprite); //note == used because we DO want to compare references not values
                    if (idx >= 0) { // found a match
                        this.spriteList.splice(idx, 1);
                    }
                }
                /**
                 *
                 * This method sets the background color/style to use with following fills.
                 * Valid values are any valid Canvas fill style.
                 * @param style The style to use to fill the background, default is blue
                 * @method
                 */
                SetBkgdColor(style) {
                    if (style == undefined) {
                        style = "blue";
                    }
                    this.ctx.fillStyle = style;
                }
                /**
                 * This method draws a filled rectangle using the already set fill style
                 * @param rect a Rect object that defiens the rectangle to fill (inclusive)
                 * @method
                 */
                FillRect(rect) {
                    this.ctx.fillRect(rect.Position.X, rect.Position.Y, rect.Width, rect.Height);
                }
                /**
                 * This method fills the canvas with a passed in background color, default is blue
                 * @param bkgdColor  The color to fill the canvas with
                 * @method
                 */
                Clear(bkgdColor) {
                    this.ctx.resetTransform();
                    this.SetBkgdColor(bkgdColor);
                    this.FillRect(new Rect_1.default(0, 0, this.PhysicalSize.X, this.PhysicalSize.Y));
                }
                /**
                 * This method draws an image to the screen using the passed in Transformm, sub rectangle, and destination size
                 * In genreal destination size should be left undefined and all scaling shoudl be done through the transform.
                 * destSize just exists for very special corner cases.
                 * @param image the source of pixel data
                 * @param xform a transform to apply to the image's position, rotation, and size, defaults to the identity xform
                 * @param subRect A portion of the image to draw, defaults to the entire image
                 * @param destSize The size the image is to drawn in.  It dafaults to the size of the source sub rectangle
                 * @method
                 */
                DrawImage(image, xform, subRect, destSize) {
                    if (xform == undefined) {
                        xform = this.worldXform; // dont use getter to avoid an unecessary copy
                    }
                    else {
                        xform = xform.Dot(this.worldXform); // ditto
                    }
                    if (subRect == undefined) {
                        subRect = new Rect_1.default(0, 0, image.width, image.height);
                    }
                    if (destSize == undefined) {
                        destSize = new Vector2_3.default(subRect.Width, subRect.Height);
                    }
                    xform.SetContextTransform(this.ctx);
                    this.ctx.drawImage(image, subRect.Position.X, subRect.Position.Y, subRect.Width, subRect.Height, 0, 0, destSize.X, destSize.Y);
                }
                /**
                 * This method draws text using the current canvas context setitngs for font and fill
                 * The passed in transform is used to position the text.  By defeault, the text is left justified at the
                 * origin point.  If center is true, it is instead centered on the origin point
                 * IMPORTANT: Due to apprent limitations in Canvas drawtest scalling and rotation are not supported
                 * This routine should eventually be re-written to use sprite-based text graphics
                 * @param text a string to render
                 * @param xform the position transform, defaults to identity which makes text position 0,0
                 * @param center if true then text is centered, if not or udnefined then text is left justified
                 * @method
                 */
                DrawText(text, xform, center) {
                    if (xform == undefined) {
                        xform = this.worldXform; // dont use getter to avoid an unecessary copy
                    }
                    else {
                        xform = xform.Dot(this.worldXform); // ditto
                    }
                    if (center == undefined) {
                        center = false;
                    }
                    this.ctx.resetTransform(); // becasue we apply the transform ourselves
                    this.ctx.fillStyle = 'black';
                    let pos = xform.DotVec(new Vector2_3.default(0, 0)); // transform does not appear to move text, this is a hack
                    if (center) {
                        this.ctx.textAlign = "center";
                    }
                    else {
                        this.ctx.textAlign = "start";
                    }
                    this.ctx.fillText(text, pos.X, pos.Y);
                }
                /**
                 * This method attempts to get the text size.  It currently returns the size in CSS pixels, whose mapping to
                 * Canvas pixels is unclear at the moment.  Height also is estimated by the width of an M and seems reaosnably close.
                 * @bug It is unclear how this value maps to drawspace right now
                 * @param text the text to measure
                 * @param xform the text transform, defaults to identity, not clear this is working
                 * @method
                 * @return a Vector2 where the X is text stirng width and Y is text string height
                 */
                GetTextSize(text, xform) {
                    if (xform == undefined) {
                        xform = this.worldXform; // dont use getter to avoid an unecessary copy
                    }
                    else {
                        xform = xform.Dot(this.worldXform); // ditto
                    }
                    var text_measures = this.ctx.measureText(text);
                    let pixelWidth = text_measures.width;
                    // this is a dirty hack based on some typography pseudo standards
                    let pixelHeight = this.ctx.measureText('M').width;
                    let transformed = xform.Invert().DotVec(new Vector2_3.default(pixelWidth, pixelHeight));
                    return transformed;
                }
                /**
                 * Calling this method updates all the sprites with the delta in ms since last update call.
                 * It then requests that they draw themselves
                 * All updates happen before renders.  The sprites are called in order of addition to the sprite list
                 * @param bkgdColor
                 * @method
                 */
                Redraw(bkgdColor) {
                    var self = this;
                    window.requestAnimationFrame((currentTime) => {
                        if (self.lastTime == undefined) { // first call
                            self.lastTime = currentTime;
                            return;
                        }
                        let msDelta = currentTime - self.lastTime;
                        self.lastTime = currentTime;
                        self.Clear();
                        for (let i = 0; i < self.spriteList.length; i++) {
                            self.spriteList[i].Update(msDelta);
                        }
                        for (let i = 0; i < this.spriteList.length; i++) {
                            self.spriteList[i].Render(this);
                        }
                    });
                }
            };
            exports_4("default", Graphics2D);
        }
    };
});
System.register("apps/System/Sprite", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("apps/System/Sprites/SimpleImageSprite", ["apps/System/Rect", "apps/System/Matrix2D"], function (exports_6, context_6) {
    "use strict";
    var Rect_2, Matrix2D_2, SimpleImageSprite;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (Rect_2_1) {
                Rect_2 = Rect_2_1;
            },
            function (Matrix2D_2_1) {
                Matrix2D_2 = Matrix2D_2_1;
            }
        ],
        execute: function () {
            SimpleImageSprite = class SimpleImageSprite {
                constructor(source) {
                    this.Transform = new Matrix2D_2.default();
                    this.source = source;
                }
                get Width() {
                    return this.source.width;
                }
                get Height() {
                    return this.source.height;
                }
                get OnClckCB() {
                    return this.onClickCB;
                }
                set OnClickCB(cb) {
                    this.onClickCB = cb;
                }
                Render(g2d) {
                    g2d.DrawImage(this.source, this.Transform);
                }
                Update(msDelta) {
                    //nop nothing time based
                }
                OnClick(worldPos) {
                    console.log("got click event");
                    if (this.onClickCB == undefined) {
                        return true;
                    }
                    else {
                        let testRect = new Rect_2.default(0, 0, this.source.width, this.source.height);
                        let localPos = this.Transform.Invert().DotVec(worldPos);
                        if (testRect.Contains(localPos)) {
                            console.log("click in my space");
                            return this.onClickCB(localPos);
                        }
                        else {
                            console.log("click out of my space");
                        }
                    }
                }
            };
            exports_6("default", SimpleImageSprite);
        }
    };
});
System.register("apps/System/Sprites/ScrollingImageSprite", ["apps/System/Sprites/SimpleImageSprite", "apps/System/Vector2", "apps/System/Rect"], function (exports_7, context_7) {
    "use strict";
    var SimpleImageSprite_2, Vector2_4, Rect_3, ScrollingImageSprite;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (SimpleImageSprite_2_1) {
                SimpleImageSprite_2 = SimpleImageSprite_2_1;
            },
            function (Vector2_4_1) {
                Vector2_4 = Vector2_4_1;
            },
            function (Rect_3_1) {
                Rect_3 = Rect_3_1;
            }
        ],
        execute: function () {
            ScrollingImageSprite = class ScrollingImageSprite extends SimpleImageSprite_2.default {
                constructor(source, widthInCells, heightInCells, loop, pixPerSec) {
                    super(source);
                    this.loop = false;
                    this.pixPerSec = new Vector2_4.default(0, 0);
                    this.stopAt = -1; // -1 means don't stop
                    if (loop != undefined) {
                        this.loop = loop;
                    }
                    if (pixPerSec != undefined) {
                        this.pixPerSec = pixPerSec;
                    }
                    this.cellRect = new Rect_3.default(0, 0, super.Width / widthInCells, super.Height / heightInCells);
                    this.pixPerSec = new Vector2_4.default(0, 0);
                }
                set PixPerSec(vec) {
                    this.pixPerSec = vec;
                    this.stopAt = -1;
                }
                Update(msDelta) {
                    let moveVec = this.pixPerSec.TimesScalar(msDelta / 1000);
                    let movePos = this.cellRect.Position.Add(moveVec);
                    if (this.loop) { // go to top when bottom in full vuew, assumes matchign top and bttom
                        if ((movePos.X) >= (super.Width - this.cellRect.Width)) {
                            movePos.X = 0;
                        }
                        if ((movePos.Y) >= (super.Height - this.cellRect.Height)) {
                            movePos.Y = 0;
                        }
                    }
                    else { // stop if at last cell
                        if ((movePos.X) >= (super.Width - this.cellRect.Width)) {
                            this.pixPerSec.X = 0;
                            movePos.X = this.Width - this.cellRect.Width;
                        }
                        if ((movePos.Y) >= (super.Height - this.cellRect.Height)) {
                            this.pixPerSec.Y = 0;
                            movePos.Y = super.Height - this.cellRect.Height;
                        }
                    }
                    //check for stop, IMPORTANT: currently only does y, might need to be added to in the future
                    if (this.stopAt > -1) {
                        let stopCellY = this.stopAt * this.cellRect.Height;
                        if ((stopCellY <= movePos.Y) && (movePos.Y < (stopCellY + this.cellRect.Height))) {
                            // stop on this cell
                            movePos.Y = this.cellRect.Height * this.stopAt;
                            this.PixPerSec = new Vector2_4.default(0, 0);
                            this.stopAt = -1;
                        }
                    }
                    this.cellRect.Position = movePos;
                }
                StopAtYCell(cellNum) {
                    this.stopAt = Math.trunc(cellNum);
                }
                Render(g2d) {
                    g2d.DrawImage(this.source, this.Transform, this.cellRect);
                }
            };
            exports_7("default", ScrollingImageSprite);
        }
    };
});
// This is the main game file for the slot machine game
System.register("apps/SlotMachine", ["apps/System/Sprites/SimpleImageSprite", "apps/System/Matrix2D", "apps/System/Vector2", "apps/System/Graphics2D", "apps/System/Sprites/ScrollingImageSprite"], function (exports_8, context_8) {
    "use strict";
    var SimpleImageSprite_3, Matrix2D_3, Vector2_5, Graphics2D_1, ScrollingImageSprite_1, g2d, screenSize, reel1, reel2, reel3, reel4, loadCount, assetNum, drawList, reelStopCount, audio;
    var __moduleName = context_8 && context_8.id;
    function AssetLoaded() {
        loadCount += 1;
        if (loadCount == assetNum) { // all assets loaded}
            drawList.forEach(s => g2d.AddSprite(s)); // gets tem in the right order
            StartGame();
        }
    }
    function LoadImage(path, success, failure) {
        assetNum += 1; // incr wait count
        let image = new Image();
        image.onerror = () => {
            if (failure != undefined) {
                failure(image);
            }
        };
        image.onload = () => {
            if (success != undefined) {
                success(image);
            }
        };
        image.src = path;
    }
    function ImageLoadFailed(img) {
        console.log("Failed to load image at " + img.src);
    }
    function StartGame() {
        //initial screen draw
        g2d.Redraw();
        // start animation
        setInterval(() => g2d.Redraw());
    }
    function StopReel() {
        reelStopCount -= 1;
        if (reelStopCount == 0) {
            audio.pause();
        }
    }
    function Spin(r1, r2, r3, r4) {
        //set reels spinning
        let vec = new Vector2_5.default(0, 1800);
        reelStopCount = 4;
        setTimeout(() => {
            reel1.PixPerSec = vec;
            setTimeout(() => {
                reel1.StopAtYCell(r1);
                StopReel();
            }, (Math.random() * 1000) + 3000);
        }, 10);
        setTimeout(() => {
            reel2.PixPerSec = vec;
            setTimeout(() => {
                reel2.StopAtYCell(r2);
                StopReel();
            }, (Math.random() * 1000) + 3000);
        }, 30);
        setTimeout(() => {
            reel3.PixPerSec = vec;
            setTimeout(() => {
                reel3.StopAtYCell(r3);
                StopReel();
            }, (Math.random() * 1000) + 3000);
        }, 50);
        setTimeout(() => {
            reel4.PixPerSec = vec;
            setTimeout(() => {
                reel4.StopAtYCell(r4);
                StopReel();
            }, (Math.random() * 1000) + 3000);
        }, 80);
        // tepoaray audio code
        audio = new Audio("apps/assets/ratchet.mp3");
        audio.play();
    }
    return {
        setters: [
            function (SimpleImageSprite_3_1) {
                SimpleImageSprite_3 = SimpleImageSprite_3_1;
            },
            function (Matrix2D_3_1) {
                Matrix2D_3 = Matrix2D_3_1;
            },
            function (Vector2_5_1) {
                Vector2_5 = Vector2_5_1;
            },
            function (Graphics2D_1_1) {
                Graphics2D_1 = Graphics2D_1_1;
            },
            function (ScrollingImageSprite_1_1) {
                ScrollingImageSprite_1 = ScrollingImageSprite_1_1;
            }
        ],
        execute: function () {// This is the main game file for the slot machine game
            // set up environemnt
            g2d = new Graphics2D_1.default();
            g2d.SetDrawspaceSize(new Vector2_5.default(1920, 1080));
            screenSize = g2d.Size;
            //load assets in parallel
            loadCount = 0;
            assetNum = 0;
            drawList = Array(6); // used to assemble in right draw order
            LoadImage("apps/assets/slot.png", (img) => {
                let slot = new SimpleImageSprite_3.default(img);
                drawList[0] = slot;
                AssetLoaded();
            }, ImageLoadFailed);
            LoadImage("apps/assets/reel_cropped.png", (img) => {
                reel1 = new ScrollingImageSprite_1.default(img, 1, 5, true, new Vector2_5.default(0, 100));
                drawList[1] = reel1;
                reel1.Transform = new Matrix2D_3.default().Translate(new Vector2_5.default(464, 298));
                reel2 = new ScrollingImageSprite_1.default(img, 1, 5, true, new Vector2_5.default(0, 100));
                drawList[2] = reel2;
                reel2.Transform = new Matrix2D_3.default().Translate(new Vector2_5.default(614, 298));
                reel3 = new ScrollingImageSprite_1.default(img, 1, 5, true, new Vector2_5.default(0, 100));
                drawList[3] = reel3;
                reel3.Transform = new Matrix2D_3.default().Translate(new Vector2_5.default(764, 298));
                reel4 = new ScrollingImageSprite_1.default(img, 1, 5, true, new Vector2_5.default(0, 100));
                drawList[4] = reel4;
                reel4.Transform = new Matrix2D_3.default().Translate(new Vector2_5.default(914, 298));
                AssetLoaded();
            }, ImageLoadFailed);
            LoadImage("apps/assets/spin_button.png", (img) => {
                let spin = new SimpleImageSprite_3.default(img);
                spin.Transform = new Matrix2D_3.default().Translate(new Vector2_5.default(475, 600));
                spin.OnClickCB = (localPos) => {
                    console.log("click!");
                    Spin(Math.trunc((Math.random() * 3)), Math.trunc((Math.random() * 3)), Math.trunc((Math.random() * 3)), Math.trunc((Math.random() * 3)));
                    return true;
                };
                drawList[5] = spin;
                AssetLoaded();
            });
            reelStopCount = 4;
        }
    };
});
System.register("apps/System/Sprites/SpinningSprite", ["apps/System/Sprites/SimpleImageSprite", "apps/System/Vector2"], function (exports_9, context_9) {
    "use strict";
    var SimpleImageSprite_4, Vector2_6, SpinningSprite;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [
            function (SimpleImageSprite_4_1) {
                SimpleImageSprite_4 = SimpleImageSprite_4_1;
            },
            function (Vector2_6_1) {
                Vector2_6 = Vector2_6_1;
            }
        ],
        execute: function () {
            SpinningSprite = class SpinningSprite extends SimpleImageSprite_4.default {
                constructor(source) {
                    super(source);
                    this.rotationSpeed = 0;
                }
                get Speed() {
                    return this.rotationSpeed;
                }
                set Speed(radsPerSec) {
                    this.rotationSpeed = radsPerSec;
                }
                Update(msDelta) {
                    super.Update(msDelta);
                    let center = this.Transform.DotVec(new Vector2_6.default(this.Width / 2, this.Height / 2));
                    //zero the center
                    this.Transform = this.Transform.Translate(new Vector2_6.default(-center.X, -center.Y));
                    this.Transform = this.Transform.Rotate(this.rotationSpeed * msDelta / 1000);
                    this.Transform = this.Transform.Translate(center);
                }
            };
            exports_9("default", SpinningSprite);
        }
    };
});
System.register("apps/System/NumericalMapper", [], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("apps/System/Sprites/AcceleratingSpinningSprite", ["apps/System/Sprites/SpinningSprite"], function (exports_11, context_11) {
    "use strict";
    var SpinningSprite_1, AcceleratingSpinningSprite;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (SpinningSprite_1_1) {
                SpinningSprite_1 = SpinningSprite_1_1;
            }
        ],
        execute: function () {
            /**
             * This class implements a sprite with a scrolling data window, it is used in SlotMachine to simulate
             * spinning reels.
             * @class
             * @TODO It currently is limited to only scrolling in Y, will need more work to support X
             */
            AcceleratingSpinningSprite = class AcceleratingSpinningSprite extends SpinningSprite_1.default {
                constructor(source, accelFunc) {
                    super(source);
                    this.targetSpeed = 0;
                    this.timeToReachMS = 0;
                    this.timer = 0;
                    this.mapper = accelFunc;
                }
                AcclToRadsPerSec(spd, timeToReachMS, mappingFunc) {
                    this.targetSpeed = spd;
                    this.timeToReachMS = timeToReachMS;
                    this.timer = 0;
                    this.mapper = mappingFunc;
                    this.startingSpeed = this.Speed;
                }
                // first cut only knows how to accelerate
                Update(deltaMS) {
                    if (this.timer >= this.timeToReachMS) {
                        this.Speed = this.targetSpeed;
                    }
                    else {
                        this.timer = this.timer + deltaMS;
                        let linearTimePos = this.timer / this.timeToReachMS;
                        let maxSpeed = Math.max(this.startingSpeed, this.targetSpeed);
                        if (this.targetSpeed < this.startingSpeed) {
                            // decellerating
                            linearTimePos = 1 - linearTimePos;
                        }
                        let newSpeed = maxSpeed * this.mapper.Map(linearTimePos);
                        // console.log("Time: "+this.timer+", Speed: "+newSpeed);
                        this.Speed = newSpeed;
                    }
                    super.Update(deltaMS);
                }
            };
            exports_11("default", AcceleratingSpinningSprite);
        }
    };
});
System.register("apps/System/Sprites/ExponentialMapper", [], function (exports_12, context_12) {
    "use strict";
    var ExponentialMapper;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [],
        execute: function () {
            ExponentialMapper = class ExponentialMapper {
                constructor(exponent) {
                    this.expo = 2;
                    this.expo = exponent;
                }
                //expects 0 .. 1 and returns 1 to the N
                Map(n) {
                    return Math.pow(n, this.expo);
                }
            };
            exports_12("default", ExponentialMapper);
        }
    };
});
System.register("apps/System/Sprites/ArcsinMapper", [], function (exports_13, context_13) {
    "use strict";
    var ArcsinMapper;
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [],
        execute: function () {
            ArcsinMapper = class ArcsinMapper {
                constructor() {
                    this.boolean = false;
                }
                Map(input) {
                    //asymptotes and limits
                    if (input >= 1) {
                        return 1;
                    }
                    if (input <= 0) {
                        return 0;
                    }
                    return Math.asin(input) / (Math.PI / 2);
                }
            };
            exports_13("default", ArcsinMapper);
        }
    };
});
System.register("apps/System/Sprites/TextSprite", ["apps/System/Matrix2D"], function (exports_14, context_14) {
    "use strict";
    var Matrix2D_4, TextSprite;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [
            function (Matrix2D_4_1) {
                Matrix2D_4 = Matrix2D_4_1;
            }
        ],
        execute: function () {
            TextSprite = class TextSprite {
                constructor(g2d, text) {
                    this.Transform = new Matrix2D_4.default();
                    this.g2d = g2d;
                    if (text == undefined) {
                        this.Text = "Ipsum lorum";
                    }
                    this.Text = text;
                }
                get Height() {
                    return this.textSize.Y;
                }
                get Width() {
                    return this.textSize.X;
                }
                get Text() {
                    return this.text;
                }
                // always use this because it sets the size
                set Text(t) {
                    this.text = t;
                    this.textSize = this.g2d.GetTextSize(this.text);
                }
                Render(g2d) {
                    g2d.DrawText(this.Text, this.Transform);
                }
                Update(msDelta) {
                }
            };
            exports_14("default", TextSprite);
        }
    };
});
System.register("apps/System/Sprites/AutocenterTextSprite", ["apps/System/Sprites/TextSprite"], function (exports_15, context_15) {
    "use strict";
    var TextSprite_1, AutocenterTextSprite;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [
            function (TextSprite_1_1) {
                TextSprite_1 = TextSprite_1_1;
            }
        ],
        execute: function () {
            AutocenterTextSprite = class AutocenterTextSprite extends TextSprite_1.default {
                Render(g2d) {
                    g2d.DrawText(this.Text, this.Transform, true);
                }
            };
            exports_15("default", AutocenterTextSprite);
        }
    };
});
// This is the main game file for the slot machine game
System.register("apps/WheelOfFish", ["apps/System/Sprites/SimpleImageSprite", "apps/System/Matrix2D", "apps/System/Vector2", "apps/System/Graphics2D", "apps/System/Sprites/AcceleratingSpinningSprite", "apps/System/Sprites/ArcsinMapper", "apps/System/Sprites/AutocenterTextSprite"], function (exports_16, context_16) {
    "use strict";
    var SimpleImageSprite_5, Matrix2D_5, Vector2_7, Graphics2D_2, AcceleratingSpinningSprite_1, ArcsinMapper_1, AutocenterTextSprite_1, g2d, screenSize, wheel, spin, arrow, textDisplay, loadCount, assetNum, drawList, fishpuns;
    var __moduleName = context_16 && context_16.id;
    function LoadImage(path, success, failure) {
        assetNum += 1; // incr wait count
        let image = new Image();
        image.onerror = () => {
            if (failure != undefined) {
                failure(image);
            }
        };
        image.onload = () => {
            if (success != undefined) {
                success(image);
            }
        };
        image.src = path;
    }
    function AssetLoaded() {
        loadCount += 1;
        if (loadCount == assetNum) { // all assets loaded
            drawList.forEach(s => g2d.AddSprite(s)); // gets tem in the right order
            //g2d.AddSprite(textDisplay); debug used to test individual elements in isolation
            StartGame();
        }
    }
    function ImageLoadFailed(img) {
        console.log("Failed to load image at " + img.src);
    }
    /// game logic starts here
    function StartGame() {
        let wheeldiameter = .5 * Math.min(screenSize.X, screenSize.Y);
        // transform wheel to center it and to make 80% of smaller dimension
        wheel.Transform = new Matrix2D_5.default().Translate(new Vector2_7.default(-wheel.Width / 2, -wheel.Height / 2)); // center
        wheel.Transform = wheel.Transform.Scale(new Vector2_7.default(wheeldiameter / wheel.Width, wheeldiameter / wheel.Width)); //scale
        wheel.Transform = wheel.Transform.Translate(new Vector2_7.default(g2d.Size.X / 2, g2d.Size.Y / 2));
        //move spin button to middle top
        spin.Transform = new Matrix2D_5.default().Translate(new Vector2_7.default(-spin.Width / 2, -spin.Height / 2)); // center
        spin.Transform = spin.Transform.Translate(new Vector2_7.default(g2d.Size.X / 2, 10 + spin.Height / 2));
        //place arrow
        arrow.Transform = new Matrix2D_5.default().Translate(new Vector2_7.default(-arrow.Width, -arrow.Height / 2)); // set handle to tip of point
        arrow.Transform = arrow.Transform.Translate(new Vector2_7.default((g2d.Size.X - spin.Width) / 2, g2d.Size.Y / 2));
        // set text
        textDisplay.Transform = new Matrix2D_5.default().Translate(new Vector2_7.default(g2d.Size.X / 2, g2d.Size.Y - (2 * textDisplay.Height))); // center
        // test rotation
        //wheel.Speed= Math.PI/4;WheelOfFish.
        // start game engine
        //initial screen draw
        g2d.Redraw();
        // start animation
        setInterval(() => g2d.Redraw());
        //this was for test in development, not needed now that we have a button
        //Spin();
    }
    function Spin() {
        wheel.AcclToRadsPerSec(Math.PI * 2, 3000, new ArcsinMapper_1.default());
        setTimeout(() => {
            console.log("slowing down");
            //note this currently always decels to 0.
            wheel.AcclToRadsPerSec(0, 3000, new ArcsinMapper_1.default());
            setTimeout(DoFish, 3000);
        }, 10000);
    }
    function DoFish() {
        let angle = wheel.Transform.GetRotation() - (Math.PI / 32); //a  fudge for imperfect art
        let index = Math.trunc(angle / (Math.PI * 2 / 8));
        index = (index + 2) % 8; // rotates the sleection 3 c clockwise for more convenient arrow placement
        textDisplay.Text = fishpuns[7 - index];
    }
    return {
        setters: [
            function (SimpleImageSprite_5_1) {
                SimpleImageSprite_5 = SimpleImageSprite_5_1;
            },
            function (Matrix2D_5_1) {
                Matrix2D_5 = Matrix2D_5_1;
            },
            function (Vector2_7_1) {
                Vector2_7 = Vector2_7_1;
            },
            function (Graphics2D_2_1) {
                Graphics2D_2 = Graphics2D_2_1;
            },
            function (AcceleratingSpinningSprite_1_1) {
                AcceleratingSpinningSprite_1 = AcceleratingSpinningSprite_1_1;
            },
            function (ArcsinMapper_1_1) {
                ArcsinMapper_1 = ArcsinMapper_1_1;
            },
            function (AutocenterTextSprite_1_1) {
                AutocenterTextSprite_1 = AutocenterTextSprite_1_1;
            }
        ],
        execute: function () {// This is the main game file for the slot machine game
            // set up environemnt
            g2d = new Graphics2D_2.default();
            g2d.SetDrawspaceSize(new Vector2_7.default(1080, 1080));
            screenSize = g2d.Size;
            //load assets in parallel
            loadCount = 0;
            assetNum = 0;
            drawList = Array(6); // used to assemble in right draw order
            fishpuns = [
                "Aspirin is good for a haddock!",
                "You seem to be floundering",
                "Spin again just for the halibut",
                "I never could carry a tuna!",
                "Don't be koi, spin again",
                "I'm herring you!",
                "AMBERJACKPOT!",
                "Well, Carp!"
            ];
            // load all the sprites
            textDisplay = new AutocenterTextSprite_1.default(g2d, "Wheel of Fish!");
            drawList[3] = textDisplay;
            LoadImage("apps/assets/colored_wheel.png", (img) => {
                wheel = new AcceleratingSpinningSprite_1.default(img, new ArcsinMapper_1.default());
                drawList[0] = wheel;
                AssetLoaded();
            }, ImageLoadFailed);
            LoadImage("apps/assets/Arrow.png", (img) => {
                arrow = new AcceleratingSpinningSprite_1.default(img, new ArcsinMapper_1.default());
                drawList[1] = arrow;
                AssetLoaded();
            }, ImageLoadFailed);
            LoadImage("apps/assets/spin_button.png", (img) => {
                spin = new SimpleImageSprite_5.default(img);
                spin.Transform = new Matrix2D_5.default().Translate(new Vector2_7.default(475, 600));
                spin.OnClickCB = (localPos) => {
                    Spin();
                    return true;
                };
                drawList[2] = spin;
                AssetLoaded();
            });
        }
    };
});
System.register("apps/System/AudioClip", [], function (exports_17, context_17) {
    "use strict";
    var AudioClip;
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [],
        execute: function () {
            AudioClip = class AudioClip {
            };
            exports_17("default", AudioClip);
        }
    };
});
System.register("apps/System/Image", [], function (exports_18, context_18) {
    "use strict";
    var Image;
    var __moduleName = context_18 && context_18.id;
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
            exports_18("default", Image);
        }
    };
});
System.register("apps/System/Mixer", [], function (exports_19, context_19) {
    "use strict";
    var Mixer;
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [],
        execute: function () {
            Mixer = class Mixer {
                AddClip(clip) {
                }
                RemoveClip(clip) {
                }
            };
            exports_19("default", Mixer);
        }
    };
});
System.register("apps/System/tests/UnitTest1", ["assert", "apps/System/Matrix2D", "apps/System/Vector2"], function (exports_20, context_20) {
    "use strict";
    var assert_1, Matrix2D_6, Vector2_8;
    var __moduleName = context_20 && context_20.id;
    //Matrix2D tests
    function Matrix2DIdentityTest() {
        let m2d = new Matrix2D_6.default();
        assert_1.default.equal(m2d.IsIdentity(), true, "Identity matrixx created and tested");
    }
    exports_20("Matrix2DIdentityTest", Matrix2DIdentityTest);
    function VecDotUnitTest() {
        let m2d = new Matrix2D_6.default();
        let v = new Vector2_8.default(1, 0);
        assert_1.default.equal(m2d.DotVec(v).equals(v), true, "Testing dot vec with identity");
        // lets try a matrix rotation
        let rotm2 = m2d.Rotate(Math.PI / 2);
        let v2 = rotm2.DotVec(v);
        let vtest = new Vector2_8.default(0, 1);
        assert_1.default.equal(v2.equals(vtest), true, "testing 90 degree rotation");
        let transm = new Matrix2D_6.default().Translate(new Vector2_8.default(2, 2));
        vtest = transm.DotVec(vtest);
        assert_1.default.equal(vtest.equals(new Vector2_8.default(2, 3)), true, "Translate test");
        transm = new Matrix2D_6.default().Scale(new Vector2_8.default(0.5, 1));
        vtest = transm.DotVec(new Vector2_8.default(2, 2));
        assert_1.default.equal(vtest.equals(new Vector2_8.default(1, 2)), true, "testing with scale as well");
        transm = transm.Translate(new Vector2_8.default(3, -2));
        vtest = transm.DotVec(new Vector2_8.default(2, 2));
        assert_1.default.equal(vtest.equals(new Vector2_8.default(4, 0)), true, "testing with scale as well");
    }
    exports_20("VecDotUnitTest", VecDotUnitTest);
    return {
        setters: [
            function (assert_1_1) {
                assert_1 = assert_1_1;
            },
            function (Matrix2D_6_1) {
                Matrix2D_6 = Matrix2D_6_1;
            },
            function (Vector2_8_1) {
                Vector2_8 = Vector2_8_1;
            }
        ],
        execute: function () {
            ;
        }
    };
});
//# sourceMappingURL=application.js.map