import p5 from 'p5';
import './style.scss';
import SinglePendulum from './SinglePendulum';
import { angleInput, lengthInput, velocityInput } from './input';
import { toRadians } from './utils/angle';

const sketchDiv = document.querySelector<HTMLElement>('.sketch');
const pendulum = new SinglePendulum();
const sketch = pendulum.sketch();

const singlePendulumSketch = new p5(sketch, sketchDiv);

lengthInput.addEventListener('input', (event: Event & {target: HTMLInputElement}) => {
  pendulum.len = +event.target.value;
  singlePendulumSketch.redraw();
})

angleInput.addEventListener('input', (event: Event & {target: HTMLInputElement}) => {
  pendulum.angle = toRadians(+event.target.value);
  singlePendulumSketch.redraw();
})

velocityInput.addEventListener('input', (event: Event & {target: HTMLInputElement}) => {
  pendulum.angleV = +event.target.value;
  singlePendulumSketch.redraw();
})
