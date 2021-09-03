import { Application } from '@pixi/app';
import { Graphics } from 'pixi.js';
import { initController, playButton } from './components/Controller';
import { Pendulums } from './components/Pendulums';
import { Solver } from './components/Solver';
import './style.scss';

// Constant
const DELTA = 1 / 10;

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
pendulums.addBall();
pendulums.addBall();
app.stage.addChild(pendulums.container);
pendulums.updateOnResize(app.renderer.screen);

// Solver
const solver = new Solver(pendulums);

// Add controller for pendulum
initController(pendulums, solver);


console.log(pendulums.balls);

// Resize the canvas
window.addEventListener('resize', () => {
  const { width, height } = canvasContainer.getBoundingClientRect();
  app.renderer.resize(width, height);
  pendulums.updateOnResize(app.renderer.screen);
});


// Animation
app.ticker.add(() => {
  if (playButton.id === 'play') return;
  solver.step(DELTA);
})