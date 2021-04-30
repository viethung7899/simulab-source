import { Graphics } from '@pixi/graphics';
import Vector2D from '../utils/Vector';

class Particle extends Graphics {
  radius: number;
  color: number = 0xffffff;
  velocity: Vector2D;

  constructor(
    x: number = 200,
    y: number = 200,
    radius: number = 200,
    moveRandom: boolean = false,
  ) {
    super();
    this.x = x;
    this.y = y;
    this.radius = radius;
    if (moveRandom) {
      const speed = Math.random() * 50 + 50;
      this.velocity = Vector2D.random(speed);
    } else {
      this.velocity = new Vector2D();
    }
  }

  setColor(_color: number) {
    this.color = _color;
  }

  draw(alpha: number = 0) {
    this.lineStyle({
      width: alpha,
      color: 0xffffff,
    });
    this.beginFill(this.color);
    this.drawCircle(0, 0, this.radius);
    this.endFill();
  }

  move(dT: number) {
    // Move
    this.x += this.velocity.x * dT;
    this.y += this.velocity.y * dT;

    // Bounce
    const { innerWidth, innerHeight } = window;
    if (
      (this.x <= this.radius && this.velocity.x < 0) ||
      (this.x >= innerWidth - this.radius && this.velocity.x > 0)
    ) {
      this.velocity.x *= -1;
    }

    if (
      (this.y <= this.radius && this.velocity.y < 0) ||
      (this.y >= innerHeight - this.radius && this.velocity.y > 0)
    ) {
      this.velocity.y *= -1;
    }
  }
}

export default Particle;
