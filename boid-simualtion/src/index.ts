import { Application, Container, Graphics, Sprite, Ticker } from "pixi.js";
import { Boid } from "./components/Boid";
import { initController } from "./components/Controller";
import "./style.scss"

// Set up controller
initController();

const canvasContainer =
  document.querySelector<HTMLDivElement>('#canvas-container');
const canvas = document.querySelector<HTMLCanvasElement>('#sketch');

const { width: w, height: h } = canvasContainer.getBoundingClientRect();

// App initialization
const app = new Application({
  view: canvas,
  width: w,
  height: h,
  resolution: window.devicePixelRatio,
  autoDensity: true,
  backgroundColor: 0x333333
});

// Add boids
const b = new Boid(400, 400);
b.addTo(app.stage);

// Resize window
window.addEventListener('resize', () => {
  // Resize the canvas
  const { width, height } = canvasContainer.getBoundingClientRect();
  app.renderer.resize(width, height);
});

// Add animation
const animation = () => {
  b.update(1/30, app.renderer.screen); 
}
app.ticker.add(animation);