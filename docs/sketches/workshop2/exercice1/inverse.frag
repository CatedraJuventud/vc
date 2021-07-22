#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;

uniform sampler2D tex;


void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;

  vec4 tex_f = texture2D(tex, uv);

  tex_f.rgb = 1.0 - tex_f.rgb;

  gl_FragColor = tex_f;
}