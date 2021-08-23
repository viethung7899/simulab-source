export class Vector2D {
  public x: number;
  public y: number;

  constructor(x: number = 0, y: number = x) {
    this.x = x;
    this.y = y;
  }

  add(v: Vector2D) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v: Vector2D) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  clone() {
    return new Vector2D(this.x, this.y);
  }

  multiply(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  lengthSquare() {
    return this.x * this.x + this.y + this.y;
  }

  normalize() {
    const ls = this.lengthSquare();
    if (ls == 0) return this;
    else return this.multiply(1.0 / Math.sqrt(ls));
  }

  clamp(maxLen: number) {
    const ls = this.lengthSquare();
    if (ls > maxLen * maxLen) return this.multiply(1.0 /Math.sqrt(ls) * maxLen);
    return this;
  }

  distanceTo(v: Vector2D) {
    return Math.sqrt((this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y));
  }

  angle() {
    if (this.x === 0 && this.y > 0) return Math.PI / 2;
    if (this.x === 0 && this.y < 0) return -Math.PI / 2;
    let a = Math.atan(this.y / this.x);
    if (this.x < 0) a += Math.PI;
    return a;
  }
}