import { Application } from '@pixi/app';
import { Container } from '@pixi/display';
import { Filter } from '@pixi/core';

const STEP = 1;
const ZOOM_MAX = 100;
const ZOOM_MIN = 0.0000001;

const KEY = {
  ARROW_LEFT: 'ArrowLeft',
  ARROW_UP: 'ArrowUp',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_DOWN: 'ArrowDown',

  ZOOM_IN: 'i',
  ZOOM_OUT: 'o',
};

export class Display {
  private _translate: Float32Array;
  private _zoom: number;

  private _display: Container;

  constructor(app: Application) {
    // Init parameters
    this._translate = new Float32Array([0, 0]);
    this._zoom = 1;

    // Initialize display
    this._display = new Container();
    app.stage.addChild(this._display);
    this._display.filterArea = app.renderer.screen;
  }

  reset() {
    this._translate[0] = 0;
    this._translate[1] = 0;
    this._zoom = 1;
  }

  setFilter(filter: Filter) {
    this._display.filters = [filter];
  }

  get translate() {
    return this._translate;
  }


  get zoom() {
    return this._zoom;
  }

  getCoord(x: number, y: number, ratio: number) {
    x -= 0.5;
    y -= 0.5;
    if (ratio > 1) x *= ratio;
    else y /= ratio;

    x *= (4 / this.zoom);
    y *= (4 / this.zoom);

    x += this.translate[0];
    y += this.translate[1];

    return [x, y];
  }

  handleKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case KEY.ARROW_LEFT:
        this._moveLeft();
        break;
      case KEY.ARROW_UP:
        this._moveUp();
        break;
      case KEY.ARROW_RIGHT:
        this._moveRight();
        break;
      case KEY.ARROW_DOWN:
        this._moveDown();
        break;
      case KEY.ZOOM_IN:
        this._zoomIn();
        break;
      case KEY.ZOOM_OUT:
        this._zoomOut();
        break;
    }
  }

  private _moveLeft() {
    this._translate[0] += STEP / this._zoom;
  }

  private _moveRight() {
    this._translate[0] -= STEP / this._zoom;
  }

  private _moveUp() {
    this._translate[1] -= STEP / this._zoom;
  }

  private _moveDown() {
    this._translate[1] += STEP / this._zoom;
  }

  private _zoomIn() {
    if (this._zoom >= ZOOM_MAX) return;
    if (this._zoom < 1) this._zoom /= 0.9;
    else this._zoom += STEP;
  }

  private _zoomOut() {
    if (this._zoom <= ZOOM_MIN) return;
    if (this._zoom <= 1) this._zoom *= 0.9;
    else this._zoom -= STEP;
  }
}
