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
/**
 * This is amath class that implents a 2D vector as an array of numbers.
 * A TypeScript array format allows for the use of map/reduce when dot  multiplying by a Matrix2D
 * This class does not yet implement all rasonable math functions, but only those needed right now
 * by the Graphics2D engine
 * It provides setters and getters to access the array elements as X,Y and W
 *
 */
System.register("apps/System/Vector2", [], function (exports_1, context_1) {
    "use strict";
    var Vector2;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {/**
             * This is amath class that implents a 2D vector as an array of numbers.
             * A TypeScript array format allows for the use of map/reduce when dot  multiplying by a Matrix2D
             * This class does not yet implement all rasonable math functions, but only those needed right now
             * by the Graphics2D engine
             * It provides setters and getters to access the array elements as X,Y and W
             *
             */
            Vector2 = class Vector2 {
                /**
                 * This creates a new Vector2 with the passed in values
                 * @param x the X value
                 * @param y the Y value
                 * @param w the W value, default is 1
                 * @constructor
                 */
                constructor(x, y, w) {
                    /**
                     * Holds the values
                     * @TODO: should really be made private with an acessor to make the interface  immutable
                     * @property
                     */
                    this.values = new Array(3);
                    if (w == undefined) {
                        w = 1;
                    }
                    this.X = x;
                    this.Y = y;
                    this.W = w;
                }
                /**
                 * gets the X position of the array and retruns its value
                 * @property
                 */
                get X() { return this.values[0]; }
                /**
                 * sets the X position of the array
                 * @property
                 */
                set X(v) { this.values[0] = v; }
                /**
                 * gets the Y position of the array and retruns its value
                 * @property
                 */
                get Y() { return this.values[1]; }
                /**
                 * sets the Y position of the array
                 * @property
                 */
                set Y(v) { this.values[1] = v; }
                /**
                 * gets the W position of the array and retruns its value
                 * @property
                */
                get W() { return this.values[2]; }
                /**
                 * sets the W position of the array
                 * @property
                 */
                set W(v) { this.values[2] = v; }
                /**
                 * tests two vectors for euqality to the passed numebr of places
                 * Note that the number of places is necessary to deal with rounding errors in the Javascript engine
                 * Default number of places is 6 after the decimal
                 * @param v2 the other Vector2 to comapre against
                 * @param numplaces the number of places after the decimal to check
                 * @returns true if equal, false if not
                 * @method
                 */
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
                /**
                 * This multiples this Vector2 times a scalar and returns the result as a new Vector2
                 * @param mult scalar to multiply by
                 * @constructor
                 * @returns the resulting Vector2
                 */
                TimesScalar(mult) {
                    return new Vector2(this.X * mult, this.Y * mult);
                }
                /**
                 * This adds this Vector2 to another Vector2 and returns the result as a new Vector2
                 * @param other
                 * @returns the resulting Vector2
                 * @method
                 */
                Add(other) {
                    return new Vector2(this.X + other.X, this.Y + other.Y);
                }
                /**
                 * This subtracts another Vector2 from this one and returns the result as a new Vector2
                 * @param other
                 * @returns the resulting Vector2
                 * @method
                 */
                Minus(other) {
                    return new Vector2(this.X - other.X, this.Y - other.Y);
                }
                /**
                 * This divides this Vector2 times a scalar and returns the result as a new Vector2
                 * @param mult scalar to multiply by
                 * @constructor
                 * @returns the resulting Vector2
                 */
                DivScalar(scalar) {
                    return new Vector2(this.X / scalar, this.Y / scalar);
                }
                /**
                 * This returns the length of this Vector2 as a scalar
                 * @returns a number holding the resulting length
                 * @method
                 */
                Magnitude() {
                    return Math.sqrt((this.X * this.X) + (this.Y * this.Y));
                }
                /**
                 * This returns the normalized version of this Vector2 as a vector2
                 * @returns a Vector2 holding the normalized vector
                 * @method
                 */
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
            /**
             * This is a simple geometric class that defiens a rectangle by its top left corner, width and height.
             * its is inclusive of  the boundaries
             * It also provides a method to test a point for inclusion in the rectangle
             * @class
             */
            Rect = class Rect {
                /**
                 * This reates a new rectangle with the passed in parameters
                 * @param x the left side of the rectangle
                 * @param y the top of the rectangle
                 * @param width the width of the rectangle
                 * @param height the height of the rectangle
                 */
                constructor(x, y, width, height) {
                    this.Position = new Vector2_1.default(x, y);
                    this.Width = width;
                    this.Height = height;
                }
                /**
                 * This tests a point passed a sa Vector2 for inclusion in the space defined  by the ractangle
                 * @param vec the point to test as a Vector2
                 * @returns true if the point is inside or on the boundaries of the rectangle, false if not
                 * @method
                 */
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
            /**
             * This class implements a 3x3 matrix as an array of row arrays
             * It is implemented with an immutable interface.  All math calls return a new Matrix2D  object that
             * contains the result
             * It makes heavy use of map/reduce internally to encourage the host system to parallelize operations
             *
             * @class
             */
            Matrix2D = class Matrix2D {
                /**
                 * This method returns a deep copy of the Matrix2D  object
                 * @method
                 */
                Clone() {
                    return new Matrix2D(this.values);
                }
                /**
                 * This constructor creates a new Matrix2D from a passed in array of rows
                 * It deep copies the arrya such that changing the source arrya will not effect the
                 * Matrix2D value
                 * If no array is provided, it creates an identity matrix
                 * @param init the array of rows, default is the identity matrix
                 */
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
                /**
                 * This tests a Matrix2D to see it if it the identity matrix
                 * @property
                 */
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
                /**
                 * returns a new Matrix2D object which represents this Matrix2D translated by the x and y in delta
                 * @param delta the x and y to translate by
                 * @returns a new Matrix2D object which represents this Matrix2D translated by the x and y in delta
                 * @method
                 */
                Translate(delta) {
                    return this.Dot(new Matrix2D([
                        [1, 0, delta.X],
                        [0, 1, delta.Y],
                        [0, 0, 1]
                    ]));
                }
                /**
                 * returns a new Matrix2D object which represents this Matrix2D rotated  by radians
                 * @param radians the clockwise rotatio to apply to this matrix to create a new one
                 * @returns a new Matrix2D object which represents this Matrix2D rotated  by radians
                 * @method
                 */
                Rotate(radians) {
                    return this.Dot(new Matrix2D([
                        [Math.cos(radians), -Math.sin(radians), 0],
                        [Math.sin(radians), Math.cos(radians), 0],
                        [0, 0, 1]
                    ]));
                }
                /**
                 * This returns a new Matrix2D which is the inverse of this matrix
                 * @returns the inverse matrix of this one
                 * @method
                 */
                Invert() {
                    return new Matrix2D(matrix_invert(this.values));
                }
                /**
                 * returns a new Matrix2D object which represents this Matrix2D scaled by mult
                 * @param mult the scale to apply to this matrix
                 * @returns a new Matrix2D object which represents this Matrix2D scaled by mult
                 * @method
                 */
                Scale(mult) {
                    return this.Dot(new Matrix2D([
                        [mult.X, 0, 0],
                        [0, mult.Y, 0],
                        [0, 0, 1]
                    ]));
                }
                /**
                 * This method extracts the rotation of this Matrix2D as clockwise radians
                 * Note that its rather expensive so its a godo candidate for caching where possible
                 * @returns the clockwise rotation of this Matrix2D in clockwise radians
                 * @method
                 */
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
                /**
                 * Pre-Multiplies this Matrix2D by another and returns thevalue as a nwe Matrix2D.  Note that
                 * pre-multiplication is what you want for concatenatign hirearchical transforms.
                 * @param other the other Matrix2D
                 * @returns   other * this as a new Matrix2D
                 * @method
                 */
                Dot(other) {
                    let result = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
                    result = result.map((row, i) => {
                        return row.map((val, j) => {
                            return other.values[i].reduce((sum, elm, k) => sum + (elm * this.values[k][j]), 0);
                        });
                    });
                    return new Matrix2D(result);
                }
                /**
                 * Dot  multiplies this matrix times a Vector2, transforming the Vector2 by this transform.
                 * Returns a new Vector2 containing the result
                 * @param vec the Vector2 to multiply by
                 * @returns vec * this as a new Vector2
                 * @method
                 */
                DotVec(vec) {
                    let v2 = new Vector2_2.default(1, 0);
                    // remeber that matrix access is [row][position], which means [y][x], and idexes are zero based
                    v2.X = this.values[0].reduce((sum, v, k) => sum + (v * vec.values[k]), 0);
                    v2.Y = this.values[1].reduce((sum, v, k) => sum + (v * vec.values[k]), 0);
                    v2.W = this.values[2].reduce((sum, v, k) => sum + (v * vec.values[k]), 0);
                    return v2;
                }
                /**
                 * This is a Utility method that extracts the Matrix values from this Matrix2D and sets them as the
                 * current transform of the passed in CanvasRenderingContext
                 * @param ctx the context to set
                 * @method
                 */
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
                        this.ctx.font = 'bold 48px serif';
                        self.OnResize(self);
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
            /**
             * A basic image drawing sprite. It is a super-class for a number fo fancier sprites.
             * It has a bitmap source, basic dimensions, a Transform, and a click CB
             * @class
             */
            SimpleImageSprite = class SimpleImageSprite {
                /**
                 * This creates a SimpleImageSprite from an HTML5 CanvasImageSource
                 * @param source the CanvasImageSource providing the bitmap
                 * @constructor
                 */
                constructor(source) {
                    /**
                     * A Transformation matrix to apply when drawing the bitmap
                     */
                    this.Transform = new Matrix2D_2.default();
                    this.source = source;
                }
                /**
                 * The width of the sprite's bounding rectangle
                 * @property
                 */
                get Width() {
                    return this.source.width;
                }
                /**
                 * The height of the sprite's bounding rectangle
                 * @property
                 */
                get Height() {
                    return this.source.height;
                }
                /**
                 * The user provided callback on mosue click, or undefined if not set
                 * @property
                 */
                get OnClckCB() {
                    return this.onClickCB;
                }
                /**
                 * Sets the user provided callback on mouse click
                 * @property
                 */
                set OnClickCB(cb) {
                    this.onClickCB = cb;
                }
                /**
                 * Called by the Gaphics2D to render the image
                 * @param g2d the G2D to use to render
                 * @method
                 */
                Render(g2d) {
                    g2d.DrawImage(this.source, this.Transform);
                }
                /***
                 * A null update because a SimpleImageSprite has no behavior other then rendering
                 * @param msDelta
                 * @method
                 */
                Update(msDelta) {
                    //nop nothing time based
                }
                /**
                 * A callback on mouse click that checks to se eif the click is in the sprite's boundng
                 * rectangle.  if so it calls the user defined callback if defined.
                 * @param worldPos where in drawspace the click ocurred
                 * @method
                 */
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
            /**
             * This class implements a sprite that displays a scrolling window from the total image
             * It is used to simulate slot reels in SlotMachine
             * @class
             *
             * @TODO: currently only supports Y scrolling, X shoudl be implemnted eventually
             */
            ScrollingImageSprite = class ScrollingImageSprite extends SimpleImageSprite_2.default {
                /**
                 * A constructor that makes a ScrollingImageSprite
                 * @param source the CanvasImageSource to use for bitmap data
                 * @param widthInCells the number of cells wide the image is, source width in pixels should divide evenly by this number
                 * @param heightInCells the number of cells high the image is, source height in pixels should divide evenly by this number
                 * @param loop if true then this is a looping scroll, undefined means false
                 * @param pixPerSec the nubmer of pixels the image should move at as a vector2. currently only Y is supported, default is 0
                 * @see PixPerSec
                 */
                constructor(source, widthInCells, heightInCells, loop, pixPerSec) {
                    super(source);
                    /**
                     * If true then the scrolling loops.  This functionality assumes that the start and end of the loop are
                     * the same in order to create a smoothly repeating scrolling view.
                     */
                    this.loop = false;
                    /**
                     * Speed to scroll the window at.  currentyl only  Y is used.
                     */
                    this.pixPerSec = new Vector2_4.default(0, 0);
                    /**
                     * A multiple of the cell size to stop at.  The loo pends when y = stopAt*cellRect.Height
                     */
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
                /**
                 * Sets the scroll rate.  If non-zero then scrolling starts immediately
                 * @TODO:  Currently only Y is supported, X should be added in the future
                 * @param vec A Vector2 representing the pixels per second in X and y to scroll
                 * @property
                 */
                set PixPerSec(vec) {
                    this.pixPerSec = vec;
                    this.stopAt = -1;
                }
                /**
                 * This calculates the position of the new sub-rect based on PixPerSec and msDelta
                 * @param msDelta elapsed milliseconds snce last call
                 * @method
                 */
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
                /**
                 * This sets the stopAt number, a loopign scroll cell to stop at.  The loop ends when y = stopAt*cellRect.Height
                 * @param cellNum the ordinal Y number of the cell to stop scrolling at
                 * @method
                 * @TODO: Only supports Y, should look at X as well in the future
                 */
                StopAtYCell(cellNum) {
                    this.stopAt = Math.trunc(cellNum);
                }
                /**
                 * Called by the Gaphics2D to render the image
                 * @param g2d the G2D to use to render
                 * @method
                 */
                Render(g2d) {
                    g2d.DrawImage(this.source, this.Transform, this.cellRect);
                }
            };
            exports_7("default", ScrollingImageSprite);
        }
    };
});
/**
 * This is the main script for the slot machien game.
 * It uses the Graphics2D system in the System folder for all its drawing.
 *
 * It automatically adjusts for window size.
 *
 * At the moment it uses a hacked async loading mechanism that has a very unlikely but possible race condition if all
 * previous loads end before all loads are started.  This coudl be fixed with a proper async loading queue.  This
 * was a compromsie for time.
 *
 * The slot machine also only uses about half the available screen width.  This comes from an early art error that
 * would be fixable but relative positionings might have to be changed so I decided to live with it as a first cut
 * rather then ship late.
 *
 * @TODO:  A button debounce  on spin would be a good idea before ship
 *
 *
 */
System.register("apps/SlotMachine", ["apps/System/Sprites/SimpleImageSprite", "apps/System/Matrix2D", "apps/System/Vector2", "apps/System/Graphics2D", "apps/System/Sprites/ScrollingImageSprite"], function (exports_8, context_8) {
    "use strict";
    var SimpleImageSprite_3, Matrix2D_3, Vector2_5, Graphics2D_1, ScrollingImageSprite_1, g2d, screenSize, reel1, reel2, reel3, reel4, loadCount, assetNum, drawList, reelStopCount, audio;
    var __moduleName = context_8 && context_8.id;
    /**
     * This callback method monitors loading and starst the game when all assets have bene loaded
     * @method
     */
    function AssetLoaded() {
        loadCount += 1;
        if (loadCount == assetNum) { // all assets loaded}
            drawList.forEach(s => g2d.AddSprite(s)); // gets tem in the right order
            StartGame();
        }
    }
    /**
     * This is the function used to load all images
     * @param path where to liad the image from
     * @param success a callback for when the inage is loaded
     * @param failure a callback if the load fails
     * @method
     */
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
    /**
     * A failure nethod to let us knwo if an image didnt load, for debugging
     * @param img
     * @constructor
     */
    function ImageLoadFailed(img) {
        console.log("Failed to load image at " + img.src);
    }
    /**
     * This is the function called when all images are loaded
     * it does an initial screen rdraw and starts the game loop
     * @methodthod
     */
    function StartGame() {
        //initial screen draw
        g2d.Redraw();
        // start animation
        setInterval(() => g2d.Redraw());
    }
    /**
     * This function is called by each reel when it stops to keep track of when the have all stopped and
     * end the audio.
     *
     * In the future it would also proceed to the win/lose state.  We know whether its a win or loss actually when we
     * start since the stop points are set in the Spin method, but we would wait til now to tell the player ;)
     * @method
     */
    function StopReel() {
        reelStopCount -= 1;
        if (reelStopCount == 0) {
            audio.pause();
            // TODO: go to win/loss
        }
    }
    /***
     * This is the logic of the game that spins the reels.  It uses features built into the ScrollingImageSprite
     * to roll the reel and tell it where to stop visually.  It starst them at different times and sets them up to stop
     * at random different times to proivde some visual interest
     * @param r1 where the first reel will stop
     * @param r2 where the second reel will stop
     * @param r3 where the third reel will stop
     * @param r4 where the fourth reel will stop
     * @method
     */
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
        execute: function () {/**
             * This is the main script for the slot machien game.
             * It uses the Graphics2D system in the System folder for all its drawing.
             *
             * It automatically adjusts for window size.
             *
             * At the moment it uses a hacked async loading mechanism that has a very unlikely but possible race condition if all
             * previous loads end before all loads are started.  This coudl be fixed with a proper async loading queue.  This
             * was a compromsie for time.
             *
             * The slot machine also only uses about half the available screen width.  This comes from an early art error that
             * would be fixable but relative positionings might have to be changed so I decided to live with it as a first cut
             * rather then ship late.
             *
             * @TODO:  A button debounce  on spin would be a good idea before ship
             *
             *
             */
            // set up environemnt
            g2d = new Graphics2D_1.default();
            g2d.SetDrawspaceSize(new Vector2_5.default(1920, 1080));
            screenSize = g2d.Size;
            //used to know when parallel loaded assetsare all in
            loadCount = 0;
            assetNum = 0;
            /**
             * This is used to assign the assets to a draw order.  the Graphics2D engine assumes that
             * draw order is the order in which they are added to its list.
             * This holds them in the right order until they are all loaded and cna be transferred
             * to Graphics2D
             */
            drawList = Array(6); // used to assemble in right draw order
            // start loading the game images here
            LoadImage("apps/assets/slot.png", (img) => {
                let slot = new SimpleImageSprite_3.default(img);
                drawList[0] = slot;
                AssetLoaded();
            }, ImageLoadFailed);
            // Note that we are going to use the same  image data for 4 independant reel sprites to save time
            // and memory
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
            // This loads the spin button and sets up a callback on click
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
            // This next section has to do with the spinning state.  It starts the reels spinning
            // and plays a ratchet noise
            /**
             * This is used to count down the asynchronously stopped reels so we know when we are done
             */
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
            /**
             * A child of SimpleImageSprite that implements a self-rotating image
             * @class
             */
            SpinningSprite = class SpinningSprite extends SimpleImageSprite_4.default {
                constructor() {
                    super(...arguments);
                    /**
                     * Speed to rotate in clockwise radians per second
                     */
                    this.rotationSpeed = 0;
                }
                /**
                * S
                 * Gets the  speed to rotate in clockwise radians per second
                 * @property
                */
                get Speed() {
                    return this.rotationSpeed;
                }
                /**
                 * Sets the  speed to rotate in clockwise radians per second
                 * @property
                 */
                set Speed(radsPerSec) {
                    this.rotationSpeed = radsPerSec;
                }
                /**
                 * Rotates the sprite by applying a rotation to its Transform based
                 * on rotationSpeed and the elapsed time in ms
                 * @param msDelta elasped time in MS
                 * @method
                 */
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
/**
 * This is a simple interface that defines an object with a Map function that maps a real input to a real output
 * It is generally assumed that the input and output are both in the 0-1 inclusive range
 * @interface
 */
System.register("apps/System/NumericalMapper", [], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [],
        execute: function () {/**
             * This is a simple interface that defines an object with a Map function that maps a real input to a real output
             * It is generally assumed that the input and output are both in the 0-1 inclusive range
             * @interface
             */
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
             * This class implements a sprite that spins with an increasing/creasing rate set by a mapping class
             * that maps 0:1 =>0:1 values.  It is used in WheelofFish
             * @class
             * @TTODO: Current only supports decreasing to 0 and increasing to a set max speed
             */
            AcceleratingSpinningSprite = class AcceleratingSpinningSprite extends SpinningSprite_1.default {
                constructor() {
                    super(...arguments);
                    /**
                     * The speed we are increasing or decreasing to over time
                     */
                    this.targetSpeed = 0;
                    /**
                     * Time over which to interpolate reachign enw speed
                     */
                    this.timeToReachMS = 0;
                    /**
                     * Internal tracker for how much time has passed since start of change
                     */
                    this.timer = 0;
                }
                /**
                 *  This method starts an acceleration or deceletation
                 *  @TODO: currently any speed less then current speed is treated as a 0.  Shoudl be improved
                 * @param spd the final speed to reach
                 * @param timeToReachMS how long the accel/deccel will take
                 * @param mappingFunc the function used to map the time to a more realistic non-linear curve
                 * @method
                 */
                AcclToRadsPerSec(spd, timeToReachMS, mappingFunc) {
                    this.targetSpeed = spd;
                    this.timeToReachMS = timeToReachMS;
                    this.timer = 0;
                    this.mapper = mappingFunc;
                    this.startingSpeed = this.Speed;
                }
                /**
                 * This update function does the actual speed modficiation and Transform rotation
                 * @param deltaMS numbre of MS since last called
                 * @method
                 */
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
            /**
             * This class defines a mapping function that maps the input to an exponential curve, limited to 0 - 1  inclusive
             * @class
             */
            ExponentialMapper = class ExponentialMapper {
                /**
                 * Creates an exponential mapper with the given exponent
                 * @param exponent the exponent of the map functions
                 */
                constructor(exponent) {
                    this.expo = 2;
                    this.expo = exponent;
                }
                /**
                 * Implements the arcsin based mapping function.
                 * @param input a numebr to map,
                 * @return the number passed in raised to the set exponent
                 * @method
                 */
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
            /**
             * This class defines a mapping function that maps the input to an arcsin curve, limited to 0 - 1  inclusive
             * @class
             */
            ArcsinMapper = class ArcsinMapper {
                constructor() {
                    this.boolean = false;
                }
                /**
                 * Implements the arcsin based mapping function.
                 * @param input a numebr to map, clipped to 0 to 1 inclusive
                 * @return a 0-1 inclusive mappign result
                 * @method
                 */
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
            /**
             * This is a sprite that draws left justified text at its origin.
             * @TODO: This is VERY preliminary and has a  number of limitations
             * @TODO:  Needs individually settbale font parameters
             * @TODO:  Currently  only uses position of Transform, doesnt play very will with the rest of the system
             * @TODO: Supporting code in Graphics2D probably needs a complete re-write to use sprite glyphs rather then
             * @TODO: canvas text
             */
            TextSprite = class TextSprite {
                /**
                 * This creates a TextSprite that renders the passed in string
                 * @param g2d the Graphics2D that will be used to render the TextSprite
                 * @param text an initialtext to render, may be reset with Text =
                 */
                constructor(g2d, text) {
                    /**
                     * Transform to transform the text. Currently only Translation is supported in Graphics2D
                     */
                    this.Transform = new Matrix2D_4.default();
                    this.g2d = g2d;
                    if (text == undefined) {
                        this.Text = "Ipsum lorum";
                    }
                    this.Text = text;
                }
                /**
                 * The height of the text as returned by Graphics2D and cached locally
                 * @property
                 */
                get Height() {
                    return this.textSize.Y;
                }
                /**
                 * The width of the text as returned by Graphics2D and cached locally
                 * @property
                 */
                get Width() {
                    return this.textSize.X;
                }
                /**
                 * The string of text to render
                 * @property
                 */
                get Text() {
                    return this.text;
                }
                /**
                 * Sets the text to be rendered.
                 * It is important that ALL code that sets the text use this entyr point because it also
                 * recalculates the text dimensions
                 * @param t a string to render
                 * @property
                 */
                set Text(t) {
                    this.text = t;
                    this.textSize = this.g2d.GetTextSize(this.text);
                }
                /**
                 * This is called by the Graphics2D to render the sprite
                 * @param g2d
                 * @method
                 */
                Render(g2d) {
                    g2d.DrawText(this.Text, this.Transform);
                }
                /***
                 * A null update because a SimpleImageSprite has no behavior other then rendering
                 * @param msDelta
                 * @method
                 */
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
            /***
             * This is a simple extension of texSprite that draws the text with a centered origin
             * @class
             */
            AutocenterTextSprite = class AutocenterTextSprite extends TextSprite_1.default {
                /**
                 * Renders text centered on origin
                 * @param g2d the Graphics2d to use for rendering
                 * @method
                 */
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
                wheel = new AcceleratingSpinningSprite_1.default(img);
                drawList[0] = wheel;
                AssetLoaded();
            }, ImageLoadFailed);
            LoadImage("apps/assets/Arrow.png", (img) => {
                arrow = new SimpleImageSprite_5.default(img);
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
System.register("apps/System/tests/UnitTest1", ["assert", "apps/System/Matrix2D", "apps/System/Vector2"], function (exports_17, context_17) {
    "use strict";
    var assert_1, Matrix2D_6, Vector2_8;
    var __moduleName = context_17 && context_17.id;
    //Matrix2D tests
    function Matrix2DIdentityTest() {
        let m2d = new Matrix2D_6.default();
        assert_1.default.equal(m2d.IsIdentity(), true, "Identity matrixx created and tested");
    }
    exports_17("Matrix2DIdentityTest", Matrix2DIdentityTest);
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
    exports_17("VecDotUnitTest", VecDotUnitTest);
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