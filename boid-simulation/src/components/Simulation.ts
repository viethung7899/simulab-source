import { Application } from 'pixi.js';
import { Client, SpatialHashGrid } from '../utils/SpatialHashGrid';
import { Boid, random_range } from './Boid';

const BOIDS = 300;
const ROWS = 15;
const COLS = 15;

// Buttons
export const playButton = document.querySelector<HTMLButtonElement>('#play');
export const resetButton = document.querySelector<HTMLButtonElement>('#reset');
const playButtonHTML = '<i class="fas fa-play"></i>';
const paseButtonHTML = '<i class="fas fa-pause"></i>';

export class Simulation {
  private _app: Application;
  private _clients: Client<Boid>[];
  private _grid: SpatialHashGrid<Boid>;

  constructor(onCanvas: HTMLCanvasElement, width: number, height: number) {
    this._app = new Application({
      view: onCanvas,
      width,
      height,
      resolution: window.devicePixelRatio,
      autoDensity: true,
      backgroundColor: 0x333333,
    });
    this._clients = [];
    this._grid = new SpatialHashGrid<Boid>(
      this._app.renderer.screen,
      ROWS,
      COLS,
    );
  }

  addBoid() {
    const { x, y, width, height } = this._app.renderer.screen;
    const boid = new Boid(
      random_range(x, x + width),
      random_range(y, y + height),
      this._grid,
    );
    boid.addTo(this._app.stage);

    // Add boids to the grid
    const client = this._grid.newClient(boid);
    this._clients.push(client);
    this._grid.addClient(client);
  }

  removeBoid() {
    if (this._clients.length === 0) return;
    const client = this._clients.pop();
    this._grid.removeClient(client);
    this._app.stage.removeChild(client.entity.shape);
  }

  update() {
    this._clients.forEach((client) => {
      client.entity.update(1 / 30, this._app.renderer.screen);
      this._grid.updateClient(client);
    });
  }

  get app() {
    return this._app;
  }
  get clients() {
    return this._clients;
  }
  get grid() {
    return this._grid;
  }
}

// Animation
export const animation = {
  isPlaying: false,
  update: (simulation: Simulation) => () => {
    if (!animation.isPlaying) return;
    simulation.update();
  },
};

export function initSimulation(
  simulation: Simulation,
  canvasContainer: HTMLDivElement,
) {
  for (let i = 0; i < BOIDS; i++) simulation.addBoid();

  // Resize window
  window.addEventListener('resize', () => {
    const { width, height } = canvasContainer.getBoundingClientRect();
    simulation.app.renderer.resize(width, height);
    simulation.clients.forEach((client) =>
      simulation.grid.updateClient(client),
    );
  });

  // Toggle playButton
  playButton.addEventListener('click', () => {
    playButton.innerHTML = animation.isPlaying
      ? paseButtonHTML
      : playButtonHTML;
    playButton.id = animation.isPlaying ? 'pause' : 'play';
    animation.isPlaying = !animation.isPlaying;
  });

  // Toggle resetButton
  resetButton.addEventListener('click', () => {
    while (simulation.clients.length > 0) simulation.removeBoid();
    for (let i = 0; i < BOIDS; i++) simulation.addBoid();
  });

  // Trigger animation
  simulation.app.ticker.add(animation.update(simulation));
}
