import { Container } from '@pixi/display';
import Particle, { collide2Particles } from './Particle';
import QuadTree from './QuadTree';

const palette = [0xE79226, 0xEE9965, 0xF6D99A, 0xA6AF89, 0x755E67];
const smallRadius = 4;

const randomX = (boundary: number = 0) => {
  return Math.random() * (window.innerWidth - 2 * boundary) + boundary;
};

const randomY = (boundary: number = 0) => {
  return Math.random() * (window.innerHeight - 2 * boundary) + boundary;
};

class BrownianSystem {
  particles: Particle[] = [];
  bigParticle: Particle;
  tracing: Particle[] = [];

  constructor() {
    this.bigParticle = new Particle(
      window.innerWidth / 2,
      window.innerHeight / 2,
      50,
    );
  }

  generateRandomParticles(quantity: number) {
    for (let i = 0; i < quantity; i++) {
      const particle = new Particle(
        randomX(smallRadius),
        randomY(smallRadius),
        smallRadius,
        true,
      );
      while (particle.collide(this.bigParticle)) {
        particle.x = randomX(smallRadius);
        particle.y = randomY(smallRadius);
      }
      particle.setColor(palette[i % palette.length]);
      this.particles.push(particle);
    }
  }

  draw() {
    this.bigParticle.draw();
    this.particles.forEach((particle) => {
      particle.draw();
    });
  }

  showOn(stage: Container) {
    stage.addChild(...this.particles, this.bigParticle);
  }

  trace(stage: Container) {
    if (this.tracing.length >= 1024) {
      const first = this.tracing.shift();
      stage.removeChild(first);
    }

    this.tracing.forEach(point => {
      point.alpha -= 0.001;
    });

    const last = new Particle(this.bigParticle.x, this.bigParticle.y, 1);
    last.setColor(0xFF0000);
    last.draw();
    this.tracing.push(last);
    stage.addChild(last);
  }

  move(dTime: number) {
    this.bigParticle.move(dTime);
    this.particles.forEach((p) => p.move(dTime));
  }

  collisionHandling(dTime: number) {
    // Checking collision aganist big particle
    this.particles.forEach((p) => {
      collide2Particles(this.bigParticle, p, dTime);
    });

    // Check collision between smaller particles
    const qt = new QuadTree(0, 0, window.innerWidth, window.innerHeight);
    const particles = this.particles;
    particles.forEach((p) => {
      qt.insert(p);
    });
    for (const p1 of particles) {
      const possibleParticles = qt.query(p1);
      for (const p2 of possibleParticles) {
        collide2Particles(p1, p2, dTime);
      }
    }
  }
}

export default BrownianSystem;
