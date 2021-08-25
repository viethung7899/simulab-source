import { initController } from './components/Controller';
import { initSimulation, Simulation } from './components/Simulation';
import './style.scss';

// Set up controller
initController();

const canvasContainer =
  document.querySelector<HTMLDivElement>('#canvas-container');
const canvas = document.querySelector<HTMLCanvasElement>('#sketch');

const { width: w, height: h } = canvasContainer.getBoundingClientRect();

// App initialization
const simulation = new Simulation(canvas, w, h);
initSimulation(simulation, canvasContainer);
