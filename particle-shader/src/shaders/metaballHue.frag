precision mediump float;

varying vec2 uv;

const int MAX_COUNT = 50;

uniform vec2 points[MAX_COUNT];
uniform int size;
uniform vec2 dimension;

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb(in vec3 c){
  vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                            6.0)-3.0)-1.0,
                    0.0,
                    1.0 );
  rgb = rgb*rgb*(3.0-2.0*rgb);
  return c.z * mix(vec3(1.0), rgb, c.y);
}

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

  if (d > 1.) d = 1.;

  vec3 color = hsb2rgb(vec3(1. - d, 1, 1));

  gl_FragColor = vec4(color, 1.0);
}

