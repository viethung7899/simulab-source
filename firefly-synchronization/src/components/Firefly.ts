import { Container, Graphics, Rectangle } from 'pixi.js';
import { Entity, SpatialHashGrid } from '../utils/SpatialHashGrid';
import { Vector2D } from '../utils/Vector2D';
import { controller } from './Controller';

const BORDER = 40;
const SPEED = 1;
const FORCE = 0.1;
const MIN_MULT = 3;
const MAX_MULT = 4;
const RADIUS = 5;

type FireFlyShape = {
  shape: Graphics;
  outline: Graphics;
};

export class Firefly extends Entity {
  private _graphic: FireFlyShape;

  private _velocity: Vector2D;
  private _direction: Vector2D;

  private _maxSpeed: number;
  private _maxSteeringForce: number;
  private _wanderAngle = 0;

  private _clock: number;

  private _grid: SpatialHashGrid<Firefly>;

  constructor(x: number, y: number, grid: SpatialHashGrid<Firefly>) {
    super(x, y);

    // Random velocity
    const a = random_range(0, 2 * Math.PI);
    this._velocity = new Vector2D(2 * Math.cos(a), 2 * Math.sin(a));
    this._direction = this._velocity.clone().multiply(0.5);

    // Random force and speed limits
    const mult = random_range(MIN_MULT, MAX_MULT);
    this._maxSpeed = SPEED * mult;
    this._maxSteeringForce = FORCE * mult;
    this._wanderAngle = 0;

    // Random clock position
    this._clock = Math.random();

    // Make graphic
    this._graphic = newGraphic(x, y);

    this._grid = grid;
  }

  get graphic(): FireFlyShape {
    return this._graphic;
  }

  showOn(container: Container) {
    container.addChild(this._graphic.shape, this._graphic.outline);
  }

  remove(container: Container) {
    container.removeChild(this._graphic.shape, this._graphic.outline);
  }

  _findBearBy() {
    const radius = RADIUS * 10;
    const locals: Firefly[] = [];

    const clients = this._grid.findNearBy(this.position, radius * 2);
    clients.forEach((client) => {
      if (
        client.entity != this &&
        client.entity.position.distanceTo(this.position) <
          controller.params.get('view-radius')
      ) {
        locals.push(client.entity);
      }
    });

    return locals;
  }

  _applyMoving(delta: number, container: Rectangle) {
    this._steer();

    // Displacement
    const displacement = this._velocity.clone().multiply(delta);
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
    this._graphic.shape.x = position.x;
    this._graphic.shape.y = position.y;
    this._graphic.outline.x = position.x;
    this._graphic.outline.y = position.y;
  }

  _applyLighting(delta: number) {
    this._clock += (delta / 10) * controller.params.get('clock-speed');
    this._graphic.shape.alpha *= 0.9;

    if (this._clock > 1) {
      // Flash!
      this._graphic.shape.alpha = 1;
      this._clock = 0;

      if (!controller.sync) return;
      const neighbors = this._findBearBy();
      neighbors.forEach((ff) => {
        ff._clock *= 1 + controller.params.get('sync-coeff');
        if (ff._clock > 1) ff._clock = 1;
      });
    }
  }

  update(delta: number, container: Rectangle) {
    this._applyMoving(delta, container);
    this._applyLighting(delta);
  }

  _steer() {
    const steeringForce = this._applyWandering().clamp(this._maxSteeringForce);
    this._velocity.add(steeringForce).clamp(this._maxSpeed);
    this._direction = this._velocity.clone().normalize();
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
      .multiply(3);
    return force;
  }
}

function newGraphic(x: number, y: number): FireFlyShape {
  const shape = new Graphics();
  shape.beginFill(0xffff00).drawCircle(0, 0, RADIUS).endFill();
  shape.x = x;
  shape.y = y;
  shape.alpha = 0;

  const outline = new Graphics();
  outline.lineStyle(1, 0xffffff, 0.5);
  outline.beginFill(0, 0).drawCircle(0, 0, RADIUS).endFill();
  outline.x = x;
  outline.y = y;
  return { shape, outline };
}

export function random_range(a: number, b: number) {
  return Math.random() * (b - a) + a;
}
