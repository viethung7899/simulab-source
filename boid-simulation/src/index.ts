import { Application, Graphics } from 'pixi.js';
import { Boid, random_range } from './components/Boid';
import { initController } from './components/Controller';
import { initSimulation, Simulation } from './components/Simulation';
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
const simulation = new Simulation(canvas, w, h);
initSimulation(simulation, canvasContainer);
