import { LineRenderer } from '../components/Line';
import { Point, PointRenderer } from '../components/Point';
import { GRAY, GREEN, YELLOW } from '../utils/constant';
import { clockwise } from '../utils/utils';

export function* giftWrapping(pr: PointRenderer, lr: LineRenderer): Generator {
  lr.clearAll();
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
