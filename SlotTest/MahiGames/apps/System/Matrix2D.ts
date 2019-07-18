import Vector2 from "./Vector2";


export default class Matrix2D {

  Clone(): Matrix2D {
    return new Matrix2D(this.values);
  }

  private values: number[][];

  constructor(init?: number[][]) {

    if (init != undefined) {
      // this clones a 2D array
      this.values = init.map(row => {
        return row.map(element => {
          return element;
        });
      });
    } else {
      this.values = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
    }

  }

  public IsIdentity(): Boolean {
    for (let y = 0; y < this.values.length; y++) {
      for (let x = 0; x < this.values[y].length; x++) {
        if (x == y) {
          if (this.values[y][x] != 1) {
            return false;
          }
        } else {
          if (this.values[y][x] != 0) {
            return false;
          }
        }

      }
    }
    return true;
  }


  public Translate(delta: Vector2): Matrix2D {
    return this.Dot(new Matrix2D([
      [1, 0, delta.X],
      [0, 1, delta.Y],
      [0, 0, 1]
    ]));
  }

  public Rotate(radians: number): Matrix2D {
    return this.Dot(new Matrix2D([
      [Math.cos(radians), -Math.sin(radians), 0],
      [Math.sin(radians), Math.cos(radians), 0],
      [0, 0, 1]
    ]));
  }

  public Invert():Matrix2D {
    return new Matrix2D(matrix_invert(this.values));
  }

  public Scale(mult: Vector2): Matrix2D {
    return this.Dot(new Matrix2D([
      [mult.X, 0, 0],
      [0, mult.Y, 0],
      [0, 0, 1]
    ]));
  }

  public GetRotation():number {
    let centroid = this.DotVec(new Vector2(0,0));
    // move xform abck to the origina
    let rotOnly:Matrix2D = this.Translate(new Vector2(-centroid.X,-centroid.Y)) ;
    let unitVec = rotOnly.DotVec(new Vector2(1,0));
    unitVec = unitVec.Normalized(); // cancel out any scaling
    // x is opp, y = adjacent tan=opp/adjacent
    let rads = Math.atan2(unitVec.Y,unitVec.X);
    if (rads<0) {  // cpnvrt to 0 to 2PI
      rads = rads + (Math.PI*2);
    }
    return rads;
  }

  public Dot(other: Matrix2D): Matrix2D {
    let result: number[][] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    result = result.map((row, i) => {
      return row.map((val, j) => {
        return other.values[i].reduce((sum, elm, k) => sum + (elm * this.values[k][j]), 0)
      })
    })
    return new Matrix2D(result);
  }

  public DotVec(vec: Vector2): Vector2 {
    let v2: Vector2 = new Vector2(1, 0);
    // remeber that matrix access is [row][position], which means [y][x], and idexes are zero based
    v2.X = this.values[0].reduce((sum, v, k) => sum + (v * vec.values[k]), 0);
    v2.Y = this.values[1].reduce((sum, v, k) => sum + (v * vec.values[k]), 0);
    v2.W = this.values[2].reduce((sum, v, k) => sum + (v * vec.values[k]), 0);
    return v2;
  }

  public SetContextTransform(ctx: CanvasRenderingContext2D) {
    let v = this.values; //convenience
    ctx.setTransform(v[0][0], v[1][0], v[0][1], v[1][1], v[0][2], v[1][2]);
  }
}


    ///This code is NOT my work.  But honestly, this is just math and anyone with half a brain
  /// looks it up hwne needed rathre then reinventing the wheel
  /// In this cas the author is Andrew Ippoliti,  http://blog.acipo.com/matrix-inversion-in-javascript/

  function matrix_invert(M){
    // I use Guassian Elimination to calculate the inverse:
    // (1) 'augment' the matrix (left) by the identity (on the right)
    // (2) Turn the matrix on the left into the identity by elemetry row ops
    // (3) The matrix on the right is the inverse (was the identity matrix)
    // There are 3 elemtary row ops: (I combine b and c in my code)
    // (a) Swap 2 rows
    // (b) Multiply a row by a scalar
    // (c) Add 2 rows

    //if the matrix isn't square: exit (error)
    if(M.length !== M[0].length){return;}

    //create the identity matrix (I), and a copy (C) of the original
    var i=0, ii=0, j=0, dim=M.length, e=0, t=0;
    var I = [], C = [];
    for(i=0; i<dim; i+=1){
      // Create the row
      I[I.length]=[];
      C[C.length]=[];
      for(j=0; j<dim; j+=1){

        //if we're on the diagonal, put a 1 (for identity)
        if(i==j){ I[i][j] = 1; }
        else{ I[i][j] = 0; }

        // Also, make the copy of the original
        C[i][j] = M[i][j];
      }
    }

    // Perform elementary row operations
    for(i=0; i<dim; i+=1){
      // get the element e on the diagonal
      e = C[i][i];

      // if we have a 0 on the diagonal (we'll need to swap with a lower row)
      if(e==0){
        //look through every row below the i'th row
        for(ii=i+1; ii<dim; ii+=1){
          //if the ii'th row has a non-0 in the i'th col
          if(C[ii][i] != 0){
            //it would make the diagonal have a non-0 so swap it
            for(j=0; j<dim; j++){
              e = C[i][j];       //temp store i'th row
              C[i][j] = C[ii][j];//replace i'th row by ii'th
              C[ii][j] = e;      //repace ii'th by temp
              e = I[i][j];       //temp store i'th row
              I[i][j] = I[ii][j];//replace i'th row by ii'th
              I[ii][j] = e;      //repace ii'th by temp
            }
            //don't bother checking other rows since we've swapped
            break;
          }
        }
        //get the new diagonal
        e = C[i][i];
        //if it's still 0, not invertable (error)
        if(e==0){return}
      }

      // Scale this row down by e (so we have a 1 on the diagonal)
      for(j=0; j<dim; j++){
        C[i][j] = C[i][j]/e; //apply to original matrix
        I[i][j] = I[i][j]/e; //apply to identity
      }

      // Subtract this row (scaled appropriately for each row) from ALL of
      // the other rows so that there will be 0's in this column in the
      // rows above and below this one
      for(ii=0; ii<dim; ii++){
        // Only apply to other rows (we want a 1 on the diagonal)
        if(ii==i){continue;}

        // We want to change this element to 0
        e = C[ii][i];

        // Subtract (the row above(or below) scaled by e) from (the
        // current row) but start at the i'th column and assume all the
        // stuff left of diagonal is 0 (which it should be if we made this
        // algorithm correctly)
        for(j=0; j<dim; j++){
          C[ii][j] -= e*C[i][j]; //apply to original matrix
          I[ii][j] -= e*I[i][j]; //apply to identity
        }
      }
    }

    //we've done all operations, C should be the identity
    //matrix I should be the inverse:
    return I;
  }




