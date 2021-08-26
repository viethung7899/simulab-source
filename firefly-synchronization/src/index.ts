import { initController } from './components/Controller';
import { initSimulation, Simulation } from './components/Simulation';
import './style.scss';

initController();

const canvasContainer =
  document.querySelector<HTMLDivElement>('#canvas-container');
const canvas = document.querySelector<HTMLCanvasElement>('#sketch');
const { width, height } = canvasContainer.getBoundingClientRect();


const simulation = new Simulation(canvas, width, height);
initSimulation(simulation, canvasContainer);
