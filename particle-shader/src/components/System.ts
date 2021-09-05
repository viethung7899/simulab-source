import { AbstractRenderer, Renderer, Filter } from '@pixi/core';
import { Container } from '@pixi/display';
import { Particle } from './Particle';

const DELTA = 1;

export class System {
  private _particles: Particle[];
  private _renderer: Renderer | AbstractRenderer;
  
  private _container: Container;
  private _background: Container;

  constructor() {
    this._particles = [];
    this._container = new Container();
    this._background = new Container();
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

  showOnStage(stage: Container) {
    this._background.filterArea = this._renderer.screen;
    stage.addChild(this._background);
    stage.addChild(this._container);
  }

  
  setFilter(filter: Filter) {
    this._background.filters = [filter];
  }

  get particles() {
    return this._particles;
  }

  get filterArea() {
    return this._background.filterArea;
  }

  update() {
    // Update position
    this._particles.forEach((p) => p.move(this._renderer.screen, DELTA));
  }

  deleteAll() {
    while (this.particles.length > 0) this.removeParticle();
  }
}
