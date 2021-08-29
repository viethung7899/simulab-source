import { rgb2hex } from '@pixi/utils';
import { Application, Container, Graphics } from 'pixi.js';
import { controller } from './Controller';

export class Point {
  private _x: number;
  private _y: number;
  private _color: number;
  private _shape: Graphics;

  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
    this._shape = newGraphic(x, y);
    this._color = this._shape.tint;
  }

  show(container: Container) {
    container.addChild(this._shape);
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  updateColor(color: number) {
    this._shape.tint = color;
  }

  resetColor() {
    this._shape.tint = this._color;
  }
}

function newGraphic(x: number, y: number) {
  const shape = new Graphics();
  const r = Math.random();
  const color = rgb2hex([r, 0, 1 - r]);
  shape.x = x;
  shape.y = y;
  shape.beginFill(0xffffff).drawCircle(0, 0, 8).endFill();
  shape.tint = color;
  return shape;
}

export class PointRenderer {
  public points: Point[];
  public _container: Container;
  public _app: Application;

  constructor(app: Application) {
    this.points = [];
    this._app = app;
    this._container = new Container();
    this._container.zIndex = 2;
    app.stage.addChild(this._container);
    app.view.addEventListener('click', this._onMouseClick());
  }

  addPoint(x: number, y: number) {
    const point = new Point(x, y);
    point.show(this._container);
    this.points.push(point);
    return point;
  }

  reset() {
    this.points.forEach(p => p.resetColor());
  }

  clearAll() {
    this.points = [];
    this._container.removeChildren(0);
  }

  private _onMouseClick() {
    const renderer = this;
    return (e: MouseEvent) => {
      if (controller.isPlaying) return;
      const { left, top } = (e.target as Element).getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      renderer.addPoint(x, y);
    };
  }
}
