import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import Box from '../utils/Box';
import Particle from './Particle';

const MAX_DEPTH = 5;
const MAX_CAPACITY = 4;

const QT = {
  UNDEFINED: -1,
  NORTH_WEST: 0,
  NORTH_EAST: 1,
  SOUTH_WEST: 2,
  SOUTH_EAST: 3,
};

export default class QuadTree {
  boundary: Box;
  particles: Particle[] = [];
  children: QuadTree[] = [];
  level: number;

  constructor(x: number, y: number, width: number, height: number, level = 0) {
    this.boundary = new Box(x, y, width, height);
    this.level = level;
  }

  insert(p: Particle) {
    const pIndex = this._getIndex(p);

    // Quadrants already exist
    if (pIndex !== QT.UNDEFINED && this.children.length !== 0) {
      this.children[pIndex].insert(p);
      return;
    }

    this.particles.push(p);
    if (pIndex === QT.UNDEFINED) return;

    // Exceed capacity
    if (this.particles.length > MAX_CAPACITY && this.level < MAX_DEPTH) {
      if (this.children.length === 0) {
        this.divide();
      }

      let i = 0;
      while (i < this.particles.length) {
        const particle = this.particles[i];
        const index = this._getIndex(particle);
        if (index !== QT.UNDEFINED) {
          this.particles.splice(i, 1);
          this.children[index].insert(particle);
        } else i++;
      }
    }
  }

  // Return all particles possibly colliding with p
  query(p: Particle) {
    const index = this._getIndex(p);
    const result = [...this.particles];
    if (index !== QT.UNDEFINED && this.children.length > 0) {
      result.push(...this.children[index].query(p));
    }

    return result;
  }

  _getIndex(p: Particle) {
    const { x, y, width, height } = this.boundary;
    const verticalMidpoint = x + width / 2;
    const horizontalMidpoint = y + height / 2;

    const onTop = p.y - p.radius < horizontalMidpoint;
    const onBottom = p.y + p.radius > horizontalMidpoint;
    const onLeft = p.x - p.radius < verticalMidpoint;
    const onRight = p.x + p.radius > verticalMidpoint;

    if (onTop) {
      if (onLeft) return QT.NORTH_WEST;
      if (onRight) return QT.NORTH_EAST;
    }

    if (onBottom) {
      if (onLeft) return QT.SOUTH_WEST;
      if (onRight) return QT.SOUTH_EAST;
    }

    return QT.UNDEFINED;
  }

  divide() {
    const { x, y, width, height } = this.boundary;
    const nw = new QuadTree(x, y, width / 2, height / 2, this.level + 1);
    const ne = new QuadTree(
      x + width / 2,
      y,
      width / 2,
      height / 2,
      this.level + 1,
    );
    const sw = new QuadTree(
      x,
      y + height / 2,
      width / 2,
      height / 2,
      this.level + 1,
    );
    const se = new QuadTree(
      x + width / 2,
      y + height / 2,
      width / 2,
      height / 2,
      this.level + 1,
    );
    this.children.push(nw, ne, sw, se);
  }

  drawLines(container: Container) {
    const { x, y, width, height } = this.boundary;
    const verticalMidpoint = x + width / 2;
    const horizontalMidpoint = y + height / 2;

    const lines = new Graphics();
    lines
      .lineStyle({
        color: 0x00ff00,
        width: 1,
      })
      .moveTo(verticalMidpoint, y)
      .lineTo(verticalMidpoint, y + height)
      .moveTo(x, horizontalMidpoint)
      .lineTo(x + width, horizontalMidpoint);

    container.addChild(lines);

    this.children.forEach((p) => p.drawLines(container));
  }
}
