import p5 from 'p5';
import './style.scss';
import Sketch from './sketch';
import ChaosPendulum from './pendulum/ChaosPendulum';

const sketchDiv = document.querySelector<HTMLElement>('.sketch');
const chaosPendulum = new ChaosPendulum();
const sketch = Sketch(chaosPendulum);

// const doublePendulum = new DoublePendulum();
// const sketch = Sketch(doublePendulum);

new p5(sketch, sketchDiv);

// lengthInput.addEventListener('input', (event: Event & {target: HTMLInputElement}) => {
//   pendulum.len = +event.target.value;
//   singlePendulumSketch.redraw();
// })

// angleInput.addEventListener('input', (event: Event & {target: HTMLInputElement}) => {
//   pendulum.angle = toRadians(+event.target.value);
//   singlePendulumSketch.redraw();
// })

// velocityInput.addEventListener('input', (event: Event & {target: HTMLInputElement}) => {
//   pendulum.angleV = +event.target.value;
//   singlePendulumSketch.redraw();
// })
