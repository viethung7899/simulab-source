import { Graphics } from '@pixi/graphics';
import { DEG_TO_RAD, Rectangle } from '@pixi/math';

const inputD = document.querySelector<HTMLInputElement>('#d input');
const inputN = document.querySelector<HTMLInputElement>('#n input');

export class Maurer {
  private _n: number;
  private _d: number;

  private _graphics: Graphics;
  private _bound: Rectangle;

  constructor() {
    this._graphics = new Graphics();
  }

  setBound(bound: Rectangle) {
    this._bound = bound;
  }

  update() {
    this._graphics.clear().lineStyle(1, 0xffffff);
    this.draw();
  }

  draw() {
    // Get the origin
    const { width, height } = this._bound;
    this._graphics.x = width / 2;
    this._graphics.y = height / 2;

    // Radius is 90%
    const radius = Math.min(width, height) * 0.45;
    this._graphics.moveTo(0, 0);

    for (let i = 0; i <= 360; i++) {
      const theta = DEG_TO_RAD * i * this._d;
      const r = radius * Math.sin(this._n * theta);
      const x = -r * Math.cos(theta);
      const y = -r * Math.sin(theta);
      this._graphics.lineTo(x, y);
    }
  }

  set n(value: number) {
    this._n = value;
  }

  set d(value: number) {
    this._d = value;
  }

  get graphic() {
    return this._graphics;
  }
}

export function connectControllerToCanvas(maurer: Maurer) {
  maurer.d = +inputD.value;
  maurer.n = +inputN.value;
  maurer.update();

  inputD.oninput = () => {
    maurer.d = +inputD.value;
    maurer.update();
  };

  inputN.oninput = () => {
    maurer.n = +inputN.value;
    maurer.update();
  };
}
