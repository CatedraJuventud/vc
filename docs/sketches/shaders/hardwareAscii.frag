precision mediump float;
uniform sampler2D image;
uniform sampler2D symbol1;
uniform bool debug;
uniform float resolution;
uniform float NUM_IMAGES;
uniform float WIDTH_PIXEL;
uniform float HEIGHT_PIXEL;
varying vec2 vTexCoord;
varying vec4 vVertexColor;

float module( float x , float y ){
    float flt_res = x-(y*(floor(x/y)));
    return flt_res;
}

void main() {
    vec2 symbolCoord=vTexCoord*resolution;
    vec2 imageCoord=floor(symbolCoord);
    symbolCoord=symbolCoord-imageCoord;
    imageCoord=imageCoord*vec2(1.0)/vec2(resolution);
    vec4 col=texture2D(image,imageCoord);
    float brightness = dot(col.xyz, vec3(0.2126, 0.7152, 0.0722));
    float temp=brightness*(NUM_IMAGES);
    float level=floor(temp);
    float scalingfactor = 1.0/NUM_IMAGES;
    float y0=0.0;
    float x0= module(level,NUM_IMAGES)*scalingfactor;
    vec2 myCoord=(symbolCoord*vec2(1.0)/vec2(NUM_IMAGES,1))+vec2(x0,y0);
    vec4 finalColor=texture2D(symbol1,myCoord);
    gl_FragColor = debug?finalColor:col;
}