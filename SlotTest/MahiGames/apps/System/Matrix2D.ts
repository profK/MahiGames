import Vector2 from "./Vector2";


export default class Matrix2D {
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

  public Scale(mult: Vector2): Matrix2D {
    return this.Dot(new Matrix2D([
      [mult.X, 0, 0],
      [0, mult.Y, 0],
      [0, 0, 1]
    ]));
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
        let v2: Vector2 = new Vector2(1,0);
        // remeber that matrix access is [row][position], which means [y][x], and idexes are zero based
        v2.X = this.values[0].reduce((sum, v, k) => sum + (v * vec.values[k]), 0);
        v2.Y = this.values[1].reduce((sum, v, k) => sum + (v * vec.values[k]), 0);
        v2.W = this.values[2].reduce((sum, v, k) => sum + (v * vec.values[k]), 0);
        return v2;
    }
}

