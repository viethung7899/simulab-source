export default class Vector2D {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = x) {
    this.x = x;
    this.y = y;
  }

  static random(length: number = 1) {
    const angle = Math.random() * Math.PI * 2;
    return new Vector2D(length * Math.cos(angle), length * Math.sin(angle));
  }

  add(p: Vector2D) {
    this.x += p.x;
    this.y += p.y;
    return this;
  }

  sub(p: Vector2D) {
    this.x -= p.x;
    this.y -= p.y;
    return this;
  }

  mult(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  clone() {
    return new Vector2D(this.x, this.y);
  }

  lengthSquared() {
    return this.x ** 2 + this.y ** 2;
  }

  length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  normalize() {
    const len = this.length();
    if (len !== 0) {
      this.mult(1 / len);
    }
  }

  setVector(x: number, y: number = x) {
    this.x = x;
    this.y = y;
  }
}