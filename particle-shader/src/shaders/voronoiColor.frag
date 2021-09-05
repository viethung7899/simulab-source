precision mediump float;

varying vec2 uv;

const int MAX_COUNT = 32;

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