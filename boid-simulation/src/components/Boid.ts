import { Container, Graphics, Rectangle } from 'pixi.js';
import { Entity, SpatialHashGrid } from '../utils/SpatialHashGrid';
import { Vector2D } from '../utils/Vector2D';
import { controller } from './Controller';

const boidCoord = [10, 0, -5, -5, -5, 5];
const BORDER = 40;
const SPEED = 2.5;
const FORCE = 0.05;
const MIN_MULT = 3;
const MAX_MULT = 4;

export function random_range(a: number, b: number) {
  return Math.random() * (b - a) + a;
}

export class Boid extends Entity {
  private _velocity: Vector2D;
  private _direction: Vector2D;
  private _shape: Graphics;

  private _wanderAngle: number;

  private _maxSpeed: number;
  private _maxSteeringForce: number;

  private _grid: SpatialHashGrid<Boid>;

  constructor(x: number = 0, y: number = x, grid: SpatialHashGrid<Boid>) {
    super(x, y);
    this._grid = grid;

    // Random velocity
    const a = random_range(0, 2 * Math.PI);
    this._velocity = new Vector2D(2 * Math.cos(a), 2 * Math.sin(a));
    this._direction = this._velocity.clone().multiply(0.5);

    // Random force and speed limits
    const mult = random_range(MIN_MULT, MAX_MULT);
    this._maxSpeed = SPEED * mult;
    this._maxSteeringForce = FORCE * mult;
    this._wanderAngle = 0;

    // Make the shape
    const shape = new Graphics();
    shape.beginFill(0xffffff).drawPolygon(boidCoord).endFill();
    shape.x = x;
    shape.y = y;
    shape.zIndex = 5;
    // console.log(this._direction.x, this._direction.y, this._direction.angle());
    shape.rotation = this._direction.angle();

    // // Add interaction
    // shape.interactive = true; shape.buttonMode = true;
    // shape.on('pointerdown', () => {
    //   const clicked = shape.tint === 0xffff00;
    //   shape.tint = clicked ? shape.tint : 0xffff00;
    // })
    this._shape = shape;
  }

  get shape() {
    return this._shape;
  }

  get direction() {
    return this._direction;
  }

  addTo(container: Container) {
    container.addChild(this._shape);
  }

  _applySteering() {
    const steeringForce = new Vector2D();
    const locals = this._findNearBy();
    steeringForce
      .add(this._applyWandering())
      .add(this._applyAlignment(locals))
      .add(this._applyCohesion(locals))
      .add(this._applySeparation(locals))
      .clamp(this._maxSteeringForce);
    this._velocity.add(steeringForce).clamp(this._maxSpeed);

    this._direction = this._velocity.clone().normalize();

    // if (!isNaN(this._direction.x)) {
    //   console.log(this._direction);
    // }
  }

  _findNearBy() {
    const radius = controller.get('view-radius');
    const locals: Boid[] = [];

    const clients = this._grid.findNearBy(this.position, radius * 2);
    clients.forEach((client) => {
      if (client.entity != this && onViewField(this, client.entity)) {
        locals.push(client.entity);
      }
    });

    return locals;
  }

  update(dt: number, container: Rectangle) {
    this._applySteering();

    // Displacement
    const displacement = this._velocity.clone().multiply(dt);
    const position = this._position;
    // console.log('Before', position.x, position.y);
    position.add(displacement);

    // Boundary
    const { x, y, width, height } = container;
    const direction = this._direction;

    if (direction.x < 0 && position.x < x - BORDER)
      position.x = x + width + BORDER;
    if (direction.x > 0 && position.x > x + width + BORDER)
      position.x = x - BORDER;
    if (direction.y < 0 && position.y < y - BORDER)
      position.y = y + height + BORDER;
    if (direction.y > 0 && position.y > y + height + BORDER)
      position.y = y - BORDER;

    // Shape displacement
    this._shape.x = position.x;
    this._shape.y = position.y;
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
    return disredDirction.normalize().multiply(controller.get('cohesion'));
  }

  // Move align with average direction of the locals
  _applyAlignment(locals: Boid[]) {
    const force = new Vector2D();
    for (let boid of locals) {
      force.add(boid._direction);
    }

    return force.normalize().multiply(controller.get('alignment'));
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
          .multiply(controller.get('separation') / distanceToBoid),
      );
    }
    return force;
  }

  _applyWandering() {
    this._wanderAngle += 0.2 * random_range(-Math.PI, Math.PI);
    const wanderDirection = new Vector2D(
      Math.cos(this._wanderAngle),
      Math.sin(this._wanderAngle),
    );
    const force = this._direction
      .clone()
      .multiply(2)
      .add(wanderDirection)
      .normalize()
      .multiply(controller.get('wandering'));
    return force;
  }
}

function onViewField(boid: Boid, other: Boid) {
  const diff = other.position.clone().sub(boid.position);
  const onViewRadius =
    Math.sqrt(diff.lengthSquare()) <= controller.get('view-radius');
  diff.normalize();
  const cosine = boid.direction.x * diff.x + boid.direction.y * diff.y;
  let angle = 0; // in degree
  if (cosine <= -1) angle = 180;
  if (cosine < 1) angle = (Math.acos(cosine) / Math.PI) * 180;
  const onViewAngle = angle < controller.get('view-angle') / 2;
  return onViewRadius && onViewAngle;
}
