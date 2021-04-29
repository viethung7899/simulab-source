import p5, { Vector } from 'p5';
import { toDegrees, toRadians } from './utils/angle';
import './buttons/buttons';
import PlayButton from './buttons/PlayButton';
import { angleInput, lengthInput, velocityInput } from './input';

const playButton = <PlayButton>(window as any).playButton;

class SinglePendulum {
  gravity = 1000.0;
  dT = 1 / 60;

  len = 200;
  angle = Math.PI / 6;
  angleV = 0;

  private drawPlatform = (p: p5, origin: Vector) => {
    p.strokeWeight(0);
    p.fill(127);
    p.rect(origin.x - 30, origin.y - 30, 60, 30);
  };

  private drawString = (p: p5, origin: Vector, ball: Vector) => {
    p.stroke(255);
    p.strokeWeight(4);
    p.line(origin.x, origin.y, ball.x, ball.y);
  };

  private drawBall = (p: p5, ball: Vector) => {
    p.stroke(255);
    p.strokeWeight(4);
    p.fill(127);
    p.circle(ball.x, ball.y, 60);
  };

  private update = () => {
    // Update position
    const angleA = (-this.gravity / this.len) * Math.sin(this.angle);
    this.angleV += angleA * this.dT;
    this.angle += this.angleV * this.dT;
    
    if (this.angle > toRadians(180)) this.angle -= toRadians(360);
    if (this.angle < toRadians(-180)) this.angle += toRadians(360);

    this.updateInput();
  };

  private updateInput = () => {
    angleInput.value = toDegrees(this.angle).toFixed(4).toString();
    velocityInput.value = this.angleV.toFixed(6).toString();
    lengthInput.value = this.len.toString();
  };

  sketch = () => (p: p5) => {
    let dimension = { width: 0, height: 0 };

    p.setup = () => {
      const { innerWidth: width, innerHeight: height } = window;
      dimension = { width, height };
      p.createCanvas(width, height);
      playButton.setCanvas(p);
      p.noLoop();

      this.updateInput();
    };

    p.draw = () => {
      p.background(51);
      const { width, height } = dimension;

      const origin = p.createVector(width / 2, height / 4);
      const ball = p.createVector();

      ball.x = this.len * p.sin(this.angle) + origin.x;
      ball.y = this.len * p.cos(this.angle) + origin.y;

      this.drawPlatform(p, origin);
      this.drawString(p, origin, ball);
      this.drawBall(p, ball);

      if (playButton.isPlaying()) this.update();
    };

    p.windowResized = () => {
      const { innerWidth: width, innerHeight: height } = window;
      dimension = { width, height };
      p.resizeCanvas(width, height);
    };
  };
}

export default SinglePendulum;
