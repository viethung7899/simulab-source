import { Application } from '@pixi/app';
import { Graphics } from 'pixi.js';
import { initController } from './components/Controller';
import { Pendulums } from './components/Pendulums';
import './style.scss';

const canvasContainer =
  document.querySelector<HTMLDivElement>('#canvas-container');
const canvas = document.querySelector<HTMLCanvasElement>('#sketch');
const { width, height } = canvasContainer.getBoundingClientRect();

const app = new Application({
  view: canvas,
  width,
  height,
  resolution: window.devicePixelRatio,
  autoDensity: true,
  backgroundColor: 0x333333,
});

// Dummy shape
const shape = new Graphics();

// Pendulum system
const pendulums = new Pendulums();
app.stage.addChild(pendulums.container);
pendulums.updateOnResize(app.renderer.screen);

// Add controller for pendulum
initController(pendulums);

window.addEventListener('resize', () => {
  // Resize the canvas
  const { width, height } = canvasContainer.getBoundingClientRect();
  app.renderer.resize(width, height);
  pendulums.updateOnResize(app.renderer.screen);
});
