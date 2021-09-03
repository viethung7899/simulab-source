import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { rgb2hex } from '@pixi/utils';
import { playButton } from './Controller';
import { EventEmitter } from '@pixi/utils';
import { BallMenu } from './Menu';

const MULT_MASS = 10;

export default class Ball {
  public angle: number;
  public angularVelocity: number;
  public length = 2;
  public mass = 1;
  private _graphic: Graphics;
  readonly color = rgb2hex([Math.random(), Math.random(), Math.random()]);
  private _selected: boolean = false;

  private _eventEmitter: EventEmitter

  constructor() {
    this.angle = Math.PI / 2;
    this.angularVelocity = 0;
    this._graphic = new Graphics();
    this.updateGraphics();
    
    this._graphic.interactive = true;
  }
  
  bindEvent(menu: BallMenu) {
    this._eventEmitter = menu.listener;
    this._graphic.on('pointerdown', this._handleClick(this));
  }

  private _handleClick(ball: Ball) {
    return () => {
      if (playButton.id === 'play') {
        this._eventEmitter.emit('choose', ball);
      }
    }
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
    this._graphic.clear();
    if (this._selected) this.graphic.lineStyle(3, 0xffffff);
    this.graphic.beginFill(this.color).drawCircle(0, 0, MULT_MASS * this.mass).endFill();
  }

  setSelected(selected: boolean) {
    this._selected = selected;
    this.updateGraphics();
  }

  get graphic() {
    return this._graphic;
  }
}
