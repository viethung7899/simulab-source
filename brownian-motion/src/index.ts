import { Application, Ticker } from 'pixi.js';
import BrownianSystem from './components/BrownianSystem';
import { collisionHandling2Particles } from './components/Particle';
import QuadTree from './components/QuadTree';
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

const system = new BrownianSystem();
system.generateRandomParticles(250);
system.draw();
system.showOn(app.stage);

// Resize listener
window.addEventListener('resize', () => {
  const { innerWidth, innerHeight } = window;
  app.renderer.resize(innerWidth, innerHeight);
});

// collisionHandling();

// Animation
const ticker = new Ticker();
const animate = () => {
  system.collisionHandling(dTime);
  system.move(dTime);
};

ticker.add(animate);
ticker.start();
