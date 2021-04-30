import { Point } from "@pixi/math";

class Vector2D extends Point {
  x: number;
  y: number;

  static random(length: number = 1) {
    const angle = Math.random() * Math.PI * 2;
    return new Vector2D(length * Math.cos(angle), length * Math.sin(angle));
  }
}

export default Vector2D;