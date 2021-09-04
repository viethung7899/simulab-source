import { System } from './System';

const numberInput = document.querySelector<HTMLInputElement>('input[type="number"]');
const filterInput = document.querySelector('select');

export function connectMenu(system: System) {
  handleNumbers(system);
  numberInput.oninput = () => handleNumbers(system);
}

export function handleNumbers(system: System) {
  const n = +numberInput.value;
  while (system.particleNums < n) system.addParticle();
  while (system.particleNums > n) system.removeParticle();
}
