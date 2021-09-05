import { Filter } from '@pixi/core';
import base from '../shaders/base.vert';
import metaballGray from '../shaders/metaballGray.frag';
import metaballHue from '../shaders/metaballHue.frag';
import voronoiColor from '../shaders/voronoiColor.frag';
import voronoiGray from '../shaders/voronoiGray.frag';
import { System } from './System';

const MAX_COUNT = 50;

const filters = new Map<string, Filter>();
const uniforms = {
  points: new Float32Array(MAX_COUNT * 2).fill(0),
  size: 1,
  dimension: new Float32Array(2).fill(0),
  colors: new Float32Array(MAX_COUNT * 3).map((_) => Math.random()),
};

export function useShader(system: System) {
  const updateUniforms = () => {
    uniforms.size = system.particles.length;
    system.particles.forEach((particle, i) => {
      uniforms.points[2 * i] = particle.position.x;
      uniforms.points[2 * i + 1] = particle.position.y;
    });
    uniforms.dimension[0] = system.filterArea.width;
    uniforms.dimension[1] = system.filterArea.height;
  };

  filters.set('voronoi-gray', new Filter(base, voronoiGray, uniforms));
  filters.set('voronoi-color', new Filter(base, voronoiColor, uniforms));
  filters.set('metaball-gray', new Filter(base, metaballGray, uniforms));
  filters.set('metaball-hue', new Filter(base, metaballHue, uniforms));

  updateUniforms();

  return { uniforms, filters, updateUniforms };
}
