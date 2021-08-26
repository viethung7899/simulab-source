import { Application } from '@pixi/app';
import { Graphics, Sprite } from 'pixi.js';
import { initController } from './components/Controller';
import { Firefly } from './components/Firefly';
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

const bug = new Firefly(400, 400);
bug.showOn(app.stage);

window.addEventListener('resize', () => {
  // Resize the canvas
  const { width, height } = canvasContainer.getBoundingClientRect();
  app.renderer.resize(width, height);
});

app.ticker.add(() => {
  bug.update(0.1);
})