import { Graphics } from '@pixi/graphics';
import Vector2D from '../utils/Vector';

export class Seed extends Graphics {
  velocity: Vector2D;

  constructor(x = 200, y = x, initialVelocity = 1) {
    super();
    this.x = x;
    this.y = y;
    this.velocity = Vector2D.random(initialVelocity);
    this.draw();
  }

  draw() {
    this.lineStyle({
      width: 0,
    });
    this.beginFill(0xe5ffde);
    this.drawCircle(0, 0, 4);
    this.endFill();
  }

  move(delta: number, force?: Vector2D) {
    if (force) {
      this.velocity.add(force.mult(delta));
    }

    this.x += this.velocity.x * delta;
    this.y += this.velocity.y * delta;
  }
}
