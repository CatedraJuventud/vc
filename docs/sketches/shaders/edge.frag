precision mediump float;

// texture is sent by the sketch
uniform sampler2D texture;
uniform vec2 texOffset;
// interpolated color (same name and type as in vertex shader)
varying vec4 vVertexColor;
// interpolated texcoord (same name and type as in vertex shader)
varying vec2 vTexCoord;
const vec4 lumcoeff = vec4(0.299, 0.587, 0.114, 0);
void main() {
  // texture2D(texture, vTexCoord) samples texture at vTexCoord 
  // and returns the normalized texel color
  // texel color times vVertexColor gives the final normalized pixel color
vec2 tc0 = vTexCoord + vec2(-texOffset.s, -texOffset.t);
  vec2 tc1 = vTexCoord + vec2(         0.0, -texOffset.t);
  vec2 tc2 = vTexCoord + vec2(+texOffset.s, -texOffset.t);
  vec2 tc3 = vTexCoord + vec2(-texOffset.s,          0.0);
  vec2 tc4 = vTexCoord + vec2(         0.0,          0.0);
  vec2 tc5 = vTexCoord + vec2(+texOffset.s,          0.0);
  vec2 tc6 = vTexCoord + vec2(-texOffset.s, +texOffset.t);
  vec2 tc7 = vTexCoord + vec2(         0.0, +texOffset.t);
  vec2 tc8 = vTexCoord + vec2(+texOffset.s, +texOffset.t);

  vec4 col0 = texture2D(texture, tc0);
  vec4 col1 = texture2D(texture, tc1);
  vec4 col2 = texture2D(texture, tc2);
  vec4 col3 = texture2D(texture, tc3);
  vec4 col4 = texture2D(texture, tc4);
  vec4 col5 = texture2D(texture, tc5);
  vec4 col6 = texture2D(texture, tc6);
  vec4 col7 = texture2D(texture, tc7);
  vec4 col8 = texture2D(texture, tc8);

 vec4 sum = 8.0 * col4 - (col0 + col1 + col2 + col3 + col5 + col6 + col7 + col8);
  
  gl_FragColor = vec4(vec3(sum), 1.0) * vVertexColor;
}