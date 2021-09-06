import { Application } from 'pixi.js';
import { Display } from './components/Display';
import { julia, juliaDiv, mandelbrot, mandelbrotDiv, resetButton } from './elements';
import { useEvents } from './event';
import { useJuliaShader, useMandelbrotShader } from './shader';
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

const juliaDisplay = new Display(juliaApp);
const juliaShader = useJuliaShader(juliaDisplay);

// Key down events
window.onkeydown = (ev) => {
  // Handle mandelbrot
  if (mandelbrotDiv.className === 'active') {
    mandelbrotDisplay.handleKeyDown(ev);
    mandelbrotShader.update();
  }

  if (juliaDiv.className === 'active') {
    juliaDisplay.handleKeyDown(ev);
    juliaShader.update();
  }
};

// Handle mouse moving event over the Mandelbrot set
mandelbrot.onmousemove = (ev) => {
  const {x, y, width, height} = mandelbrot.getBoundingClientRect();
  const normX = (ev.clientX - x) / width;
  const normY = (ev.clientY - y) / height;

  // Transform xy into coordinates
  const [xCoord, yCoord] = mandelbrotDisplay.getCoord(normX, normY, width / height);
  juliaShader.updatePoint(xCoord, yCoord);
}

// Handle reset
resetButton.onclick = () => {
  mandelbrotDisplay.reset();
  juliaDisplay.reset();
  mandelbrotShader.update();
  juliaShader.update();
}
