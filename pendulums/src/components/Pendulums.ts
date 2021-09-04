import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Rectangle } from '@pixi/math';
import Ball from './Ball';
import { BallMenu } from './Menu';

const FACTOR_LENGTH = 100;

export default class Pendulums {
  private _container: Container;
  private _strings: Graphics;
  private _balls: Ball[];
  private _trails: Graphics[][];

  private _menu: BallMenu;

  public gravity = 5;

  constructor() {
    this._container = new Container();

    this._strings = new Graphics();

    this._balls = [];
    this._trails = [];

    this._init();

    const menu = new BallMenu(this);
    this._menu = menu;
  }

  get container() {
    return this._container;
  }

  get balls() {
    return this._balls;
  }

  get menu() {
    return this._menu;
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
  }

  updateOnResize(screen: Rectangle) {
    const { width, height } = screen;
    this._container.x = width / 2;
    this._container.y = height / 5;
  }

  // Add a ball to the system
  addBall() {
    const ball = new Ball();
    ball.bindEvent(this._menu);
    this._balls.push(ball);
    this._trails.push([]);
    this._container.addChild(ball.graphic);
    this.update();
  }

  // Remove the last ball from the display
  removeBall() {
    if (this._balls.length > 0) {
      // Remove the ball and the trials
      this._container.removeChild(
        this._balls.pop().graphic,
        ...this._trails.pop(),
      );
      this._updateString();
    }
  }

  // Update the ball position
  private _updateBall() {
    let x = 0,
      y = 0;
    for (const ball of this._balls) {
      x += ball.length * FACTOR_LENGTH * Math.sin(ball.angle);
      y += ball.length * FACTOR_LENGTH * Math.cos(ball.angle);
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
      x += ball.length * FACTOR_LENGTH * Math.sin(ball.angle);
      y += ball.length * FACTOR_LENGTH * Math.cos(ball.angle);
      this._strings.lineTo(x, y);
    }
  }

  update() {
    this._updateBall();
    this._updateString();
  }

  updateTrail() {
    this._trails.forEach((trail, i) => {
      // Keep the lastest 100 dots and dim all of them
      while (trail.length > 500) this.container.removeChild(trail.shift());
      trail.forEach((dot) => (dot.alpha *= 0.99));

      // Add current position of the ball
      const {
        color,
        graphic: { x, y },
      } = this.balls[i];
      const newDot = new Graphics()
        .beginFill(color, 1)
        .drawCircle(x, y, 2)
        .endFill();
      trail.push(newDot);
      this.container.addChild(newDot);
    });
  }
}
