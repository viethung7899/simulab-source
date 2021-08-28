import { LineRenderer } from '../components/Line';
import { Point } from '../components/Point';

export const YELLOW = 0xffff00;
export const GREEN = 0x00ff00;
export const GRAY = 0xaaaaaa;

export type Algorithm = (points: Point[], lr: LineRenderer) => Generator;
