import { AbstractRenderer, Renderer } from '@pixi/core';
import { Container } from '@pixi/display';
import { Particle } from './Particle';

const DELTA = 1;

export class System {
  private _particles: Particle[];
  private _renderer: Renderer | AbstractRenderer;
  private _container: Container;

  constructor() {
    this._particles = [];
    this._container = new Container();
  }

  setRenderer(renderer: Renderer | AbstractRenderer) {
    this._renderer = renderer;
  }

  addParticle() {
    const particle = new Particle(this._renderer.screen);
    this._particles.push(particle);
    this._container.addChild(particle.graphics);
  }

  removeParticle() {
    if (this._particles.length <= 0) return;
    this._container.removeChild(this._particles.pop().graphics);
  }

  get container() {
    return this._container;
  }

  get particleNums() {
    return this._particles.length;
  }

  update() {
    // Update position
    this._particles.forEach((p) => p.move(this._renderer.screen, DELTA));
  }

  deleteAll() {
    while (this.particleNums > 0) this.removeParticle();
  }
}
