import { Container } from '@pixi/display';
import { Rectangle } from '@pixi/math';
import { Sprite } from '@pixi/sprite';
import { Seed } from './Seed';

export class VoronoiGrid {
  seeds: Seed[] = [];
  container: Container;
  background: Sprite;

  totalRow = 3;
  totalCol = 2;

  constructor(boundary: Rectangle, row: number = 3, col: number = 2) {
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
        const seed = new Seed(i, j);
        seed.draw();
        this.seeds.push(seed);
        this.container.addChild(seed);
      }
    }

    this.updatePosition();
  }

  updatePosition() {
    const width = window.innerWidth / this.totalCol;
    const height = window.innerHeight / this.totalRow;
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

  addRow() {}

  addCol() {}
}
