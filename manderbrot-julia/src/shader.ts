import { Filter } from '@pixi/core';
import { Display } from './components/Display';
import base from './shaders/base.vert';
import juliaFrag from './shaders/julia.frag';
import mandelbrotFrag from './shaders/mandelbrot.frag';

export const useMandelbrotShader = (display: Display) => {
  const { translate, zoom } = display;
  const uniforms = { translate, zoom };
  const filter = new Filter(base, mandelbrotFrag, uniforms);
  display.setFilter(filter);

  const update = () => {
    uniforms.zoom = display.zoom;
  };

  return { filter, update };
};

export const useJuliaShader = (display: Display) => {
  const { translate, zoom } = display;
  const point = new Float32Array([0, 0]);
  const uniforms = { translate, zoom, point };
  const filter = new Filter(base, juliaFrag, uniforms);
  display.setFilter(filter);

  const update = () => {
    uniforms.zoom = display.zoom;
  };

  const updatePoint = (x: number, y: number) => {
    point[0] = x;
    point[1] = y;
  };

  return { filter, update, updatePoint };
};
