import { Application } from '@pixi/app';
import { Graphics } from 'pixi.js';
import { initController } from './components/Controller';
import './style.scss';

const canvasContainer =
  document.querySelector<HTMLDivElement>('#canvas-container');
const canvas = document.querySelector<HTMLCanvasElement>('#sketch');
const { width, height } = canvasContainer.getBoundingClientRect();

initController();

const app = new Application({
  view: canvas,
  width,
  height,
  resolution: window.devicePixelRatio,
  autoDensity: true,
  backgroundColor: 0x333333,
});

// Sample shape
const shape = new Graphics();
shape.beginFill(0x00ffff).drawCircle(0, 0, 50).endFill();
shape.x = 400;
shape.y = 400;
app.stage.addChild(shape);

window.addEventListener('resize', () => {
  // Resize the canvas
  const { width, height } = canvasContainer.getBoundingClientRect();
  app.renderer.resize(width, height);
});

console.log(app);
