import {
  icon as getIcon,
  IconDefinition,
} from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEllipsisV, faPlay, faRedo, faStop } from '@fortawesome/free-solid-svg-icons';
import { Ticker } from '@pixi/ticker';
import { VoronoiGrid } from './components/VoronoiGrid';

// Elements
export const playButton = document.querySelector<HTMLButtonElement>('#play');
export const resetButton =
  document.querySelector<HTMLButtonElement>('.reset-button');
export const gitHubButton =
  document.querySelector<HTMLButtonElement>('#github');
export const menuButton = document.querySelector<HTMLButtonElement>('#menu');

export const applyIcon = (button: Element, name: IconDefinition) => {
  const icon = getIcon(name).node[0];
  button.innerHTML = '';
  button.appendChild(icon);
};

export const applyAllIcons = () => {
  playButton.className = 'play-button';
  applyIcon(playButton, faPlay);
  applyIcon(resetButton, faRedo);
  applyIcon(gitHubButton, faGithub);
  applyIcon(menuButton, faEllipsisV);
}

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
}


