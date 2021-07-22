
precision mediump float;
uniform sampler2D image;
uniform sampler2D symbol1;
uniform bool debug;
uniform float resolution;
varying vec4 vVertexColor;
// interpolated texcoord (same name and type as in vertex shader)
varying vec2 vTexCoord;

void main() {
vec2 symbolCoord=vTexCoord*resolution;
vec2 imageCoord=floor(symbolCoord);
symbolCoord=symbolCoord-imageCoord;
imageCoord=imageCoord*vec2(1.0)/vec2(resolution);
vec4 index=texture2D(image,imageCoord);
gl_FragColor = debug?index:texture2D(symbol1,symbolCoord)*vVertexColor;
}