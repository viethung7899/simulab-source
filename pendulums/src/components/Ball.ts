import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { rgb2hex } from '@pixi/utils';

const MULT_MASS = 10;

export default class Ball {
  public angle: number;
  public angularVelocity: number;
  public length = 2;
  public mass = 1;
  private _graphic: Graphics;
  private _tint: number;

  constructor() {
    this.angle = Math.PI / 2;
    this.angularVelocity = 0;
    this._tint = rgb2hex([Math.random(), Math.random(), Math.random()]);
    this._graphic = new Graphics();
    this.updateGraphics();
  }

  show(container: Container) {
    container.addChild(this._graphic);
  }

  delete(container: Container) {
    container.removeChild(this._graphic);
  }

  updatePhase(angleChange: number, velocityChange: number) {
    this.angle += angleChange;
    this.angularVelocity += velocityChange;
  }

  updatePosition(x: number, y: number) {
    this._graphic.x = x;
    this._graphic.y = y;
  }

  updateGraphics() {
    this._graphic.clear().beginFill(0xffffff).drawCircle(0, 0, MULT_MASS * this.mass).endFill();
    this._graphic.tint = this._tint;
  }

  get graphic() {
    return this._graphic;
  }
}
