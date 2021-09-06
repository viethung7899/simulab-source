import { Application } from 'pixi.js';
import { Display } from './components/Display';
import { julia, mandelbrot, mandelbrotDiv } from './elements';
import { useEvents } from './event';
import { useMandelbrotShader } from './shader';
import './style.scss';

const mandelbrotRect = mandelbrotDiv.getBoundingClientRect();
const juliaRect = mandelbrotDiv.getBoundingClientRect();

export const mandelbrotApp = new Application({
  view: mandelbrot,
  width: mandelbrotRect.width - 8,
  height: mandelbrotRect.height - 8,
  resolution: window.devicePixelRatio,
  autoDensity: true,
  backgroundColor: 0x333333,
  antialias: true,
});

export const juliaApp = new Application({
  view: julia,
  width: juliaRect.width - 8,
  height: juliaRect.height - 8,
  resolution: window.devicePixelRatio,
  autoDensity: true,
  backgroundColor: 0x111111,
  antialias: true,
});

useEvents();

const mandelbrotDisplay = new Display(mandelbrotApp);
const mandelbrotShader = useMandelbrotShader(mandelbrotDisplay);

// Key down events
window.onkeydown = (ev) => {
  // Handle mandelbrot
  if (mandelbrotDiv.className === 'active') {
    mandelbrotDisplay.handleKeyDown(ev);
    mandelbrotShader.update();
  }
};
