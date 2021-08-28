import { Line, LineRenderer } from '../components/Line';
import { Point, PointRenderer } from '../components/Point';

const YELLOW = 0xffff00;
const GREEN = 0x00ff00;
const GRAY = 0xaaaaaa;

export function* giftWrapping(pr: PointRenderer, lr: LineRenderer): Generator {
  lr.clearAll();
  if (pr.points.length < 3) return;
  const hull: Point[] = [];

  // leftmost point
  let pointOnHull = pr.points[0];
  for (let p of pr.points) {
    if (pointOnHull.x > p.x) pointOnHull = p;
  }

  let endPoint: Point;

  do {
    hull.push(pointOnHull);
    endPoint = pr.points[0];

    // Connect dootd by yellow line
    let yellowLine = lr.connect(pointOnHull, endPoint);
    yellowLine.updateColor(YELLOW);
    yield;

    for (let i = 1; i < pr.points.length; i++) {
      // Connect gray line
      const point = pr.points[i];
      if (point == pointOnHull) continue;

      const grayLine = lr.connect(pointOnHull, point);
      grayLine.updateColor(GRAY);
      yield;

      if (
        endPoint == pointOnHull ||
        clockwise(pointOnHull, endPoint, point) < 0
      ) {
        endPoint = point;

        // Gray line -> yellow line
        lr.removeLine(yellowLine);
        yellowLine = grayLine;
        yellowLine.updateColor(YELLOW);
        yield;
      } else {
        // Remove the line
        lr.removeLine(grayLine);
        yield;
      }
    }

    // Next point found
    pointOnHull = endPoint;
    yellowLine.updateColor(GREEN);
    yield;

    // find the most counter-clockwise point
  } while (endPoint != hull[0]);
}

function clockwise(pivot: Point, p1: Point, p2: Point) {
  const x1 = p1.x - pivot.x;
  const y1 = p1.y - pivot.y;
  const x2 = p2.x - pivot.x;
  const y2 = p2.y - pivot.y;

  return x1 * y2 - y1 * x2;
}

export function* grahamScan(pr: PointRenderer, lr: LineRenderer): Generator {
  lr.clearAll();

  // Sort all the points
  let points = [...pr.points];

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

  const pointStack = [point_lowest];
  const lineStack: Line[] = [];

  for (let [_, point] of angleAndPoints) {
    lineStack.at(-1)?.updateColor(GREEN);
    const newLine = lr.connect(pointStack.at(-1), point);
    newLine.updateColor(YELLOW);
    lineStack.push(newLine);
    while (
      pointStack.length > 1 &&
      clockwise(
        pointStack.at(-1),
        pointStack.at(-2),
        point,
      ) >= 0
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

function getAngle(p1: Point, p2: Point) {
  const x = p2.x - p1.x;
  const y = p2.y - p1.y;
  if (x === 0 && y === 0) return 0;
  return Math.acos(x / Math.sqrt(x ** 2 + y ** 2));
}

function distanceSq(p1: Point, p2: Point) {
  const x = p2.x - p1.x;
  const y = p2.y - p1.y;
  return x ** 2 + y ** 2;
}
