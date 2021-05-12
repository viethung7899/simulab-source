import { Container } from '@pixi/display';
import { Rectangle } from '@pixi/math';
import { Sprite } from '@pixi/sprite';
import Vector2D from '../utils/Vector';
import { Seed } from './Seed';

export class VoronoiGrid {
  seeds: Seed[] = [];
  container: Container;
  background: Sprite;

  totalRow = 3;
  totalCol = 2;

  constructor(boundary: Rectangle, row = 3, col = 2) {
    this.container = new Container();

    this.totalRow = row;
    this.totalCol = col;

    // Initialize background
    this.background = new Sprite();
    this.background.filterArea = boundary;
    this.container.addChild(this.background);

    // Initialize the grid
    for (let i = 0; i < this.totalRow; i++) {
      for (let j = 0; j < this.totalCol; j++) {
        this._addSeed(i, j);
      }
    }

    this.updatePosition();
  }

  updatePosition() {
    const width = this.background.filterArea.width / this.totalCol;
    const height = this.background.filterArea.height / this.totalRow;
    this.seeds.forEach((seed) => {
      const { rowIndex, colIndex } = seed;
      const x = (colIndex + seed.normalizedPosition.x) * width;
      const y = (rowIndex + seed.normalizedPosition.y) * height;
      seed.updatePosition(x, y);
    });
  }

  move(delta: number) {
    this.seeds.forEach(seed => seed.move(delta));
    this.updatePosition();
  }

  addRow() {
    for (let i = 0; i < this.totalCol; i++) {
      this._addSeed(this.totalRow, i);
    }

    this.totalRow++;
    this.updatePosition();
  }

  addCol() {
    for (let i = 0; i < this.totalRow; i++) {
      this._addSeed(i, this.totalCol);
    }

    this.totalCol++;
    this.updatePosition();
  }

  removeRow() {
    this.totalRow--;
    this.seeds = this.seeds.filter(seed => {
      const condition = seed.rowIndex == this.totalRow;
      if (condition) {
        this.container.removeChild(seed);
      }
      return !condition;
    })
    this.updatePosition();
  }

  removeCol() {
    this.totalCol--;
    this.seeds = this.seeds.filter(seed => {
      const condition = seed.colIndex == this.totalCol;
      if (condition) {
        this.container.removeChild(seed);
      }
      return !condition;
    })
    this.updatePosition();
  }

  _addSeed(row: number, col: number) {
    const seed = new Seed(row, col);
        seed.draw();
        this.seeds.push(seed);
        this.container.addChild(seed);
  }

  reset() {
    this.seeds.forEach(seed => {
      seed.normalizedPosition.setVector(0.5, 0.5);
      seed.velocity = Vector2D.random();
    });

    this.updatePosition();
  }
}
