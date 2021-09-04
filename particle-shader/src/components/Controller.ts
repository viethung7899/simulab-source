import { handleNumbers } from "./Menu";
import { System } from "./System";

const playButton = document.querySelector<HTMLButtonElement>('#play');
const resetButton = document.querySelector<HTMLButtonElement>('#reset');

const playIcon = '<i class="fas fa-play"></i>';
const pauseIcon = '<i class="fas fa-pause"></i>';

export const isPlaying = () => playButton.id === 'pause';

export function connectController(system: System) {
  // Handle play button
  playButton.onclick = () => {
    const playing = isPlaying();
    playButton.id = playing ? 'play' : 'pause';
    playButton.innerHTML = playing ? playIcon : pauseIcon;
  }

  // Handle reset button
  resetButton.onclick = () => {
    system.deleteAll();
    handleNumbers(system);
  }
}