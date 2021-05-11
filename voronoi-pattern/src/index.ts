import { Application } from 'pixi.js';
import { voronoiFilter } from './components/Shader';
import { VoronoiGrid } from './components/VoronoiGrid';
import './style.scss';

const canvas = document.querySelector<HTMLCanvasElement>('#sketch');
const delta = 0.005;

const app = new Application({
  view: canvas,
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: window.devicePixelRatio,
  autoDensity: true,
  backgroundAlpha: 1.0,
});

const system = new VoronoiGrid(app.screen, 5, 5);
app.stage.addChild(system.container);

// Resize listener
window.addEventListener('resize', () => {
  // Resize the canvas
  const { innerWidth, innerHeight } = window;
  app.renderer.resize(innerWidth, innerHeight);

  // Relocate the point
  system.updatePosition();
});

// Apply shader
const voronoiShader = voronoiFilter(system);
system.background.filters = [voronoiShader.filter];

const animation = () => {
  system.move(delta);
  voronoiShader.updateUniform();
};

app.ticker.add(animation);
