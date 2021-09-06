import { Filter } from '@pixi/core';
import { Display } from './components/Display';
import mandelbrotFrag from './shaders/mandelbrot.frag';
import mandelbrotVert from './shaders/mandelbrot.vert';

export const useMandelbrotShader = (display: Display) => {
  const { translate, zoom } = display;
  const uniforms = { translate, zoom };
  const filter = new Filter(mandelbrotVert, mandelbrotFrag, uniforms);
  display.setFilter(filter);

  const update = () => {
    uniforms.zoom = display.zoom;
  };

  return { filter, update };
};

const useJulia = (display: Display) => {
  const { translate, zoom } = display;
};
