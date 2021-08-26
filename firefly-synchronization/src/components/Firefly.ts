import { Container, Filter, Rectangle, Sprite } from 'pixi.js';
import { Entity } from '../utils/SpatialHashGrid';
import { Vector2D } from '../utils/Vector2D';

const BORDER = 40;
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
  private _graphic: Sprite;
  
  private _velocity: Vector2D;
  private _direction: Vector2D;
  
  
  private _maxSpeed: number;
  private _maxSteeringForce: number;
  private _wanderAngle: number = 0;

  private _angle: number;
  private _angleV: number;
  private _shader: Shader;

  constructor(x: number, y: number) {
    super(x, y);
    
    // Random velocity
    const a = random_range(0, 2 * Math.PI);
    this._velocity = new Vector2D(2 * Math.cos(a), 2 * Math.sin(a));
    this._direction = this._velocity.clone().multiply(0.5);

    // Random force and speed limits
    const mult = random_range(MIN_MULT, MAX_MULT);
    this._maxSpeed = SPEED * mult;
    this._maxSteeringForce = FORCE * mult;
    this._wanderAngle = 0;
    
    // Random phase
    this._angle = Math.PI;
    this._angleV = 0.5;
    this._shader = newShader(phaseToAlpha(this._angle));
    
    this._graphic = newGraphic(x, y);
    this._graphic.filters = [this._shader.filter];
  }

  showOn(container: Container) {
    container.addChild(this._graphic);
  }

  update(delta: number, container: Rectangle) {
    // Moving
    this._steer();

    // Displacement
    const displacement = this._velocity.clone().multiply(delta);
    const position = this._position;
    // console.log('Before', position.x, position.y);
    position.add(displacement);

    // Boundary
    const { x, y, width, height } = container;
    const direction = this._direction;

    if (direction.x < 0 && position.x < x - BORDER)
      position.x = x + width + BORDER;
    if (direction.x > 0 && position.x > x + width + BORDER)
      position.x = x - BORDER;
    if (direction.y < 0 && position.y < y - BORDER)
      position.y = y + height + BORDER;
    if (direction.y > 0 && position.y > y + height + BORDER)
      position.y = y - BORDER;

    // Shape displacement
    this._graphic.x = position.x;
    this._graphic.y = position.y;
    this._graphic.rotation = this._direction.angle() + Math.PI / 2;

    // Flashing
    this._angle += this._angleV * delta;
    if (this._angle > Math.PI * 2 || this._angle < 0) this._angle = angleModulo(this._angle);
    this._shader.uniform.alpha = phaseToAlpha(this._angle);
  }

  _steer() {
    const steeringForce = this._applyWandering();
    this._velocity.add(steeringForce).clamp(this._maxSpeed);
    this._direction = this._velocity.clone().normalize();
  }

  _applyWandering() {
    this._wanderAngle += 0.2 * random_range(-Math.PI, Math.PI);
    const wanderDirection = new Vector2D(
      Math.cos(this._wanderAngle),
      Math.sin(this._wanderAngle),
    );
    const force = this._direction
      .clone()
      .multiply(2)
      .add(wanderDirection)
      .normalize()
      .multiply(3);
    return force;
  }
}

function newGraphic(x: number, y: number) {
  const bug = Sprite.from('/assets/bug-solid.svg');
  bug.width = 15;
  bug.height = 15;
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

export function random_range(a: number, b: number) {
  return Math.random() * (b - a) + a;
}
