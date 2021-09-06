import { Application } from 'pixi.js';
import { initController } from './components/Controller';
import { julia, juliaDiv, manderbrot, manderbrotDiv } from './elements';
import './style.scss';

const manderbrotRect = manderbrotDiv.getBoundingClientRect();
const juliaRect = manderbrotDiv.getBoundingClientRect();

initController();

const manderbrotApp = new Application({
  view: manderbrot,
  width: manderbrotRect.width - 8,
  height: manderbrotRect.height - 8,
  resolution: window.devicePixelRatio,
  autoDensity: true,
  backgroundColor: 0x333333,
});

const juliaApp = new Application({
  view: julia,
  width: juliaRect.width - 8,
  height: juliaRect.height - 8,
  resolution: window.devicePixelRatio,
  autoDensity: true,
  backgroundColor: 0x111111,
});

window.addEventListener('resize', () => {
  // Resize the canvas
  const { width: mw, height: mh } = manderbrotDiv.getBoundingClientRect();
  manderbrotApp.renderer.resize(mw - 8, mh - 8);

  const { width: jw, height: jh } = juliaDiv.getBoundingClientRect();
  juliaApp.renderer.resize(jw - 8, jh - 8);
});
