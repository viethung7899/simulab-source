import { Application, Container, Graphics } from 'pixi.js';
import { Point } from './Point';

export class Line {
  public p1: Point;
  public p2: Point;
  public graphic: Graphics;

  constructor(p1: Point, p2: Point) {
    this.p1 = p1;
    this.p2 = p2;

    const graphic = new Graphics();
    graphic.lineStyle(2, 0xffffff, 0.8).moveTo(p1.x, p1.y).lineTo(p2.x, p2.y);
    this.graphic = graphic;
  }

  updateColor(color: number) {
    this.graphic.tint = color;
  }
}

export class LineRenderer {
  private _renderer: Container;

  constructor(app: Application) {
    this._renderer = new Container();
    this._renderer.zIndex = 1;
    app.stage.addChild(this._renderer);
  }

  connect(p1: Point, p2: Point) {
    const line = new Line(p1, p2);
    this._renderer.addChild(line.graphic);
    return line;
  }

  clearAll() {
    this._renderer.removeChildren(0);
  }

  removeLine(line: Line) {
    this._renderer.removeChild(line.graphic);
  }
}
