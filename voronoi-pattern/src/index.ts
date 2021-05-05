import { Application } from 'pixi.js';
import { Seed } from './components/Seed';
import './style.scss';

const canvas = document.querySelector<HTMLCanvasElement>('#sketch');
const dTime = 0.01;

const app = new Application({
  view: canvas,
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: window.devicePixelRatio,
  autoDensity: true,
});

// Resize listener
window.addEventListener('resize', () => {
  const { innerWidth, innerHeight } = window;
  app.renderer.resize(innerWidth, innerHeight);
});

const seed = new Seed();
app.stage.addChild(seed);
