import { Application, Ticker } from 'pixi.js';
import BrownianSystem from './components/BrownianSystem';
import './style.scss';

const canvas = document.querySelector<HTMLCanvasElement>('#sketch');

const app = new Application({
  view: canvas,
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: window.devicePixelRatio,
  autoDensity: true,
});

const system = new BrownianSystem();
system.generateRandomParticles(100);
system.draw();

sys
tem.showOn(app.stage);

// Resize listener
window.addEventListener('resize', () => {
  const { innerWidth, innerHeight } = window;
  app.renderer.resize(innerWidth, innerHeight);
});

// Animation
const ticker = new Ticker();
const animate = () => {
  system.move();
};

ticker.add(animate);
// ticker.start();
