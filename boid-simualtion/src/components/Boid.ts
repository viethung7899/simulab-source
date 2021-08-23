import { Container, Graphics, Rectangle } from 'pixi.js';
import { Vector2D } from '../utils/Vector2D';

const boidCoord = [10, 0, -5, -5, -5, 5];

const BORDER = 40;
const _BOID_FORCE_ALIGNMENT = 10;
const _BOID_FORCE_SEPARATION = 20;
const _BOID_FORCE_COHESION = 10;
const _BOID_FORCE_WANDER = 3;

function random_range(a: number, b: number) {
  return Math.random() * (b - a) + a;
}

export class Boid {
  private _position: Vector2D;
  private _velocity: Vector2D;
  private _direction: Vector2D;
  private _shape: Graphics;

  private _wanderAngle: number;

  private _maxSpeed: number;
  private _maxSteeringForce: number;

  constructor(x: number = 0, y: number = x) {
    this._position = new Vector2D(x, y);

    // Random velocity
    this._wanderAngle = 0;

    // Make the shape
    const shape = new Graphics();
    shape.beginFill(0xffffff).drawPolygon(boidCoord).endFill();
    shape.x = x;
    shape.y = y;
    this._shape = shape;
  }

  addTo(container: Container) {
    container.addChild(this._shape);
  }

  _applySteering(locals: Boid[]) {
    const steeringForce = new Vector2D();
    steeringForce
      .add(this._applyWandering())
      .add(this._applyAlignment(locals))
      .add(this._applyCohesion(locals))
      .add(this._applySeparation(locals))
      .clamp(this._maxSteeringForce);
    this._velocity.add(steeringForce).clamp(this._maxSpeed);

    this._direction = this._velocity.clone().normalize();
  }

  update(locals: Boid[], dt: number, container: Rectangle) {
    this._applySteering(locals);

    // Displacement
    const displacement = this._velocity.clone().multiply(dt);
    this._position.add(displacement);

    // Boundary
    const { x, y, width, height } = container;
    const direction = this._direction;
    const position = this._position;
    if (
      (direction.x < 0 && position.x < x - BORDER) ||
      (direction.x > 0 && position.x > x + width + BORDER)
    )
      position.x = -position.x;

    if (
      (direction.y < 0 && position.y < y - BORDER) ||
      (direction.y > 0 && position.y > y + height + BORDER)
    )
      position.y = -position.y;

    // Rotation
    this._shape.rotation = this._direction.angle();
  }

  // Move towards the average position of the locals
  _applyCohesion(locals: Boid[]) {
    if (locals.length === 0) return new Vector2D();

    const averagePostion = new Vector2D();
    for (let boid of locals) {
      averagePostion.add(boid._position);
    }
    averagePostion.multiply(1.0 / locals.length);

    const disredDirction = averagePostion.clone().sub(this._position);
    return disredDirction.normalize().multiply(_BOID_FORCE_COHESION);
  }

  // Move align with average direction of the locals
  _applyAlignment(locals: Boid[]) {
    const force = new Vector2D();
    for (let boid of locals) {
      force.add(boid._direction);
    }

    return force.normalize().multiply(_BOID_FORCE_ALIGNMENT);
  }

  _applySeparation(locals: Boid[]) {
    const force = new Vector2D();
    if (locals.length == 0) return force;
    for (let boid of locals) {
      let distanceToBoid = this._position.distanceTo(boid._position);
      distanceToBoid = Math.max(distanceToBoid, 0.001);
      const directionToBoid = this._position.clone().sub(boid._position);
      force.add(
        directionToBoid
          .normalize()
          .multiply(_BOID_FORCE_SEPARATION / distanceToBoid),
      );
    }
    return force;
  }

  _applyWandering() {
    this._wanderAngle += 0.1 * random_range(-2 * Math.PI, 2 * Math.PI);
    const wanderDirection = new Vector2D(
      Math.cos(this._wanderAngle),
      Math.sin(this._wanderAngle),
    );
    const force = this._direction
      .clone()
      .multiply(2)
      .add(wanderDirection)
      .normalize()
      .multiply(_BOID_FORCE_WANDER);
    return force;
  }
}
