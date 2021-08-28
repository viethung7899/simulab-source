import { Point } from '../components/Point';

export function clockwise(pivot: Point, p1: Point, p2: Point) {
  const x1 = p1.x - pivot.x;
  const y1 = p1.y - pivot.y;
  const x2 = p2.x - pivot.x;
  const y2 = p2.y - pivot.y;

  return x1 * y2 - y1 * x2;
}

export function getAngle(p1: Point, p2: Point) {
  const x = p2.x - p1.x;
  const y = p2.y - p1.y;
  if (x === 0 && y === 0) return 0;
  return Math.acos(x / Math.sqrt(x ** 2 + y ** 2));
}

export function distanceSq(p1: Point, p2: Point) {
  const x = p2.x - p1.x;
  const y = p2.y - p1.y;
  return x ** 2 + y ** 2;
}
