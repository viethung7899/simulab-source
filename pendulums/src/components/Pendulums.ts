import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Rectangle } from '@pixi/math';
import Ball from './Ball';

export class Pendulums {
  private _container: Container;
  private _strings: Graphics;
  private _balls: Ball[];

  constructor() {
    this._container = new Container();

    this._strings = new Graphics();

    this._balls = [];

    this._init();
  }

  get container() {
    return this._container;
  }

  get balls() {
    return this._balls;
  }

  private _init() {
    this._container.addChild(this._strings);
    
    // Draw anchor
    const anchor = new Graphics()
      .beginFill(0xaaaaaa)
      .drawCircle(0, 0, 5)
      .endFill();
    console.log(anchor);
    this._container.addChild(anchor);

    // Draw string
  }

  updateOnResize(screen: Rectangle) {
    const { width, height } = screen;
    this._container.x = width / 2;
    this._container.y = height / 5;
  }

  // Add a ball to the system
  addBall() {
    const ball = new Ball();
    this._balls.push(ball);
    this._container.addChild(ball.graphic);
    this.update();
  }

  // Remove the last ball from the display
  removeBall() {
    if (this._balls.length > 0) {
      const ball = this._balls.pop();
      this._container.removeChild(ball.graphic);
      this._updateString();
    }
  }

  // Update the ball position
  private _updateBall() {
    let x = 0,
      y = 0;
    for (const ball of this._balls) {
      x += ball.length * Math.sin(ball.angle);
      y += ball.length * Math.cos(ball.angle);
      ball.updatePosition(x, y);
    }
  }

  // Update the ball position
  private _updateString() {
    this._strings.clear().lineStyle(3, 0xaaaaaa);
    this._strings.moveTo(0, 0);
    let x = 0,
      y = 0;
    for (const ball of this._balls) {
      x += ball.length * Math.sin(ball.angle);
      y += ball.length * Math.cos(ball.angle);
      this._strings.lineTo(x, y);
    }
  }

  update() {
    this._updateBall();
    this._updateString();
  }
}
