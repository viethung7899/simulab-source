precision mediump float;

varying vec2 uv;
uniform vec2 point; // This is c
uniform float iteration;

const int MAX_ITERATION = 300;

void main() {
  vec2 z = uv; // Starting with z is the pixel point
  float p = 0.;
  for (int i = 0; i < MAX_ITERATION; i++) {
    // Setting z = z^2 + c
    vec2 z2 = vec2(z.x * z.x - z.y * z.y, 2. * z.x * z.y);
    z = z2 + point;
    p++;
    if (length(z) > 2. || p >= iteration) break;
  }
  float color = 1. - sqrt(p / iteration);
  gl_FragColor = vec4(vec3(color), 1.0);
}