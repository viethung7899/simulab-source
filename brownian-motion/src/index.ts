import { Application, Ticker } from 'pixi.js';
import BrownianSystem from './components/BrownianSystem';
import { collisionHandling2Particles } from './components/Particle';
import QuadTree from './components/QuadTree';
import './style.scss';

const canvas = document.querySelector<HTMLCanvasElement>('#sketch');
const dTime = 1/60;

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
system.showOn(app.stage);

// Resize listener
window.addEventListener('resize', () => {
  const { innerWidth, innerHeight } = window;
  app.renderer.resize(innerWidth, innerHeight);
});

// Collision detection
const collisionHandling = () => {
  const qt = new QuadTree(0, 0, window.innerWidth, window.innerHeight);
  const particles = system.particles;
  particles.forEach((p) => {
    qt.insert(p);
  });
  for (const p1 of particles) {
    const possibleParticles = qt.query(p1);
    for (const p2 of possibleParticles) {
      collisionHandling2Particles(p1, p2);
    }
  }
};

// collisionHandling();

// Animation
const ticker = new Ticker();
const animate = () => {
  collisionHandling();
  system.move(dTime);
};

ticker.add(animate);
ticker.start();
