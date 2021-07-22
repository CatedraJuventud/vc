#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;

uniform sampler2D tex;

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;

  vec4 tex_f = texture2D(tex, uv);

  float gray = luma(tex_f.rgb);

  gl_FragColor = vec4(gray,gray,gray,1.0);
}