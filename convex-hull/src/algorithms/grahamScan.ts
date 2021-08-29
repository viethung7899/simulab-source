import { rgb2hex } from '@pixi/utils';
import { Line, LineRenderer } from '../components/Line';
import { Point } from '../components/Point';
import { GRAY, GREEN, YELLOW } from '../utils/constant';
import { distanceSq, dotProduct, getAngle } from '../utils/utils';

export function* grahamScan(points: Point[], lr: LineRenderer): Generator {
  let point_lowest = points[0];
  points.forEach((point) => {
    // Find lowest y-coord. If equals, find the lowest x-coord
    if (
      point_lowest.y > point.y ||
      (point_lowest.y === point.y && point_lowest.x > point.x)
    ) {
      point_lowest = point;
    }
  });

  // Mark the color
  point_lowest.updateColor(0xff0000);

  // Calculate angle
  const pointMap = new Map<number, Point>();
  for (let point of points) {
    if (point == point_lowest) continue;
    const angle = getAngle(point_lowest, point);
    const p = pointMap.get(angle);
    if (
      (p && distanceSq(point_lowest, p) < distanceSq(point_lowest, point)) ||
      !p
    ) {
      pointMap.set(angle, point);
    }
  }

  // Sort points by angle
  const angleAndPoints = [...pointMap.entries()].sort();

  for (let i = 0; i < angleAndPoints.length; i++) {
    const r = i / angleAndPoints.length;
    const line = lr.connect(point_lowest, angleAndPoints[i][1]);
    line.updateColor(GRAY);
    angleAndPoints[i][1].updateColor(rgb2hex([r, 0, 1 - r]));
    yield;
    lr.removeLine(line);
  }

  const pointStack = [point_lowest];
  const lineStack: Line[] = [];

  for (let [_, point] of angleAndPoints) {
    lineStack.at(-1)?.updateColor(GREEN);
    const newLine = lr.connect(pointStack.at(-1), point);
    newLine.updateColor(YELLOW);
    lineStack.push(newLine);
    while (
      pointStack.length > 1 &&
      dotProduct(pointStack.at(-1), pointStack.at(-2), point) >= 0
    ) {
      // Delete the last two lines
      lr.removeLine(lineStack.pop());
      lr.removeLine(lineStack.pop());

      // Reinsert new line
      pointStack.pop();
      const newLine = lr.connect(point, pointStack.at(-1));
      newLine.updateColor(YELLOW);
      lineStack.push(newLine);
      yield;
    }
    pointStack.push(point);
    yield;
  }

  lineStack.at(-1)?.updateColor(GREEN);
  yield;
  lr.connect(pointStack.at(0), pointStack.at(-1)).updateColor(GREEN);
  yield;
}
