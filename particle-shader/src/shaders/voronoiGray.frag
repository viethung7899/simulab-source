precision mediump float;
  
varying vec2 uv;

const int MAX_COUNT = 32;

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
  gl_FragColor = vec4(vec3(sqrt(m_dist / max(dimension[0], dimension[1]))), 1.0);
}