import { Application } from 'pixi.js';
import { connectController, isPlaying } from './components/Controller';
import { connectMenu } from './components/Menu';
import { System } from './components/System';
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

const system = new System();
app.stage.addChild(system.container);
system.setRenderer(app.renderer);

connectMenu(system);
connectController(system);

window.addEventListener('resize', () => {
  // Resize the canvas
  const { width, height } = canvasContainer.getBoundingClientRect();
  app.renderer.resize(width, height);
});

const animation = () => {
  if (isPlaying()) system.update();
};

app.ticker.add(animation);
