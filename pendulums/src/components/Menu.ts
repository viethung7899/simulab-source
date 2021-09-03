import { DEG_TO_RAD } from '@pixi/math';
import Ball from './Ball';
import Pendulums from './Pendulums';
import { EventEmitter } from '@pixi/utils';

// Gravity
const gravityDisplay =
  document.querySelector<HTMLParagraphElement>('#gravity p.value');
const gravityInput = document.querySelector<HTMLInputElement>('#gravity input');

function handleGravity(pendulums: Pendulums) {
  const value = gravityInput.value;
  gravityDisplay.innerHTML = value;
  pendulums.gravity = +value;
}

export function initMenu(pendulums: Pendulums) {
  // Set up gravity
  gravityInput.addEventListener('input', () => handleGravity(pendulums));
}

// Ball menu
const ballDetail = document.querySelector<HTMLDivElement>('.ball-menu');
const angleInput = ballDetail.querySelector<HTMLInputElement>('#angle input');
const velocityInput =
  ballDetail.querySelector<HTMLInputElement>('#velocity input');
const lengthInput = ballDetail.querySelector<HTMLInputElement>('#length input');
const massInput = ballDetail.querySelector<HTMLInputElement>('#mass input');

export class BallMenu {
  private _selectedBall: Ball;
  private _pendulum: Pendulums;
  readonly listener: EventEmitter

  constructor(pendulums: Pendulums) {
    this._pendulum = pendulums;
    this.disable();

    // Event listeners for input
    angleInput.addEventListener('input', this._handleAngle.bind(this));
    velocityInput.addEventListener('input', this._handleVelocity.bind(this));
    lengthInput.addEventListener('input', this._handleLength.bind(this));
    massInput.addEventListener('input', this._handleMass.bind(this));

    // Event listener for the menu
    this.listener = new EventEmitter();
    this.listener.on('choose', (b) => {
      const ball = b as Ball;
      this.enable(ball);
    });
  }

  disable() {
    this._clearPreviousBall();
    this._selectedBall = null;

    // Disable all input
    angleInput.disabled = true;
    velocityInput.disabled = true;
    lengthInput.disabled = true;
    massInput.disabled = true;

    // Hide all input
    angleInput.value = '';
    velocityInput.value = '';
    lengthInput.value = '';
    massInput.value = '';
  }

  enable(ball: Ball) {
    this._clearPreviousBall();
    ball.setSelected(true);
    this._selectedBall = ball;

    // Enable all input
    angleInput.disabled = false;
    velocityInput.disabled = false;
    lengthInput.disabled = false;
    massInput.disabled = false;

    // Show all input
    angleInput.value = ball.angle.toString();
    velocityInput.value = ball.angularVelocity.toString();
    lengthInput.value = ball.length.toString();
    massInput.value = ball.mass.toString();
  }

  private _handleAngle() {
    const {_selectedBall, _pendulum} = this;
    if (!this._selectedBall) return;
    this._selectedBall.angle = DEG_TO_RAD * +angleInput.value;
    this._pendulum.update();
  }

  private _handleVelocity() {
    const {_selectedBall} = this;

    if (!this._selectedBall) return;
    this._selectedBall.angularVelocity = +velocityInput.value;
  }

  private _handleLength() {
    if (!this._selectedBall) return;
    this._selectedBall.length = +lengthInput.value;
    this._pendulum.update();
  }

  private _handleMass() {
    if (!this._selectedBall) return;
    this._selectedBall.mass = +massInput.value;
    this._selectedBall.updateGraphics();
  }

  private _clearPreviousBall() {
    if (!this._selectedBall) return;
    this._selectedBall.setSelected(false);
  }
}
