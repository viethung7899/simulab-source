import { Application } from 'pixi.js';
import { connectControllerToCanvas, Maurer } from './Maurer';
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
  antialias: true,
  backgroundColor: 0x333333,
});

const maurer = new Maurer();
app.stage.addChild(maurer.graphic);
maurer.setBound(app.renderer.screen);
connectControllerToCanvas(maurer);
maurer.update();

window.onresize = () => {
  // Resize the canvas
  const { width, height } = canvasContainer.getBoundingClientRect();
  app.renderer.resize(width, height);
  maurer.update();
};

console.log(app);
