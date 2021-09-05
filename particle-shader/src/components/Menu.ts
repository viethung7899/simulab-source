import { Filter } from '@pixi/core';
import { System } from './System';

const numberInput = document.querySelector<HTMLInputElement>(
  'input[type="number"]',
);
const filterInput = document.querySelector('select');

export function connectMenu(system: System, filters: Map<string, Filter>) {
  handleNumbers(system);
  numberInput.oninput = () => handleNumbers(system);

  handleNumbers(system);
  filterInput.oninput = () => handleFilter(system, filters);
}

export function handleNumbers(system: System) {
  const n = +numberInput.value;
  while (system.particles.length < n) system.addParticle();
  while (system.particles.length > n) system.removeParticle();
}

function handleFilter(system: System, filters: Map<string, Filter>) {
  system.setFilter(filters.get(filterInput.value));
}
