precision mediump float;

varying vec2 uv;
uniform vec2 point; // This is c

void main() {
  vec2 z = uv; // Starting with z is the pixel point
  int p = 0;
  for (int i = 0; i < 100; i++) {
    // Setting z = z^2 + c
    vec2 z2 = vec2(z.x * z.x - z.y * z.y, 2. * z.x * z.y);
    z = z2 + point;
    p++;
    if (length(z) > 2.) break;
  }
  float color = sqrt(float(p) / 100.);
  gl_FragColor = vec4(vec3(color), 1.0);
}