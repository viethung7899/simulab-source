import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { rgb2hex } from '@pixi/utils';

export default class Ball {
  public angle: number;
  public angularVelocity: number;
  public length = 100;
  public mass = 1;
  private _graphic: Graphics;

  constructor() {
    this.angle = Math.PI / 2;
    this.angularVelocity = 0;
    this._graphic = this._initBall();
  }

  show(container: Container) {
    container.addChild(this._graphic);
  }

  delete(container: Container) {
    container.removeChild(this._graphic);
  }

  updatePosition(x: number, y: number) {
    this._graphic.x = x;
    this._graphic.y = y;
  }

  private _initBall() {
    const shape = new Graphics();
    shape.beginFill(0xffffff).drawCircle(0, 0, 10).endFill();
    shape.tint = rgb2hex([Math.random(), Math.random(), Math.random()]);
    return shape;
  }

  get graphic() {
    return this._graphic;
  }
}
