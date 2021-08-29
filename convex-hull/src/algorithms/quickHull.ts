import { rgb2hex } from '@pixi/utils';
import { Line, LineRenderer } from '../components/Line';
import { Point } from '../components/Point';
import { GRAY, GREEN, YELLOW } from '../utils/constant';
import { dotProduct } from '../utils/utils';

export function* quickHull(points: Point[], lr: LineRenderer): Generator {
  lr.clearAll();
  // Find left most and right most points
  let leftmost = points[0],
    rightmost = points[0];
  points.forEach((point) => {
    if (point.x < leftmost.x) leftmost = point;
    if (point.x > rightmost.x) rightmost = point;
  });

  leftmost.updateColor(GREEN);
  yield;
  rightmost.updateColor(GREEN);
  yield;

  // Connect with leftmost and rightmost
  const leftRight = makeLine(lr, leftmost, rightmost, YELLOW);
  const rightLeft = makeLine(lr, rightmost, leftmost, YELLOW);

  // Partition through a line
  const [up, down] = yield* partitionLine(points, leftmost, rightmost);

  yield* findHull(up, [leftmost, rightmost], lr, leftRight);
  yield* findHull(down, [rightmost, leftmost], lr, rightLeft);
  console.log('DONE');
}

// Find the hull on the top of oriented line from A to B
function* findHull(
  points: Point[],
  direction: Point[],
  lr: LineRenderer,
  line: Line,
): Generator {
  if (points.length === 0) {
    line.updateColor(GREEN);
    yield;
    return;
  }
  lr.removeLine(line);
  const [A, B] = direction;
  const [C, lineCA, lineCB] = yield* findFurthest(points, direction, lr);
  C.updateColor(GREEN);
  yield;
  
  const [regionCA, regionCB] = yield* partitionTriangle(points, [C, A, B]);

  yield* findHull(regionCA, [A, C], lr, lineCA);
  yield* findHull(regionCB, [C, B], lr, lineCB);
}

function* findFurthest(
  points: Point[],
  direction: Point[],
  lr: LineRenderer,
): Generator<unknown, [Point, Line, Line], unknown> {
  // The yellow lines connect to the most recent furthest point
  // The gray lines connect to the points in the loop
  const [A, B] = direction;

  let furthest = points[0];
  let smallestProduct = dotProduct(A, B, furthest);

  let lineCA = makeLine(lr, furthest, A, YELLOW);
  let lineCB = makeLine(lr, furthest, B, YELLOW);

  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    const tmpLineCA = makeLine(lr, point, A);
    const tmpLineCB = makeLine(lr, point, B);
    yield;
    const product = dotProduct(A, B, point);
    if (product < smallestProduct) {
      furthest = point;
      smallestProduct = product;

      // Update yellow line
      lr.removeLine(lineCA);
      lr.removeLine(lineCB);
      lineCA = tmpLineCA;
      lineCB = tmpLineCB;
      lineCA.updateColor(YELLOW);
      lineCB.updateColor(YELLOW);
    } else {
      lr.removeLine(tmpLineCA);
      lr.removeLine(tmpLineCB)
    }
    yield;
  }
  return [furthest, lineCA, lineCB];
}

// Partition the point set by the oriented line AB
function* partitionLine(
  points: Point[],
  A: Point,
  B: Point,
): Generator<unknown, [Point[], Point[]], unknown> {
  const up: Point[] = [];
  const down: Point[] = [];
  const upColor = randomColor();
  const downColor = 0xffffff - upColor;
  for (const point of points) {
    if (point == A || point == B) continue;
    const p = dotProduct(A, B, point);
    if (p < 0) {
      point.updateColor(upColor);
      up.push(point);
    }
    else if (p > 0) {
      down.push(point);
      point.updateColor(downColor);
    } else {
      point.updateColor(GRAY);
    }
    yield;
  }

  return [up, down];
}

// Partition points by triangle
// A is the furthest point from BC
function* partitionTriangle(
  points: Point[],
  triangle: Point[],
): Generator<unknown, [Point[], Point[]], unknown> {
  const regionAB: Point[] = [];
  const regionAC: Point[] = [];
  const colorAB = randomColor();
  const colorAC = 0xffffff - colorAB;
  const [A, B, C] = triangle;
  for (const point of points) {
    if (point == A || point == B || point == C) continue;
    if (dotProduct(A, B, point) > 0) {
      regionAB.push(point);
      point.updateColor(colorAB);
    } else if (dotProduct(A, C, point) < 0) {
      regionAC.push(point);
      point.updateColor(colorAC);
    } else {
      point.updateColor(GRAY);
    }
    yield;
  }

  return [regionAB, regionAC];
}

function randomColor() {
  const r = Math.random();
  return rgb2hex([r, 0, 1 - r]);
}

function makeLine(
  lr: LineRenderer,
  p1: Point,
  p2: Point,
  color: number = GRAY,
) {
  const line = lr.connect(p1, p2);
  line.updateColor(color);
  return line;
}
