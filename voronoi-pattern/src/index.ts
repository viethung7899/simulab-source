import { Application, Ticker } from 'pixi.js';
import { voronoiFilter } from './components/Shader';
import { VoronoiGrid } from './components/VoronoiGrid';
import {applyAllIcons, playButton, resetButton, toggleAnimation} from './controller'
import './style.scss';

// Apply all icon styles
applyAllIcons();

const canvasContainer =
  document.querySelector<HTMLDivElement>('#canvas-container');
const canvas = document.querySelector<HTMLCanvasElement>('#sketch');
const delta = 0.005;

const { width: w, height: h } = canvasContainer.getBoundingClientRect();

const app = new Application({
  view: canvas,
  width: w,
  height: h,
  resolution: window.devicePixelRatio,
  autoDensity: true,
  backgroundAlpha: 1.0,
});

const system = new VoronoiGrid(app.screen, 2, 2);
app.stage.addChild(system.container);

// Apply shader
const voronoiShader = voronoiFilter(system);
system.background.filters = [voronoiShader.filter];

// Resize listener
window.addEventListener('resize', () => {
  // Resize the canvas
  const { width, height } = canvasContainer.getBoundingClientRect();
  app.renderer.resize(width, height);

  // Relocate the point
  system.updatePosition();
  voronoiShader.updateUniform();
});


let playing = false;
const animation = () => {
  system.move(delta);
  voronoiShader.updateUniform();
};

// Trigger animations
const ticker = new Ticker();
ticker.add(animation);

playButton.addEventListener('click', () => {
  toggleAnimation(ticker);
})

resetButton.addEventListener('click', () => {
  system.reset();
  voronoiShader.updateUniform();
})