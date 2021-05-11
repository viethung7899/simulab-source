import { Graphics } from '@pixi/graphics';
import Vector2D from '../utils/Vector';

export class Seed extends Graphics {
  velocity: Vector2D;
  normalizedPosition: Vector2D; // The vector components is between [0, 1]

  rowIndex: number;
  colIndex: number;

  constructor(rowIndex: number, colIndex: number) {
    super();
    this.normalizedPosition = new Vector2D(0.5, 0.5);
    this.velocity = Vector2D.random();

    this.rowIndex = rowIndex;
    this.colIndex = colIndex;
  }

  updatePosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  draw() {
    this.lineStyle({
      width: 0,
    });
    this.beginFill(0xffffff);
    this.drawCircle(0, 0, 4);
    this.endFill();
  }

  move(delta: number, force?: Vector2D) {
    if (force) {
      this.velocity.add(force.mult(delta));
    }

    this.normalizedPosition.x += this.velocity.x * delta;
    this.normalizedPosition.y += this.velocity.y * delta;

    this._edgeCollision();
  }

  _edgeCollision() {
    if (this.normalizedPosition.x < 0 && this.velocity.x < 0 || this.normalizedPosition.x > 1 && this.velocity.x > 0) {
      this.velocity.x *= -1;
    }

    if (this.normalizedPosition.y < 0 && this.velocity.y < 0 || this.normalizedPosition.y > 1 && this.velocity.y > 0) {
      this.velocity.y *= -1;
    }
  }
}
