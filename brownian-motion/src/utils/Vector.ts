import { Point } from "@pixi/math";

class Vector2D extends Point {
  x: number;
  y: number;

  static random(length: number = 1) {
    const angle = Math.random() * Math.PI * 2;
    return new Vector2D(length * Math.cos(angle), length * Math.sin(angle));
  }

  add(p: Vector2D) {
    this.x += p.x;
    this.y += p.y;
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

  dotProduct(p: Vector2D) {
    return this.x * p.x + this.y * p.y;
  }

  static multiply(p: Vector2D, scalar: number) {
    return new Vector2D(p.x * scalar, p.y * scalar);
  }
}

export default Vector2D;