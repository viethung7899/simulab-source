precision mediump float;

varying vec2 uv;

void main() {
  vec2 z = vec2(0.); // Starting with z = 0
  int p = 0;
  for (int i = 0; i < 100; i++) {
    // Setting z = z^2 + c
    vec2 z2 = vec2(z.x * z.x - z.y * z.y, 2. * z.x * z.y);
    z = z2 + uv;
    p++;
    if (length(z) > 2.) break;
  }
  float color = 1.0 - sqrt(float(p) / 100.);
  gl_FragColor = vec4(vec3(color), 0.5);
}