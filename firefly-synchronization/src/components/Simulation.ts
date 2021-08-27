import { Application } from 'pixi.js';
import { Client, SpatialHashGrid } from '../utils/SpatialHashGrid';
import { Firefly, random_range } from './Firefly';

const N = 500;
const ROWS = 15;
const COLS = 15;

export class Simulation {
  private _app: Application;
  private _clients: Client<Firefly>[];
  private _grid: SpatialHashGrid<Firefly>;

  constructor(onCanvas: HTMLCanvasElement, width: number, height: number) {
    this._app = new Application({
      view: onCanvas,
      width,
      height,
      resolution: window.devicePixelRatio,
      autoDensity: true,
      backgroundColor: 0x222222,
    });
    this._clients = [];
    this._grid = new SpatialHashGrid<Firefly>(
      this._app.renderer.screen,
      ROWS,
      COLS,
    );
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

  addFirefly() {
    const { x, y, width, height } = this._app.renderer.screen;
    const firefly = new Firefly(
      random_range(x, x + width),
      random_range(y, y + height),
      this._grid,
    );
    firefly.showOn(this._app.stage);

    // Add to the grid
    const client = this._grid.newClient(firefly);
    this._clients.push(client);
    this._grid.addClient(client);
  }

  removeFirefly() {
    if (this._clients.length === 0) return;
    const client = this._clients.pop();
    this._grid.removeClient(client);
    client.entity.remove(this._app.stage);
  }

  update() {
    this._clients.forEach((client) => {
      client.entity.update(1 / 30, this._app.renderer.screen);
      this._grid.updateClient(client);
    });
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

// Initialize function
export const playButton = document.querySelector<HTMLButtonElement>('#play');
export const resetButton = document.querySelector<HTMLButtonElement>('#reset');
const playButtonHTML = '<i class="fas fa-play"></i>';
const pauseButtonHTML = '<i class="fas fa-pause"></i>';

export function initSimulation(
  simulation: Simulation,
  canvasContainer: HTMLDivElement,
) {
  for (let i = 0; i < N; i++) simulation.addFirefly();

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
    playButton.innerHTML = !animation.isPlaying
      ? pauseButtonHTML
      : playButtonHTML;
    playButton.id = !animation.isPlaying ? 'pause' : 'play';
    animation.isPlaying = !animation.isPlaying;
  });

  // Toggle resetButton
  resetButton.addEventListener('click', () => {
    while (simulation.clients.length > 0) simulation.removeFirefly();
    for (let i = 0; i < N; i++) simulation.addFirefly();
  });

  // Trigger animation
  simulation.app.ticker.add(animation.update(simulation));
}
