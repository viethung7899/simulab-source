import { Container } from '@pixi/display';
import Particle, { collide2Particles } from './Particle';
import QuadTree from './QuadTree';

const palette = [0xe79226, 0xee9965, 0xf6d99a, 0xa6af89, 0x755e67];
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
  stage: Container;

  constructor() {
    this.bigParticle = new Particle(
      window.innerWidth / 2,
      window.innerHeight / 2,
      50,
    );
  }

  setStage(stage: Container) {
    this.stage = stage;
  }

  generateRandomParticles(quantity: number) {
    for (let i = 0; i < quantity; i++) {
      const particle = new Particle(0, 0, smallRadius, true);
      particle.setColor(palette[i % palette.length]);
      this.particles.push(particle);
    }

    this._resetRandomParticles();
  }

  _resetRandomParticles() {
    this.particles.forEach((particle) => {
      do {
        particle.x = randomX(smallRadius);
        particle.y = randomY(smallRadius);
      } while (particle.collide(this.bigParticle));
    });
  }

  draw() {
    this.bigParticle.draw();
    this.particles.forEach((particle) => {
      particle.draw();
    });
  }

  show() {
    this.stage.addChild(...this.particles, this.bigParticle);
  }

  trace() {
    if (this.tracing.length >= 1024) {
      const first = this.tracing.shift();
      this.stage.removeChild(first);
    }

    this.tracing.forEach((point) => {
      point.alpha -= 0.001;
    });

    const last = new Particle(this.bigParticle.x, this.bigParticle.y, 1);
    last.setColor(0xff0000);
    last.draw();
    this.tracing.push(last);
    this.stage.addChild(last);
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

  reset() {
    this.bigParticle.x = window.innerWidth / 2;
    this.bigParticle.y = window.innerHeight / 2;
    this.stage.removeChild(...this.tracing);
    this.tracing.splice(0);
    this._resetRandomParticles();
  }
}

export default BrownianSystem;
