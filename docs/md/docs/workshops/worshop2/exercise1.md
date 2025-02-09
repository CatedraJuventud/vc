# Hardware Grayscale conversion

## Problem Statement
Grayscale conversion: average rgb and luma.

## Background

Traditional shaders calculate rendering effects on graphics hardware with a high degree of flexibility. Most shaders are coded for (and run on) a graphics processing unit (GPU), though this is not a strict requirement. Shading languages are used to program the GPU's rendering pipeline, which has mostly superseded the fixed-function pipeline of the past that only allowed for common geometry transforming and pixel-shading functions; with shaders, customized effects can be used. The position and color (hue, saturation, brightness, and contrast) of all pixels, vertices, and/or textures used to construct a final rendered image can be altered using algorithms defined in a shader, and can be modified by external variables or textures introduced by the computer program calling the shader.

<p align="center">
  <img width="600" height="270" src="/docs/sketches/shader.png">
</p>

### Vertex Shader

The first step to rendering an image, is for geometry data to be converted from one coordinate system to another coordinate system.

### Fragment Shader

A Fragment Shader is the Shader stage that will process a Fragment generated by the Rasterization into a set of colors and a single depth value.

## Code en Results

In the exercise shaders are used to apply effects on the images, using Luma, rgb average and inverse on an image, which can be found in the fragment shader. In all cases the same vertex shader is used.

In the first case, the shaders are applied to an image, obtaining the same variations around the color that were obtained in the same exercise by software. No difference is evident.

> :Tabs
> >:Tab title= Visualization
> >
> > > :P5 sketch=/docs/sketches/workshop2/exercice1/gray.js, width=768, height=256
>
> >:Tab title= Code
> >```js | gray.js
> >
> >let grayShader;
> >let lumaShader;
> >let theShader;
> >let img;
> >
> >function preload() {
> >  img = loadImage('/vc/docs/sketches/lenna.png');
> >  grayShader = loadShader('/vc/docs/sketches/workshop2/exercice1/shader.vert', '/vc/docs/sketches/workshop2/> >exercice1/rgb.frag');
> >  lumaShader = loadShader('/vc/docs/sketches/workshop2/exercice1/shader.vert', '/vc/docs/sketches/workshop2/> >exercice1/luma.frag');
> >  inverseShader = loadShader('/vc/docs/sketches/workshop2/exercice1/shader.vert','/vc/docs/sketches/workshop2/> >exercice1/inverse.frag')
> >}
> >
> >function setup() {
> >  createCanvas(768, 256, WEBGL);
> >  noStroke();
> >
> >  theShader = createGraphics(256, 256, WEBGL);
> >  theShader.noStroke();
> >  
> >  angleMode(DEGREES);
> >}
> >
> >function draw() {
> >
> >  theShader.shader(grayShader);
> >  grayShader.setUniform('tex', img);
> >  texture(theShader);
> >  theShader.rect(0,0,256,256);
> >  rect(-124,-256/2.0,256,256)
> >
> >  theShader.shader(inverseShader);
> >  inverseShader.setUniform('tex', img);
> >  texture(theShader);
> >  theShader.rect(0,0,256,256);
> >  rect(140,-256/2.0,256,256);
> >
> >
> >  theShader.shader(lumaShader);
> >  rotateY(180);
> >  lumaShader.setUniform('tex0', img);
> >  texture(theShader);
> >  theShader.rect(0,0,256,256);
> >  rect(132,-256/2.0,256,256);
> >  
> >}
> >
> >```
> 
> >:Tab title= Shader
> >```js | shader.vert
> >#ifdef GL_ES
> >precision mediump float;
> >#endif
> >
> >attribute vec3 aPosition;
> >attribute vec2 aTexCoord;
> >
> >varying vec2 vTexCoord;
> >
> >void main() {
> >  vTexCoord = aTexCoord;
> >
> >  vec4 positionVec4 = vec4(aPosition, 1.0);
> >  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
> >
> >  gl_Position = positionVec4;
> >}
> >```
>
> >:Tab title= Fragment Luma
> >```js | lumma.frag
> >precision mediump float;
> >
> >varying vec2 vTexCoord;
> >
> >uniform sampler2D tex0;
> >
> >
> >float luma(vec3 color) {
> >  return dot(color, vec3(0.299, 0.587, 0.114));
> >}
> >
> >
> >void main() {
> >
> >  vec2 uv = vTexCoord;
> >  uv = 1.0 - uv;
> >
> >  vec4 tex = texture2D(tex0, uv);
> >
> >  float gray = luma(tex.rgb);
> >
> >  gl_FragColor = vec4(gray, gray, gray, 1.0);
> >}
> >```
> 
> >:Tab title= RGB Fragment
> >```js | rgb.frag
> >#ifdef GL_ES
> >precision mediump float;
> >#endif
> >
> >varying vec2 vTexCoord;
> >
> >uniform sampler2D tex;
> >
> >float rgb(vec3 color) {
> >  return dot(color, vec3(1.0/3.0, 1.0/3.0, 1.0/3.0));
> >}
> >
> >void main() {
> >  vec2 uv = vTexCoord;
> >  uv.y = 1.0 - uv.y;
> >
> >  vec4 tex_f = texture2D(tex, uv);
> >
> >  float gray = rgb(tex_f.rgb);
> >
> >  gl_FragColor = vec4(gray,gray,gray,1.0);
> >}
> >```
> 
> >:Tab title= Inverse Fragment
> >```js | inverse.frag
> >#ifdef GL_ES
> >precision mediump float;
> >#endif
> >
> >varying vec2 vTexCoord;
> >
> >uniform sampler2D tex;
> >
> >
> >void main() {
> >  vec2 uv = vTexCoord;
> >  uv.y = 1.0 - uv.y;
> >
> >  vec4 tex_f = texture2D(tex, uv);
> >
> >  tex_f.rgb = 1.0 - tex_f.rgb;
> >
> >  gl_FragColor = tex_f;
> >}
> >```


Using another image, differences are not evident with respect to the exercise in software

> :Tabs
> >:Tab title= Visualization
> >
> > > :P5 sketch=/docs/sketches/workshop2/exercice1/gray2.js, width=768, height=256
>
> >:Tab title= Code
> >```js | gray2.js
> >
> >let grayShader;
> >let lumaShader;
> >let space;
> >let shaderTexture;
> >let inverseShader;
> >
> >
> >function preload() {
> >  img = loadImage('/vc/docs/sketches/adv.jpg');
> >  grayShader = loadShader('/vc/docs/sketches/workshop2/exercice1/shader.vert', '/vc/docs/sketches/workshop2/> >exercice1/rgb.frag');
> >  lumaShader = loadShader('/vc/docs/sketches/workshop2/exercice1/shader.vert', '/vc/docs/sketches/workshop2/> >exercice1/luma.frag');
> >  inverseShader = loadShader('/vc/docs/sketches/workshop2/exercice1/shader.vert','/vc/docs/sketches/workshop2/> >exercice1/inverse.frag')
> >}
> >
> >function setup() {
> >  createCanvas(768, 256, WEBGL);
> >  noStroke();
> >
> >  theShader = createGraphics(256, 256, WEBGL);
> >  theShader.noStroke();
> >  
> >  angleMode(DEGREES);
> >}
> >
> >function draw() {
> >
> >  theShader.shader(grayShader);
> >  grayShader.setUniform('tex', img);
> >  texture(theShader);
> >  theShader.rect(0,0,256,256);
> >  rect(-124,-256/2.0,256,256)
> >
> >  theShader.shader(inverseShader);
> >  inverseShader.setUniform('tex', img);
> >  texture(theShader);
> >  theShader.rect(0,0,256,256);
> >  rect(140,-256/2.0,256,256);
> >
> >
> >  theShader.shader(lumaShader);
> >  rotateY(180);
> >  lumaShader.setUniform('tex0', img);
> >  texture(theShader);
> >  theShader.rect(0,0,256,256);
> >  rect(132,-256/2.0,256,256);
> >  
> >
> >}
> >
> 
> >:Tab title= Shader
> >```js | shader.vert
> >#ifdef GL_ES
> >precision mediump float;
> >#endif
> >
> >attribute vec3 aPosition;
> >attribute vec2 aTexCoord;
> >
> >varying vec2 vTexCoord;
> >
> >void main() {
> >  vTexCoord = aTexCoord;
> >
> >  vec4 positionVec4 = vec4(aPosition, 1.0);
> >  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
> >
> >  gl_Position = positionVec4;
> >}
> >```
>
> >:Tab title= Fragment Luma
> >```js | lumma.frag
> >precision mediump float;
> >
> >varying vec2 vTexCoord;
> >
> >uniform sampler2D tex0;
> >
> >
> >float luma(vec3 color) {
> >  return dot(color, vec3(0.299, 0.587, 0.114));
> >}
> >
> >
> >void main() {
> >
> >  vec2 uv = vTexCoord;
> >  uv = 1.0 - uv;
> >
> >  vec4 tex = texture2D(tex0, uv);
> >
> >  float gray = luma(tex.rgb);
> >
> >  gl_FragColor = vec4(gray, gray, gray, 1.0);
> >}
> >```
> 
> >:Tab title= RGB Fragment
> >```js | rgb.frag
> >#ifdef GL_ES
> >precision mediump float;
> >#endif
> >
> >varying vec2 vTexCoord;
> >
> >uniform sampler2D tex;
> >
> >float rgb(vec3 color) {
> >  return dot(color, vec3(1.0/3.0, 1.0/3.0, 1.0/3.0));
> >}
> >
> >void main() {
> >  vec2 uv = vTexCoord;
> >  uv.y = 1.0 - uv.y;
> >
> >  vec4 tex_f = texture2D(tex, uv);
> >
> >  float gray = rgb(tex_f.rgb);
> >
> >  gl_FragColor = vec4(gray,gray,gray,1.0);
> >}
> >```
> 
> >:Tab title= Inverse Fragment
> >```js | inverse.frag
> >#ifdef GL_ES
> >precision mediump float;
> >#endif
> >
> >varying vec2 vTexCoord;
> >
> >uniform sampler2D tex;
> >
> >
> >void main() {
> >  vec2 uv = vTexCoord;
> >  uv.y = 1.0 - uv.y;
> >
> >  vec4 tex_f = texture2D(tex, uv);
> >
> >  tex_f.rgb = 1.0 - tex_f.rgb;
> >
> >  gl_FragColor = tex_f;
> >}
> >```

However, it is possible to identify a significant difference in the result obtained by hardware, the performance.


<p align="center">
  <img width="796" height="333" src="/docs/sketches/cores.png">
</p>

Regarding the exercise by software, it is evident that the videos are reproduced fluently, revealing the difference in processing capacity of the CPU versus the GPU, because a CPU has a few cores optimized for sequential serial processing, while a GPU has a huge parallel architecture consisting of thousands of smaller, more efficient cores, designed to handle multiple tasks at the same time.


> :Tabs
> >:Tab title= Visualization
> >
> > > :P5 sketch=/docs/sketches/workshop2/exercice1/gray_video.js, width=768, height=256
>
> >:Tab title= Code
> >```js | gray_video.js
> >let grayShader;
> >let lumaShader;
> >let space;
> >let shaderTexture;
> >let inverseShader;
> >
> >
> >function preload() {
> >  video = createVideo(['/vc/docs/sketches/fingers.mov', '/vc/docs/sketches/fingers.webm']);
> >  grayShader = loadShader('/vc/docs/sketches/workshop2/exercice1/shader.vert', '/vc/docs/sketches/workshop2/> >exercice1/rgb.frag');
> >  lumaShader = loadShader('/vc/docs/sketches/workshop2/exercice1/shader.vert', '/vc/docs/sketches/workshop2/> >exercice1/luma.frag');
> >  inverseShader = loadShader('/vc/docs/sketches/workshop2/exercice1/shader.vert','/vc/docs/sketches/workshop2/> >exercice1/inverse.frag')
> >  video.hide();
> >}
> >
> >function setup() {
> >  createCanvas(768, 256, WEBGL);
> >  noStroke();
> >
> >  theShader = createGraphics(256, 256, WEBGL);
> >  theShader.noStroke();
> >
> >  video.loop(); 
> >  angleMode(DEGREES);
> >}
> >
> >function draw() {
> >
> >  theShader.shader(grayShader);
> >  grayShader.setUniform('tex', video);
> >  texture(theShader);
> >  theShader.rect(0,0,256,256);
> >  rect(-124,-256/2.0,256,256)
> >
> >  theShader.shader(inverseShader);
> >  inverseShader.setUniform('tex', video);
> >  texture(theShader);
> >  theShader.rect(0,0,256,256);
> >  rect(140,-256/2.0,256,256);
> >
> >  theShader.shader(lumaShader);
> >  rotateY(180);
> >  lumaShader.setUniform('tex0', video);
> >  texture(theShader);
> >  theShader.rect(0,0,256,256);
> >  rect(132,-256/2.0,256,256)
> >}
> >
> >function mousePressed() {
> >  video.loop(); 
> >}
> 
> >:Tab title= Shader
> >```js | shader.vert
> >#ifdef GL_ES
> >precision mediump float;
> >#endif
> >
> >attribute vec3 aPosition;
> >attribute vec2 aTexCoord;
> >
> >varying vec2 vTexCoord;
> >
> >void main() {
> >  vTexCoord = aTexCoord;
> >
> >  vec4 positionVec4 = vec4(aPosition, 1.0);
> >  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
> >
> >  gl_Position = positionVec4;
> >}
> >```
>
> >:Tab title= Fragment Luma
> >```js | lumma.frag
> >precision mediump float;
> >
> >varying vec2 vTexCoord;
> >
> >uniform sampler2D tex0;
> >
> >
> >float luma(vec3 color) {
> >  return dot(color, vec3(0.299, 0.587, 0.114));
> >}
> >
> >
> >void main() {
> >
> >  vec2 uv = vTexCoord;
> >  uv = 1.0 - uv;
> >
> >  vec4 tex = texture2D(tex0, uv);
> >
> >  float gray = luma(tex.rgb);
> >
> >  gl_FragColor = vec4(gray, gray, gray, 1.0);
> >}
> >```
> 
> >:Tab title= RGB Fragment
> >```js | rgb.frag
> >#ifdef GL_ES
> >precision mediump float;
> >#endif
> >
> >varying vec2 vTexCoord;
> >
> >uniform sampler2D tex;
> >
> >float rgb(vec3 color) {
> >  return dot(color, vec3(1.0/3.0, 1.0/3.0, 1.0/3.0));
> >}
> >
> >void main() {
> >  vec2 uv = vTexCoord;
> >  uv.y = 1.0 - uv.y;
> >
> >  vec4 tex_f = texture2D(tex, uv);
> >
> >  float gray = rgb(tex_f.rgb);
> >
> >  gl_FragColor = vec4(gray,gray,gray,1.0);
> >}
> >```
> 
> >:Tab title= Inverse Fragment
> >```js | inverse.frag
> >#ifdef GL_ES
> >precision mediump float;
> >#endif
> >
> >varying vec2 vTexCoord;
> >
> >uniform sampler2D tex;
> >
> >
> >void main() {
> >  vec2 uv = vTexCoord;
> >  uv.y = 1.0 - uv.y;
> >
> >  vec4 tex_f = texture2D(tex, uv);
> >
> >  tex_f.rgb = 1.0 - tex_f.rgb;
> >
> >  gl_FragColor = tex_f;
> >}
> >```


## References

 - [Shaders](https://en.wikipedia.org/wiki/Shader)
 - [Vertex Shader](https://www.khronos.org/opengl/wiki/Vertex_Shader)
 - [Fragment Shader](https://www.khronos.org/opengl/wiki/Fragment_Shader)
 - [Image Shaders](https://miro.medium.com/max/1024/1*WC44Fg79SZnFvT9nCpOzQg.png)
 - [Image CPU vs GPU](https://www.masgamers.com/wp-content/uploads/2017/09/cpu_vs_gpu-1.png)