import { Filter } from '@pixi/core';
import { VoronoiGrid } from './VoronoiGrid';
import fs from 'fs';

const vertexShader = `
  attribute vec2 aVertexPosition;

  uniform mat3 projectionMatrix;
  varying vec2 vTextureCoord;
  varying vec2 uv;

  uniform vec4 inputSize;
  uniform vec4 outputFrame;

  vec4 filterVertexPosition( void )
  {
      vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

      return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
  }

  vec2 filterTextureCoord( void )
  {
      return aVertexPosition * (outputFrame.zw * inputSize.zw);
  }

  void main(void)
  {
      gl_Position = filterVertexPosition();
      vTextureCoord = filterTextureCoord();
      uv = vTextureCoord * inputSize.xy + outputFrame.xy;
  }
`;

const MAX_COUNT = 128;

const grayShader = `
  precision mediump float;
  
  varying vec2 uv;

  const int MAX_COUNT = ${MAX_COUNT};

  uniform vec2 points[MAX_COUNT];
  uniform int size;
  uniform vec2 dimension;
  
  void main() {
    if (size < 1) {
      gl_FragColor = vec4(vec3(0.0), 1.0);
      return;
    }

    float m_dist = distance(uv, points[0]);
    for (int i = 1; i < MAX_COUNT; i++) {
      if (i >= size) break;
      float dist = distance(uv, points[i]);
      m_dist = min(m_dist, dist);
    }
    gl_FragColor = vec4(vec3(sqrt(m_dist / dimension[0])), 1.0);
  }
`;

const colorShader = `
  precision mediump float;
  
  varying vec2 uv;

  const int MAX_COUNT = ${MAX_COUNT};

  uniform vec2 points[MAX_COUNT];
  uniform vec3 colors[MAX_COUNT];
  uniform int size;
  uniform vec2 dimension;
  
  void main() {
    if (size < 1) {
      gl_FragColor = vec4(vec3(0.0), 1.0);
      return;
    }

    vec3 color = colors[0];
    float m_dist = distance(uv, points[0]);
    for (int i = 1; i < MAX_COUNT; i++) {
      if (i >= size) break;
      float dist = distance(uv, points[i]);
      if (m_dist > dist) {
        m_dist = dist;
        color = colors[i];
      }
    }
    gl_FragColor = vec4(color, 1.0);
  }
`;

type ShaderMap = {
  [name: string]: Filter;
}

export const voronoiFilter = (system: VoronoiGrid) => {
  console.log(__dirname);
  const uniforms = {
    points: new Float32Array(MAX_COUNT * 2).fill(0),
    size: 1,
    dimension: new Float32Array(2).fill(0),
    colors: new Float32Array(MAX_COUNT * 3).fill(0)
  };

  const updateUniform = () => {
    const { totalRow, totalCol } = system;
    uniforms.size = totalRow * totalCol;

    uniforms.points.fill(0);

    system.seeds.forEach((seed, i) => {
      uniforms.points[2 * i] = seed.x;
      uniforms.points[2 * i + 1] = seed.y;
    });

    uniforms.dimension[0] = system.background.filterArea.width;
    uniforms.dimension[1] = system.background.filterArea.height;
  };
  
  const filters: ShaderMap = {};
  filters.gray = new Filter(vertexShader, grayShader, uniforms);
  filters.color = new Filter(vertexShader, colorShader, uniforms);
  
  const resetColor = () => {
    uniforms.colors.forEach((_, i, self) => {
      self[i] = Math.random();
    })
  };
  updateUniform();
  resetColor();

  return { uniforms, filters, updateUniform, resetColor };
};
