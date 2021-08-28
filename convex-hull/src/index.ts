import { Application } from '@pixi/app';
import { controller, initController } from './components/Controller';
import { LineRenderer } from './components/Line';
import { PointRenderer } from './components/Point';
import './style.scss';
import { giftWrapping, grahamScan } from './utils/algorithms';

const canvasContainer =
  document.querySelector<HTMLDivElement>('#canvas-container');
const canvas = document.querySelector<HTMLCanvasElement>('#sketch');
const { width, height } = canvasContainer.getBoundingClientRect();

export const playButton = document.querySelector<HTMLButtonElement>('#play');
export const resetButton = document.querySelector<HTMLButtonElement>('#reset');

const SPEED = 500;


initController();

const app = new Application({
  view: canvas,
  width,
  height,
  resolution: window.devicePixelRatio,
  autoDensity: true,
  backgroundColor: 0x222222,
});

// Renderers
const lineRenderer = new LineRenderer(app);
const pointRenderer = new PointRenderer(app);

window.addEventListener('resize', () => {
  // Resize the canvas
  const { width, height } = canvasContainer.getBoundingClientRect();
  app.renderer.resize(width, height);
});

// Start animation
const animation = async () => {
  const gen = grahamScan(pointRenderer, lineRenderer);
  // Lock the button and canvas
  playButton.disabled = true;
  controller.isPlaying = true;

  while (!gen.next().done) {
    await delay(SPEED);
  }

  // Unlock the button and canvas
  playButton.disabled = false;
  controller.isPlaying = false;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

playButton.addEventListener('click', animation);
resetButton.addEventListener('click', () => {
  lineRenderer.clearAll();
  pointRenderer.clearAll();
})
