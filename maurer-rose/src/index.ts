import { Application } from '@pixi/app';
import { Graphics } from '@pixi/graphics';
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
shape.beginFill(0xffff00).drawCircle(400, 400, 100).endFill();
app.stage.addChild(shape);

window.addEventListener('resize', () => {
  // Resize the canvas
  const { width, height } = canvasContainer.getBoundingClientRect();
  app.renderer.resize(width, height);
});

console.log(app);
