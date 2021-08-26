import { Container, Filter, Sprite } from 'pixi.js';
import { Entity } from '../utils/SpatialHashGrid';
import { Vector2D } from '../utils/Vector2D';

const SPEED = 2.5;
const FORCE = 0.05;
const MIN_MULT = 3;
const MAX_MULT = 4;

const vert = `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
uniform mat3 projectionMatrix;
varying vec2 vTextureCoord;
void main(void)
{
  gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
  vTextureCoord = aTextureCoord;
}
`;

const frag = `
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float alpha;
void main(void)
{
  vec4 color = texture2D(uSampler, vTextureCoord);
  if (color.a != 0.0){
      color.rgba = vec4(alpha, alpha, 0, 1.0);
  }
  gl_FragColor = color;
}
`;

type Uniform = {
  alpha: number;
};

type Shader = {
  uniform: Uniform;
  filter: Filter;
};

const newShader = (alpha: number): Shader => {
  const uniform: Uniform = { alpha };
  const filter = new Filter(vert, frag, uniform);
  return { uniform, filter };
};

export class Firefly extends Entity {
  private _direction: Vector2D;
  private _graphic: Sprite;

  private _angle: number;
  private _angleV: number;
  private _shader: Shader;

  constructor(x: number, y: number) {
    super(x, y);
    this._angle = Math.PI;
    this._angleV = 0.25;
    this._shader = newShader(phaseToAlpha(this._angle));
    
    this._graphic = newGraphic(x, y);
    this._graphic.filters = [this._shader.filter];
  }

  showOn(container: Container) {
    container.addChild(this._graphic);
  }

  update(delta: number) {
    // Flashing
    this._angle += this._angleV * delta;
    if (this._angle > Math.PI * 2 || this._angle < 0) this._angle = angleModulo(this._angle);
    this._shader.uniform.alpha = phaseToAlpha(this._angle);
  }
}

function newGraphic(x: number, y: number) {
  const bug = Sprite.from('/assets/bug-solid.svg');
  bug.width = 20;
  bug.height = 20;
  bug.angle = 90;
  bug.anchor.set(0.5);
  bug.x = x;
  bug.y = y;
  return bug;
}

// Phase in randians
// [0, 2*pi] -> [0, 1]
function phaseToAlpha(phase: number) {
  const x = Math.abs(phase / Math.PI - 1);
  if (x >= 0.5) return 0;
  else return Math.exp(-5 * x);
}

function angleModulo(phase: number) {
  return ((phase % Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
} 
