precision mediump float;

varying vec2 uv;

const int MAX_COUNT = 50;

uniform vec2 points[MAX_COUNT];
uniform int size;
uniform vec2 dimension;

void main() {
  if (size < 1) {
    gl_FragColor = vec4(vec3(0.0), 1.0);
    return;
  }

  float maxLen = length(dimension);

  float d = 0.;
  for (int i = 0; i < MAX_COUNT; i++) {
    if (i >= size) break;
    float dist = distance(uv, points[i]);
    d += maxLen / (dist * dist);
  }

  gl_FragColor = vec4(vec3(d), 1.0);
}
