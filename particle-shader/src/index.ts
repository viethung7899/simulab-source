import { Application } from 'pixi.js';
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

window.addEventListener('resize', () => {
  // Resize the canvas
  const { width, height } = canvasContainer.getBoundingClientRect();
  app.renderer.resize(width, height);
  console.log(width, height);
});

console.log(app);
