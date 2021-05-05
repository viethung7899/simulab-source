import { icon } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { Application, Ticker } from 'pixi.js';
import BrownianSystem from './components/BrownianSystem';
import './style.scss';

const canvas = document.querySelector<HTMLCanvasElement>('#sketch');
const dTime = 0.01;

const app = new Application({
  view: canvas,
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: window.devicePixelRatio,
  autoDensity: true,
});

const system = new BrownianSystem();
system.generateRandomParticles(400);
system.draw();
system.showOn(app.stage);

// Resize listener
window.addEventListener('resize', () => {
  const { innerWidth, innerHeight } = window;
  app.renderer.resize(innerWidth, innerHeight);
});

// collisionHandling();

// Animation
const ticker = new Ticker();
const animate = () => {
  system.collisionHandling(dTime);
  system.move(dTime);
  system.trace(app.stage);
};

ticker.add(animate);
// ticker.start();

/**
 * Buttons and controller
 */
const playButton = document.querySelector('#play');
const playIcon = icon(faPlay).node[0];
const stopIcon = icon(faStop).node[0];
const githubIcon = icon(faGithub).node[0];

playButton.className = 'play-button';
playButton.appendChild(playIcon);
let playing = false;

playButton.addEventListener('click', () => {
  playing = !playing;
  playButton.innerHTML = '';
  if (playing) {
    ticker.start();
    playButton.className = 'stop-button';
    playButton.appendChild(stopIcon);
  } else {
    ticker.stop();
    playButton.className = 'play-button';
    playButton.appendChild(playIcon);
  }
});

document.querySelector('#github').appendChild(githubIcon);
