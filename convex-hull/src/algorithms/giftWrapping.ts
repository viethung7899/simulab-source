import { LineRenderer } from '../components/Line';
import { Point } from '../components/Point';
import { GRAY, GREEN, YELLOW } from '../utils/constant';
import { dotProduct } from '../utils/utils';

export function* giftWrapping(points: Point[], lr: LineRenderer): Generator {
  const hull: Point[] = [];

  // leftmost point
  let pointOnHull = points[0];
  for (let p of points) {
    if (pointOnHull.x > p.x) pointOnHull = p;
  }

  let endPoint: Point;

  do {
    hull.push(pointOnHull);
    endPoint = points[0];

    // Connect dootd by yellow line
    let yellowLine = lr.connect(pointOnHull, endPoint);
    yellowLine.updateColor(YELLOW);
    yield;

    for (let i = 1; i < points.length; i++) {
      // Connect gray line
      const point = points[i];
      if (point == pointOnHull) continue;

      const grayLine = lr.connect(pointOnHull, point);
      grayLine.updateColor(GRAY);
      yield;

      if (
        endPoint == pointOnHull ||
        dotProduct(pointOnHull, endPoint, point) < 0
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

    // find the most counter-dotProduct point
  } while (endPoint != hull[0]);
}
