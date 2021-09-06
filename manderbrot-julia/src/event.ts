import {
  canvasContainer,
  julia,
  juliaDiv,
  mandelbrot,
  mandelbrotDiv,
} from './elements';
import { juliaApp, mandelbrotApp } from './index';

// Resize windows
export function resize() {
  // Change flex direction if needed
  const { width, height } = canvasContainer.getBoundingClientRect();
  canvasContainer.style.flexDirection = width / height < 1.5 ? 'column' : 'row';

  // Resize the canvas
  const { width: mw, height: mh } = mandelbrotDiv.getBoundingClientRect();
  mandelbrotApp.renderer.resize(mw - 8, mh - 8);

  const { width: jw, height: jh } = juliaDiv.getBoundingClientRect();
  juliaApp.renderer.resize(jw - 8, jh - 8);
}

// Click on canvas
export function handleCanvasClick(
  canvasDiv: HTMLDivElement,
  canvas: HTMLCanvasElement,
) {
  mandelbrotDiv.className = '';
  juliaDiv.className = '';
  canvasDiv.className = 'active';
}

export function useEvents() {
  // Handle clicking on canvas
  mandelbrotDiv.onclick = () => handleCanvasClick(mandelbrotDiv, mandelbrot);
  juliaDiv.onclick = () => handleCanvasClick(juliaDiv, julia);

  // Handle resizing
  window.onresize = resize;
  resize();
}
