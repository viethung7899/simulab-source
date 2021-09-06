precision mediump float;

varying vec2 uv;

void main() {
  vec2 z = vec2(0.);
  int p = 0;
  for (int i = 0; i < 100; i++) {
    vec2 z2 = vec2(z.x * z.x - z.y * z.y, 2. * z.x * z.y);
    z = z2 + uv;
    p++;
    if (length(z) > 2.) break;
  }
  float color = float(p) / 100.;
  gl_FragColor = vec4(vec3(color), 1.0);
}