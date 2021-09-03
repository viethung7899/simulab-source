import { Pendulums } from './Pendulums';
import { Solver } from './Solver';

export const playButton = document.querySelector<HTMLButtonElement>('#play');
const resetButton = document.querySelector<HTMLButtonElement>('#reset');

const plusButton = document.querySelector<HTMLButtonElement>('#plus');
const minusButton = document.querySelector<HTMLButtonElement>('#minus');
const numberLabel = document.querySelector<HTMLParagraphElement>('#number');

const playIcon = '<i class="fas fa-play"></i>';
const pauseIcon = '<i class="fas fa-pause"></i>';

const MAX_PENDULUM = 8;

function updateButtonActivities(n: number) {
  plusButton.disabled = false;
  minusButton.disabled = false;
  playButton.disabled = false;
  resetButton.disabled = false;

  // Update plus and minus buttons activity
  if (n <= 0) minusButton.disabled = true;
  if (n >= MAX_PENDULUM) plusButton.disabled = true;
  numberLabel.innerHTML = `${n}`;

  // Update playButton activity
  if (n <= 0) {
    resetButton.disabled = true;
    if (playButton.id === 'pause') togglePlayButton();
    playButton.disabled = true;
  }
}

function handlePlusButton(pendulums: Pendulums) {
  const n = pendulums.balls.length + 1;
  pendulums.addBall();
  updateButtonActivities(n);
}

function handleMinusButton(pendulums: Pendulums) {
  const n = pendulums.balls.length - 1;
  pendulums.removeBall();
  updateButtonActivities(n);
}

export function togglePlayButton() {
  const isPlaying = playButton.id === 'play';
  playButton.id = isPlaying ? 'pause' : 'play';
  playButton.innerHTML = isPlaying ? pauseIcon : playIcon;
}

export function initController(pendulums: Pendulums, solver: Solver) {
  // Init button
  updateButtonActivities(pendulums.balls.length);

  // Handle add and remove event
  plusButton.addEventListener('click', () => {
    handlePlusButton(pendulums);
    solver.update();
  });
  minusButton.addEventListener('click', () => {
    handleMinusButton(pendulums);
    solver.update();
  });

  // Handle play button
  playButton.addEventListener('click', () => {
    togglePlayButton();
  });
}
