import {
  add,
  lusolve,
  Matrix,
  matrix,
  multiply,
  ones,
  zeros,
  MathType
} from 'mathjs';
import p5, { Vector } from 'p5';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min) + min);
}

const dTime = 1 / 30;
const total = 600;

const step = (coef: number, y: Matrix, y_: Matrix) => {
  return add(y, multiply(y_, coef)) as Matrix;
}

class ChaosPendulum {
  gravity = 100;
  n: number;

  masses: number[];
  sums: number[];

  lengths: number[];

  thetas: Matrix;
  omegas: Matrix;

  M: Matrix;

  colors: number[][];

  constructor(n: number = 5) {
    this.n = n;
    const zeroArrays = Array(n).fill(0);

    // Mass
    this.masses = zeroArrays.map(() => 1);
    this.sums = zeroArrays;
    this.updateSums();

    // Length and matrix
    this.lengths = zeroArrays.map(() => total / n);
    this.updateMatrix();

    // Angles as matrix type
    this.thetas = multiply(ones(n, 1, 'dense') as Matrix, Math.PI / 2);
    this.omegas = zeros(n, 1, 'dense') as Matrix;

    // Color
    this.colors = zeroArrays.map(() => [
      getRandomInt(0, 256),
      getRandomInt(0, 256),
      getRandomInt(0, 256),
    ]);
  }

  drawString(canvas: p5, origin: Vector) {
    canvas.stroke(255);
    canvas.strokeWeight(4);
    let prev = origin.copy();
    let next = origin.copy();
    for (let i = 0; i < this.n; i++) {
      next.add(
        this.lengths[i] * Math.sin(this.thetas.get([i, 0])),
        this.lengths[i] * Math.cos(this.thetas.get([i, 0])),
      );
      canvas.line(prev.x, prev.y, next.x, next.y);
      prev.x = next.x;
      prev.y = next.y;
    }
  }

  drawBobs(canvas: p5, origin: Vector) {
    canvas.noStroke();
    canvas.fill(51);
    const center = origin.copy();
    for (let i = 0; i < this.n; i++) {
      center.add(
        this.lengths[i] * Math.sin(this.thetas.get([i, 0])),
        this.lengths[i] * Math.cos(this.thetas.get([i, 0])),
      );
      const [r, g, b] = this.colors[i];
      canvas.fill(r, g, b);
      canvas.circle(center.x, center.y, 20);
    }
  }

  draw(canvas: p5, origin: Vector) {
    this.drawString(canvas, origin);
    this.drawBobs(canvas, origin);
  }

  private updateSums() {
    let acc = 0;
    for (let i = this.n - 1; i >= 0; i--) {
      acc += this.masses[i];
      this.sums[i] = acc;
    }
  }

  private updateMatrix() {
    const { n } = this;
    const m = (zeros([n, n]) as number[][]).map((row, i) => {
      return (row as number[]).map((_, j) => {
        return this.sums[Math.max(i, j)] * this.lengths[j];
      });
    });
    this.M = matrix(m);
  }

  private matrixA(_thetas: Matrix) {
    return this.M.map((_value, index) => {
      const [i, j] = (index as unknown) as number[];
      return _value * Math.cos(_thetas.get([i, 0]) - _thetas.get([j, 0]));
    });
  }

  private matrixB(_thetas: Matrix, _omegas: Matrix) {
    const b = _thetas.map((theta, indices) => {
      const [i] = (indices as unknown) as number[];
      return -Math.sin(theta) * this.gravity * this.sums[i];
    });

    for (let i = 0; i < this.n; i++) {
      let value = b.get([i, 0]);
      for (let j = 0; j < this.n; j++) {
        value -=
          this.M.get([i, j]) *
          _omegas.get([j, 0]) ** 2 *
          Math.sin(_thetas.get([i, 0]) - _thetas.get([j, 0]));
      }
      b.set([i, 0], value);
    }
    return b;
  }

  solve(_thetas: Matrix, _omegas: Matrix) {
    const A = this.matrixA(_thetas);
    const b = this.matrixB(_thetas, _omegas);
    const x = lusolve(A, b) as Matrix;
    return [_omegas, x];
  }

  move() {
    const {thetas, omegas} = this;
    const [k1, k1_] = this.solve(thetas, omegas);
    const [k2, k2_] = this.solve(step(0.5 * dTime, thetas, k1), step(0.5 * dTime, omegas, k1_));
    const [k3, k3_] = this.solve(step(0.5 * dTime, thetas, k2), step(0.5 * dTime, omegas, k2_));
    const [k4, k4_] = this.solve(step(dTime, thetas, k3), step(dTime, omegas, k3_));

    // Add to omegas
    const addMany = add as unknown as (...elements: MathType[]) => MathType
    const dOmegas = addMany(k1_, multiply(k2_, 2), multiply(k3_, 2), k4_) as Matrix;
    this.omegas = step(dTime / 6, omegas, dOmegas);

    // Add to thetas
    const dTheta = addMany(k1, multiply(k2, 2), multiply(k3, 2), k4) as Matrix;
    this.thetas = step(dTime / 6, thetas, dTheta);
  }
}

export default ChaosPendulum;
