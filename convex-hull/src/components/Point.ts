import { rgb2hex } from '@pixi/utils';
import { Application, Container, Graphics } from 'pixi.js';
import { controller } from './Controller';

export class Point {
  private _x: number;
  private _y: number;
  private _shape: Graphics;

  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
    this._shape = newGraphic(x, y);
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
}

function newGraphic(x: number, y: number) {
  const shape = new Graphics();
  const color = rgb2hex([Math.random(), 0, Math.random()]);
  shape.x = x;
  shape.y = y;
  shape.beginFill(color).drawCircle(0, 0, 8).endFill();
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
