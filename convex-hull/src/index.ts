import { Application } from '@pixi/app';
import { controller, useMenu } from './components/Controller';
import { LineRenderer } from './components/Line';
import { PointRenderer } from './components/Point';
import './style.scss';

const canvasContainer =
  document.querySelector<HTMLDivElement>('#canvas-container');
const canvas = document.querySelector<HTMLCanvasElement>('#sketch');
const { width, height } = canvasContainer.getBoundingClientRect();

export const playButton = document.querySelector<HTMLButtonElement>('#play');
export const resetButton = document.querySelector<HTMLButtonElement>('#reset');
export const randomButton =
  document.querySelector<HTMLButtonElement>('#random');

const { getAnimationSpeed, getAlgorithm, disableMenu } = useMenu();

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
  // Only start animation for at least 3 points
  if (pointRenderer.points.length < 3) return;
  const speed = getAnimationSpeed();
  const convexHull = getAlgorithm();

  const gen = convexHull(pointRenderer, lineRenderer);

  // Lock all button and canvas
  playButton.disabled = true;
  resetButton.disabled = true;
  randomButton.disabled = true;
  controller.isPlaying = true;
  disableMenu(true);

  while (!gen.next().done) {
    await delay(speed);
  }

  // Unlock the button and canvas
  playButton.disabled = false;
  resetButton.disabled = false;
  randomButton.disabled = false;
  controller.isPlaying = false;
  disableMenu(false);
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const reset = () => {
  lineRenderer.clearAll();
  pointRenderer.clearAll();
};

playButton.addEventListener('click', animation);
resetButton.addEventListener('click', reset);
randomButton.addEventListener('click', () => {
  reset();
  const n = Math.random() * 80 + 20;
  const {width, height} = app.view.getBoundingClientRect();
  for (let i = 0; i < n; i++) {
    const x = Math.random() * (width - 100) + 50;
    const y = Math.random() * (height - 100) + 50;
    pointRenderer.addPoint(x, y);
  }
});
