import { Application, Graphics } from 'pixi.js';
import { Boid, random_range } from './components/Boid';
import { initController } from './components/Controller';
import './style.scss';
import { Client, SpatialHashGrid } from './utils/SpatialHashGrid';
import { Vector2D } from './utils/Vector2D';

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
  backgroundColor: 0x333333,
});

// Make grid
const bound = app.renderer.screen;
const BOIDS = 100;
const ROWS = 15;
const COLS = 15;

const clients: Client<Boid>[] = [];
const grid = new SpatialHashGrid<Boid>(bound, ROWS, COLS);

// Add boids
for (let i = 0; i < BOIDS; i++) {
  const boid = new Boid(
    random_range(bound.x, bound.x + bound.width),
    random_range(bound.y, bound.y + bound.height),
  );
  boid.addTo(app.stage);

  // Add boids to the grid
  const client = grid.newClient(boid);
  clients.push(client);
  grid.addClient(client);
}

// Resize window
window.addEventListener('resize', () => {
  // Resize the canvas
  const { width, height } = canvasContainer.getBoundingClientRect();
  app.renderer.resize(width, height);
  clients.forEach(client => grid.updateClient(client));
});

// Add animation
const animation = () => {
  clients.forEach((client) => {
    client.entity.update(1 / 30, bound);
    grid.updateClient(client);
  });
  highlight();
};
app.ticker.add(animation);

// Debug the grid
const SIZE = 100;
const square = new Graphics();
square
  .beginFill(0x555555)
  .drawRect(-SIZE / 2, -SIZE / 2, SIZE, SIZE)
  .endFill();
square.alpha = 0.5;
square.zIndex = 1;
app.stage.addChild(square);

canvas.addEventListener('mousemove', (ev) => {
  const rect = (ev.target as HTMLCanvasElement).getBoundingClientRect();
  square.x = ev.clientX - rect.left;
  square.y = ev.clientY - rect.top;

  // Reset all and highlight nearby boids
  highlight();
});

const ind = grid._getCellIndex(new Vector2D(1000, 800));
console.log(ind);
console.log(grid);

const highlight = () => {
  clients.forEach(client => (client.entity.shape.tint = 0xffffff));
  const nearByClients = grid.findNearBy(
    new Vector2D(square.x, square.y),
    square.width,
  );
  nearByClients.forEach((c) => (c.entity.shape.tint = 0x00ff00));
}
