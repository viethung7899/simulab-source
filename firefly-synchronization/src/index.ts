import { Application } from '@pixi/app';
import { Graphics, Sprite } from 'pixi.js';
import { initController } from './components/Controller';
import { Firefly, random_range } from './components/Firefly';
import './style.scss';

const canvasContainer =
document.querySelector<HTMLDivElement>('#canvas-container');
const canvas = document.querySelector<HTMLCanvasElement>('#sketch');
const { width, height } = canvasContainer.getBoundingClientRect();

initController();

const N = 1000;

const app = new Application({
  view: canvas,
  width,
  height,
  resolution: window.devicePixelRatio,
  autoDensity: true,
  backgroundColor: 0x333333,
});

const bugs: Firefly[] = [];

for (let i = 0; i < N; i++) {
  const bug = new Firefly(random_range(0, width), random_range(0, height));
  bug.showOn(app.stage);
  bugs.push(bug);
}

window.addEventListener('resize', () => {
  // Resize the canvas
  const { width, height } = canvasContainer.getBoundingClientRect();
  app.renderer.resize(width, height);
});

app.ticker.add(() => {
  bugs.forEach(bug => bug.update(0.1, app.renderer.screen));
});