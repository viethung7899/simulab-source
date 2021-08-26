import { Container, Sprite, Texture } from 'pixi.js';
import { Entity } from '../utils/SpatialHashGrid';
import { Vector2D } from '../utils/Vector2D';

const SPEED = 2.5;
const FORCE = 0.05;
const MIN_MULT = 3;
const MAX_MULT = 4;

export class Firefly extends Entity {
  private _direction: Vector2D;
  private _graphic: Sprite;

  private _angle: number;
  private _angleV: number;

  constructor(x: number, y: number) {
    super(x, y);
    this._graphic = newGraphic(x, y);
    this._graphic.texture = Texture.WHITE;;

    this._angle = 0;
    this._angleV = 0.0001;
  }

  showOn(container: Container) {
    container.addChild(this._graphic);
  }
}

function newGraphic(x: number, y: number) {
  const bug = Sprite.from('/assets/bug-solid.svg');
  bug.width = 20;
  bug.height = 20;
  bug.angle = 90;
  bug.anchor.set(0.5);
  bug.x = x;
  bug.y = y;
  return bug;
}

// Phase in randians
// [-pi, pi] -> [0, 1]
function phaseToAlpha(phase: number) {
  const x = Math.abs(phase / Math.PI);
  if (x >= 0.5) return 0;
  if (x > 0) return Math.exp(-30 * x);
}
