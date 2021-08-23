import { Application, Container, Graphics, Sprite } from "pixi.js";
import { Boid } from "./components/Boid";
import "./style.scss"

const canvasContainer =
  document.querySelector<HTMLDivElement>('#canvas-container');
const canvas = document.querySelector<HTMLCanvasElement>('#sketch');

const { width: w, height: h } = canvasContainer.getBoundingClientRect();

const app = new Application({
  view: canvas,
  width: w,
  height: h,
  resolution: window.devicePixelRatio,
  autoDensity: true,
  backgroundColor: 0x333333
});

const b = new Boid(400, 400);
b.addTo(app.stage);

console.log(app.renderer.screen);

window.addEventListener('resize', () => {
  // Resize the canvas
  const { width, height } = canvasContainer.getBoundingClientRect();
  app.renderer.resize(width, height);
});