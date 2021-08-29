import { Line, LineRenderer } from '../components/Line';
import { Point } from '../components/Point';
import { GREEN, YELLOW } from '../utils/constant';

// Data structure for point
type PointNode = {
  point: Point;
  cwNext: PointNode; // Next clockwise node
  ccwNext: PointNode; // Next counter-clockwise node
};

export function* divideConquer(points: Point[], lr: LineRenderer): Generator {
  lr.clearAll();
  points.sort((p1, p2) => {
    const diff = p1.x - p2.x;
    return diff === 0 ? p1.y - p2.y : diff;
  }); // Sort all the points (for only once)

  const pointNodes = points.map<PointNode>((point) => ({
    point,
    cwNext: null,
    ccwNext: null,
  }));

  const lineMap = new LineMapRenderer(pointNodes, lr);

  yield* convexHull(pointNodes, lineMap);
}

// Return the convex hull in the form of link list
function* convexHull(
  points: PointNode[],
  lm: LineMapRenderer,
): Generator<unknown, PointNode, unknown> {
  const N = points.length;
  // Base case
  if (N < 1) return null;
  if (N == 1) {
    const node = points[0];
    node.ccwNext = node;
    node.cwNext = node;
    return node;
  }
  if (N == 2) {
    const n1 = points[0],
      n2 = points[1];
    n1.cwNext = n2;
    n2.cwNext = n1;
    n1.ccwNext = n2;
    n2.ccwNext = n1;
    lm.connectPoints(n1, n2).updateColor(GREEN);
    lm.connectPoints(n2, n1).updateColor(GREEN);
    yield;
    return n1;
  }

  // Divide the point set in two halves
  const L = points.slice(0, Math.floor(N / 2));
  const R = points.slice(Math.floor(N / 2));

  // Solve convex hull for each half
  const leftHull = yield* convexHull(L, lm);
  const rightHull = yield* convexHull(R, lm);

  // Marge two hull
  if (!leftHull) return rightHull;
  else if (!rightHull) return leftHull;
  else return yield* merge(leftHull, rightHull, lm);
}

function* merge(
  leftHull: PointNode,
  rightHull: PointNode,
  lm: LineMapRenderer,
): Generator<unknown, PointNode, unknown> {
  // Get the rightmost of the leftHull
  while (leftHull.cwNext.point.x > leftHull.point.x) {
    leftHull = leftHull.cwNext;
  }

  // Get the leftmost of the rightHull
  while (rightHull.ccwNext.point.x < rightHull.point.x) {
    rightHull = rightHull.ccwNext;
  }

  // Middle point L
  const mid = (leftHull.point.x + rightHull.point.x) / 2;

  // Upper tagent
  let upperLeft = leftHull,
    upperRight = rightHull;
  lm.connectPoints(upperLeft, upperRight).updateColor(YELLOW);
  yield;
  while (
    value(upperLeft, upperRight.cwNext, mid) <
      value(upperLeft, upperRight, mid) ||
    value(upperLeft.ccwNext, upperRight, mid) <
      value(upperLeft, upperRight, mid)
  ) {
    lm.removeLine(upperLeft, upperRight);
    if (
      value(upperLeft, upperRight.cwNext, mid) <
      value(upperLeft, upperRight, mid)
    ) {
      lm.removeLine(upperRight, upperRight.cwNext);
      // move right pointer clockwise
      upperRight = upperRight.cwNext;
    } else {
      lm.removeLine(upperLeft, upperLeft.ccwNext);
      // move left pointer counter-clockwise
      upperLeft = upperLeft.ccwNext;
    }
    const line = lm.connectPoints(upperLeft, upperRight);
    line.updateColor(YELLOW);
    yield;
  }

  lm.getLine(upperLeft, upperRight)?.updateColor(GREEN);
  yield;

  // Lower tangent
  let lowerLeft = leftHull;
  let lowerRight = rightHull;
  lm.connectPoints(lowerLeft, lowerRight).updateColor(YELLOW);
  yield;
  while (
    value(lowerLeft, lowerRight.ccwNext, mid) >
      value(lowerLeft, lowerRight, mid) ||
    value(lowerLeft.cwNext, lowerRight, mid) > value(lowerLeft, lowerRight, mid)
  ) {
    lm.removeLine(lowerLeft, lowerRight);
    if (
      value(lowerLeft, lowerRight.ccwNext, mid) >
      value(lowerLeft, lowerRight, mid)
    ) {
      lm.removeLine(lowerRight, lowerRight.ccwNext);
      // move right pointer counter-clockwise
      lowerRight = lowerRight.ccwNext;
    } else {
      lm.removeLine(lowerLeft, lowerLeft.cwNext);
      // move left pointer clockwise
      lowerLeft = lowerLeft.cwNext;
    }
    const line = lm.connectPoints(lowerLeft, lowerRight);
    line.updateColor(YELLOW);
    yield;
  }

  lm.getLine(lowerLeft, lowerRight)?.updateColor(GREEN);
  yield;

  // Connect upper tangent
  upperLeft.cwNext = upperRight;
  upperRight.ccwNext = upperLeft;

  // Connect lower tangent
  lowerRight.cwNext = lowerLeft;
  lowerLeft.ccwNext = lowerRight;

  return upperLeft;
}

// Interpolate
function value(p1: PointNode, p2: PointNode, mid: number) {
  const t = (mid - p1.point.x) / (p2.point.x - p1.point.x);
  return p1.point.y + t * (p2.point.y - p1.point.y);
}

// Implement lineMap for fast graphic retrieval
class LineMapRenderer {
  // Mapping each point to a index
  private _pointMap: Map<PointNode, number>;
  // Mapping a pair of indices to the line
  private _lineMap: Line[][];
  private _count: number[][];
  private _renderer: LineRenderer;

  constructor(points: PointNode[], lr: LineRenderer) {
    this._pointMap = new Map<PointNode, number>();
    points.forEach((point, index) => this._pointMap.set(point, index));

    this._lineMap = [...Array(points.length)].map<Line[]>((_) =>
      Array<Line>(points.length).fill(null),
    );

    this._count = [...Array(points.length)].map<number[]>((_) =>
      Array<number>(points.length).fill(0),
    );

    this._renderer = lr;
  }

  connectPoints(p1: PointNode, p2: PointNode) {
    const i1 = this._pointMap.get(p1);
    const i2 = this._pointMap.get(p2);
    if (this._count[i1][i2] == 0) {
      const line = this._renderer.connect(p1.point, p2.point);
      this._lineMap[i1][i2] = line;
      this._lineMap[i2][i1] = line;
    }
    this._count[i1][i2] += 1;
    this._count[i2][i1] += 1;

    return this.getLine(p1, p2);
  }

  getLine(p1: PointNode, p2: PointNode) {
    const i1 = this._pointMap.get(p1);
    const i2 = this._pointMap.get(p2);

    return this._lineMap[i1][i2];
  }

  removeLine(p1: PointNode, p2: PointNode) {
    const i1 = this._pointMap.get(p1);
    const i2 = this._pointMap.get(p2);
    if (this._count[i1][i2] > 0) {
      this._count[i1][i2] -= 1;
      this._count[i2][i1] -= 1;
      if (this._count[i1][i2] == 0) {
        this._renderer.removeLine(this._lineMap[i1][i2]);
        this._lineMap[i1][i2] = null;
        this._lineMap[i2][i1] = null;
      }
    }
  }
}
