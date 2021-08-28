import { LineRenderer } from '../components/Line';
import { PointRenderer } from '../components/Point';

export const YELLOW = 0xffff00;
export const GREEN = 0x00ff00;
export const GRAY = 0xaaaaaa;

export type Algorithm = (pr: PointRenderer, lr: LineRenderer) => Generator;
