import { Graphics } from '@pixi/graphics';
import { Rectangle } from '@pixi/math';

interface Vector {
  x: number;
  y: number;
}

const RADIUS = 4;

export class Particle {
  private _position: Vector;
  private _velocity: Vector;

  private _graphics: Graphics;

  constructor(bound: Rectangle) {
    // Random position
    const { width, height } = bound;
    this._position = {
      x: Math.random() * width,
      y: Math.random() * height,
    };

    // Random velocity
    const speed = Math.random() * 3 + 1;
    const direction = Math.random() * 2 * Math.PI;
    this._velocity = {
      x: speed * Math.cos(direction),
      y: speed * Math.sin(direction),
    };

    this._graphics = new Graphics()
      .beginFill(0xffffff)
      .drawCircle(0, 0, RADIUS)
      .endFill();

    this._graphics.x = this._position.x;
    this._graphics.y = this._position.y;
  }

  get graphics() {
    return this._graphics;
  }

  move(bound: Rectangle, dT: number) {
    const { _position, _velocity } = this;
    _position.x += _velocity.x * dT;
    _position.y += _velocity.y * dT;
    this._edgeCollision(_position, _velocity, bound);

    // Update graphics
    this._graphics.x = _position.x;
    this._graphics.y = _position.y;
  }

  private _edgeCollision(position: Vector, velocity: Vector, bound: Rectangle) {
    const { width, height } = bound;
    if (
      (position.x < 0 && velocity.x < 0) ||
      (position.x > width && velocity.x > 0)
    )
      velocity.x *= -1;

    if (
      (position.y < 0 && velocity.y < 0) ||
      (position.y > height && velocity.y > 0)
    )
      velocity.y *= -1;
  }
}
