import { lusolve, transpose } from 'mathjs';
import Ball from './Ball';
import { Pendulums } from './Pendulums';

export class Solver {
  private pendulums: Pendulums;
  private accumulateMass: number[];
  private M: number[][]; // matrix

  constructor(pendulum: Pendulums) {
    this.pendulums = pendulum;
    this.update();
  }

  // The result should be formated as
  // [m_1 + m_2 + ... + m_n, m_2 + ... + m_n, ..., m_n]
  private _updateAccumulateMasses() {
    const balls = this.pendulums.balls;
    const masses = balls.map((_) => balls.at(-1).mass);
    for (let i = balls.length - 2; i >= 0; i--) {
      masses[i] = masses[i + 1] + balls[i].mass;
    }
    this.accumulateMass = masses;
  }

  // M(i, j) = acc_sums[max(i, j)] * length[j];
  private _updateMatrix() {
    const balls = this.pendulums.balls;
    this.M = balls.map((_, i) => {
      return balls.map(
        (ball, j) => this.accumulateMass[Math.max(i, j)] * ball.length,
      );
    });
  }

  // The matrix of the equation (size n * n)
  // A(i, j) = M(i, j) * cos(theta[i] - theta[j])
  private _matrixA(_thetas: number[]) {
    return this.M.map((row, i) =>
      row.map((value, j) => value * Math.cos(_thetas[i] - _thetas[j])),
    );
  }

  // The vector of the equation (size 1 * n)
  // b[i] = -sin(thetas[i]) * g * acc_sum[i]
  // - sigma {j = 0..n} M(i, j) * omega[j] ^ 2 * sin(thetas[i] - thetas[j])
  private _matrixB(_thetas: number[], omegas: number[]) {
    const g = this.pendulums.gravity;
    return this.M.map((row, i) =>
      row.reduce(
        (acc, value, j) =>
          acc - value * omegas[j] ** 2 * Math.sin(_thetas[i] - _thetas[j]),
        -Math.sin(_thetas[i]) * g * this.accumulateMass[i],
      ),
    );
  }

  // Solve the linear system Ax = b
  // Return [theta', omegas'] * dT
  private _solve(
    thetas: number[],
    omegas: number[],
    dT: number,
  ) {
    const A = this._matrixA(thetas);
    const b = this._matrixB(thetas, omegas);
    const alphas = (transpose(lusolve(A, b)) as number[][])[0];
    return [
      omegas.map((omega) => omega * dT),
      alphas.map((alpha) => alpha * dT),
    ];
  }

  // Return v1 + a * v2
  // v1 and v2 should have the same size
  private _add(v1: number[], v2: number[], alpha: number = 1) {
    return v1.map((value, i) => value + alpha * v2[i]);
  }

  step(dT: number) {
    // Extract thetas and omegas
    const balls = this.pendulums.balls;
    if (balls.length === 0) return;
    const thetas = balls.map((ball) => ball.angle);
    const omegas = balls.map((ball) => ball.angularVelocity);

    // Runge-Kutta method
    const [a, a_] = this._solve(thetas, omegas, dT);
    const [b, b_] = this._solve(this._add(thetas, a, 0.5), this._add(omegas, a_, 0.5), dT);
    const [c, c_] = this._solve(this._add(thetas, b, 0.5), this._add(omegas, b_, 0.5), dT);
    const [d, d_] = this._solve(this._add(thetas, c), this._add(omegas, c_), dT);

    balls.forEach((ball, i) => ball.updatePhase(
      (a[i] + 2 * b[i] + 2 * c[i] + d[i]) / 6,
      (a_[i] + 2 * b_[i] + 2 * c_[i] + d_[i]) / 6,
    ));

    this.pendulums.update();
  }

  update() {
    this._updateAccumulateMasses();
    this._updateMatrix();
  }
}
