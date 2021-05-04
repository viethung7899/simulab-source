import { Graphics } from '@pixi/graphics';
import Vector2D from '../utils/Vector';

class Particle extends Graphics {
  radius: number;
  color: number = 0xffffff;
  velocity: Vector2D;
  index: number;

  static counter = 0;

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
    this.index = Particle.counter;
    Particle.counter++;
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

  updateVeclocity(velocity: Vector2D) {
    this.velocity = velocity;
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

export const collisionHandling2Particles = (p1: Particle, p2: Particle) => {
  if (p1.index >= p2.index) return;
  const p1p2 = new Vector2D(p1.x - p2.x, p1.y - p2.y);
  const distSquare = p1p2.dotProduct(p1p2);
  const collide = p1.radius + p2.radius - Math.sqrt(distSquare) >= 0;

  // console.log(collide);

  if (collide) {
    const v1v2 = new Vector2D(
      p1.velocity.x - p2.velocity.x,
      p1.velocity.y - p2.velocity.y,
    );
    const coeff =
      (2 * v1v2.dotProduct(p1p2)) /
      p1p2.dotProduct(p1p2) /
      (p1.radius + p2.radius);

    const v1_ = p1p2
      .clone()
      .mult(-p2.radius * coeff)
      .add(p1.velocity);
    const v2_ = p1p2
      .clone()
      .mult(p1.radius * coeff)
      .add(p2.velocity);

    

    p1.updateVeclocity(v1_);
    p2.updateVeclocity(v2_);
  }
};

export default Particle;
