import { Container } from '@pixi/display';
import Particle from './Particle';

const palette = [0x23049d, 0xaa2ee6, 0xff79cd, 0xffdf6b];
const smallRadius = 5;

const randomX = (boundary: number = 0) => {
  return Math.random() * (window.innerWidth - 2 * boundary) + boundary;
};

const randomY = (boundary: number = 0) => {
  return Math.random() * (window.innerHeight - 2 * boundary) + boundary;
};

class BrownianSystem {
  particles: Particle[] = [];

  constructor() {
    // const bigParticle = new Particle(window.innerWidth / 2, window.innerHeight / 2, 50);
    // this.particles.push(bigParticle);
  }

  generateRandomParticles(quantity: number) {
    for (let i = 0; i < quantity; i++) {
      const particle = new Particle(randomX(smallRadius), randomY(smallRadius), smallRadius, true);
      particle.setColor(palette[i % palette.length]);
      this.particles.push(particle);
    }
  }

  draw() {
    this.particles.forEach((particle) => {
      particle.draw();
    });
  }

  showOn(stage: Container) {
    stage.addChild(...this.particles);
  }

  move(dTime: number) {
    this.particles.forEach((p) => p.move(dTime));
  }
}

export default BrownianSystem;
