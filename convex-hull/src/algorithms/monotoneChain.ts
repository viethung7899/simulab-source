import { rgb2hex } from '@pixi/utils';
import { Line, LineRenderer } from '../components/Line';
import { Point } from '../components/Point';
import { GREEN, YELLOW } from '../utils/constant';
import { dotProduct } from '../utils/utils';

// Monotone chain algorithms
export function* monoToneChain(points: Point[], lr: LineRenderer): Generator {
  // Sort all point by x-coord
  // If two points have some x-coord, sort by y-coord
  const N = points.length;
  points.sort(comparePoint);
  for (let i = 0; i < N; i++) {
    const r = i / N;
    points[i].updateColor(rgb2hex([r, 0, 1 - r]));
    yield;
  }

  // Store upper hull and lower hall as an stack
  const upper: Point[] = [points.at(0)];
  const upperLines: Line[] = [];

  const lower: Point[] = [points.at(-1)];
  const lowerLines: Line[] = [];

  // Draw hull
  function* drawHull(
    index: number,
    pointStack: Point[],
    lineStack: Line[],
  ): Generator {
    const point = points[index];
    lineStack.at(-1)?.updateColor(GREEN);
    const newLine = lr.connect(pointStack.at(-1), point);
    newLine.updateColor(YELLOW);
    lineStack.push(newLine);
    while (
      pointStack.length > 1 &&
      dotProduct(pointStack.at(-1), pointStack.at(-2), point) >= 0
    ) {
      lineStack.at(-1)?.updateColor(GREEN);
      lr.removeLine(lineStack.pop());
      lr.removeLine(lineStack.pop());
      pointStack.pop();

      const newLine = lr.connect(point, pointStack.at(-1));
      newLine.updateColor(YELLOW);
      lineStack.push(newLine);
      yield;
    }
    pointStack.push(point);
  }

  // Draw upper hull
  for (let i = 1; i < N; i++) {
    yield* drawHull(i, upper, upperLines);
  }
  upperLines.at(-1)?.updateColor(GREEN);
  yield;

  // Draw lower hull
  for (let i = N - 2; i >= 0; i--) {
    yield* drawHull(i, lower, lowerLines);
  }
  lowerLines.at(-1)?.updateColor(GREEN);
  yield;
}

function comparePoint(p1: Point, p2: Point) {
  const diff = p1.x - p2.x;
  return diff === 0 ? p1.y - p2.y : diff;
}
