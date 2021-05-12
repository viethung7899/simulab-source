import {
  icon as getIcon,
  IconDefinition,
} from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  faEllipsisV,
  faPlay,
  faRedo,
  faStop,
} from '@fortawesome/free-solid-svg-icons';
import { Ticker } from '@pixi/ticker';
import { VoronoiGrid } from './components/VoronoiGrid';

const LIMIT = 5;

// Elements
export const playButton = document.querySelector<HTMLButtonElement>('#play');
export const resetButton =
  document.querySelector<HTMLButtonElement>('.reset-button');
export const gitHubButton =
  document.querySelector<HTMLButtonElement>('#github');
export const menuButton = document.querySelector<HTMLButtonElement>('#menu');
export const selection = document.querySelector<HTMLSelectElement>('select');

export const applyIcon = (button: Element, name: IconDefinition) => {
  const icon = getIcon(name).node[0];
  button.innerHTML = '';
  button.appendChild(icon);
};

// Optional menu
const menu = document.querySelector<HTMLDivElement>('.menu');
export const rowController =
  document.querySelector<HTMLDivElement>('#row-controller');
export const colController =
  document.querySelector<HTMLDivElement>('#col-controller');

// Toggle menu
const toggleMenu = () => {
  menuButton.addEventListener('click', () => {
    const hidden = menu.style.display === 'none';
    menu.style.display = hidden ? 'block' : 'none';
  });
};

// Initailize all icons
export const initController = () => {
  playButton.className = 'play-button';
  applyIcon(playButton, faPlay);
  applyIcon(resetButton, faRedo);
  applyIcon(gitHubButton, faGithub);
  applyIcon(menuButton, faEllipsisV);

  menu.style.display = 'none';
  toggleMenu();
};

export const toggleAnimation = (ticker: Ticker) => {
  if (!ticker.started) {
    playButton.className = 'stop-button';
    applyIcon(playButton, faStop);
    ticker.start();
  } else {
    playButton.className = 'play-button';
    applyIcon(playButton, faPlay);
    ticker.stop();
  }
};

// Adjust the numbers of seeds
type Mode = 'row' | 'column';
export const adjustSeeds = (event: MouseEvent, system: VoronoiGrid, mode: Mode) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return false;
  
  const parent = mode === 'row' ? rowController : colController;
  const spanElement = parent.querySelector('span');

  // Enable all buttons in parents
  parent.querySelectorAll<HTMLButtonElement>('button').forEach((b) => {
    b.disabled = false;
  });

  let count = +spanElement.innerHTML;

  let shouldUpdate = false;

  if (target.innerHTML === '+') {
    spanElement.innerHTML = (++count).toString();
    shouldUpdate = true;
    if (mode === 'row') {
      system.addRow();
    } else {
      system.addCol();
    }
    if (count >= LIMIT) {
      target.disabled = true;
    }
  }

  if (target.innerHTML === '-') {
    spanElement.innerHTML = (--count).toString();
    shouldUpdate = true;
    if (mode === 'row') {
      system.removeRow();
    } else {
      system.removeCol();
    }
    if (count <= 1) {
      target.disabled = true;
    }
  }

  return shouldUpdate;
};
