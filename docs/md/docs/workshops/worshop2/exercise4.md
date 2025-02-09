# PhotoMosaic in Hardware
## Problem Statement
Converting the image to a photo mosaic

## Background
### Spatial Coherence

Spatial coherence refers to a defined phase relationship between different points in a cross section of a light beam. Let us consider 2 points p1 and p2 that lie in the same beam cross section (surface perpendicular to the direction of propagation). If the phase difference between the electric fields of both points remains constant at any moment, it is said that between both points there is a perfect spatial coherence.


For conventional light sources the coherence area is of the order of 0.0001 mm², while for lasers it is of the order of 1 mm². 

The way to detect spatial coherence in a light beam is by Young's experiment.

<p align="center">
  <img width="700" height="500" src="/docs/sketches/images/young.png">
</p>

### Processing the dataset
To make a scalable solution, the dataset is previously concatenated. The images are ordered by brightness, from lowest to the highest brightness. The implementation was developed in Python, code below:

> :Tabs
> >:Tab title= Visualization
> >
> > > :P5 sketch=/docs/sketches/workshop2/exercise4/datasetExample.js, width=4050, height=64
>
> >:Tab title= Code
> >```python
> >import cv2
> >from glob import glob
> >from PIL import Image,ImageStat
> >import math
> >
> >def brightness( img_file ):
> >   im = Image.open(img_file)
> >   stat = ImageStat.Stat(im)
> >   r,g,b = stat.rms
> >   bright= math.sqrt(0.241*(r**2) + 0.691*(g**2) + 0.068*(b**2))
> >   return { 'brightness': bright, 'filename': img_file }
> >
> >def orderByBrightness(files):
> >  dataset= []
> >  for f in files:
> >    img_brightness = brightness(f)
> >    dataset.append(img_brightness)
> >  return sorted(dataset, key = lambda i: i['brightness'])
> >
> >files = glob("dataset/*.jpg")
> >dataset = orderByBrightness(files)
> >first = True
> >img_w = None
> >for i, data in enumerate(dataset):
> >  if i< 52: continue
> >  f = data['filename']
> >  if first:
> >    first=False
> >    img_w = cv2.imread(f)
> >    continue
> >  img = cv2.imread(f)
> >  img_w = cv2.hconcat([img_w, img])
> >
> >cv2.imwrite('concat_dataset.jpg', img_w)
> >```

### Final Results

#### Image
> :Tabs
> >:Tab title= Visualization
> >
> > > :P5 sketch=/docs/sketches/workshop2/exercise4/photomosaicHardware.js, width=600, height=600
>
> >:Tab title= PhotomosaicHardware.js
> >
> > ```js | PhotomosaicHardware.js
> >let mosaic;
> >let symbol1;
> >let myImage;
> >let debug;
> >let slider;
> >const WIDTH_PIXEL = 64;
> >const HEIGHT_PIXEL = 64;
> >const NUM_IMAGES = 70;
> >function preload() {
> >  myImage = loadImage("/vc/docs/sketches/images/mandrill.png");
> >  symbol1 = loadImage("/vc/docs/sketches/images/concat_dataset.jpg");
> >  mosaic = loadShader(
> >    "/vc/docs/sketches/shaders/shader.vert",
> >    "/vc/docs/sketches/shaders/hardwarePhotomosaic.frag"
> >  );
> >}
> >
> >function setup() {
> >  slider = createSlider(1, 6, 4,1);
> >  slider.position(10, 10);
> >  slider.style('width', '100px');
> >  createCanvas(600, 600, WEBGL);
> >  textureMode(NORMAL);
> >  noStroke();
> >  shader(mosaic);
> >  mosaic.setUniform("image", myImage);
> >  mosaic.setUniform("WIDTH_PIXEL", WIDTH_PIXEL);
> >  mosaic.setUniform("NUM_IMAGES", NUM_IMAGES);
> >  mosaic.setUniform("HEIGHT_PIXEL", HEIGHT_PIXEL);
> >  debug = true;
> >  mosaic.setUniform("debug", debug);
> >  let img = symbol1;
> >  mosaic.setUniform("symbol1", img);
> >}
> >
> >function draw() {
> >  mosaic.setUniform("resolution", Math.pow(10,slider.value()));
> >
> >  background(33);
> >  cover(true);
> >}
> >
> >function cover(texture = false) {
> >  beginShape();
> >  if (texture) {
> >    vertex(-width / 2, -height / 2, 0, 0, 0);
> >    vertex(width / 2, -height / 2, 0, 1, 0);
> >    vertex(width / 2, height / 2, 0, 1, 1);
> >    vertex(-width / 2, height / 2, 0, 0, 1);
> >  } else {
> >    vertex(-width / 2, -height / 2, 0);
> >    vertex(width / 2, -height / 2, 0);
> >    vertex(width / 2, height / 2, 0);
> >    vertex(-width / 2, height / 2, 0);
> >  }
> >  endShape(CLOSE);
> >}
> >
> >function keyPressed() {
> >  if (key === "d") {
> >    debug = !debug;
> >    mosaic.setUniform("debug", debug);
> >  }
> >}
> >```
> > 
>
> >:Tab title= shader.vert
> >
> > ``` glsl | shader.vert
> >precision highp float;
> >attribute vec3 aPosition;
> >attribute vec2 aTexCoord;
> >attribute vec4 aVertexColor;
> >uniform mat4 uProjectionMatrix;
> >uniform mat4 uModelViewMatrix;
> >varying vec4 vVertexColor;
> >varying vec2 vTexCoord;
> >
> >void main() {
> >  vVertexColor = aVertexColor;
> >  vTexCoord = aTexCoord;
> >  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
> >}
> > ```
>
> >:Tab title=hardwarePhotomosaic.frag
> >
> > ``` glsl | hardwarePhotomosaic.vert
> >precision mediump float;
> >uniform sampler2D image;
> >uniform sampler2D symbol1;
> >uniform bool debug;
> >uniform float resolution;
> >uniform float NUM_IMAGES;
> >uniform float WIDTH_PIXEL;
> >uniform float HEIGHT_PIXEL;
> >varying vec2 vTexCoord;
> >varying vec4 vVertexColor;
> >
> >float module( float x , float y ){
> >    float flt_res = x-(y*(floor(x/y)));
> >    return flt_res;
> >}
> >
> >void main() {
> >    vec2 symbolCoord=vTexCoord*resolution;
> >    vec2 imageCoord=floor(symbolCoord);
> >    symbolCoord=symbolCoord-imageCoord;
> >    imageCoord=imageCoord*vec2(1.0)/vec2(resolution);
> >    vec4 col=texture2D(image,imageCoord);
> >    float brightness = dot(col.xyz, vec3(0.2126, 0.7152, 0.0722));
> >    float temp=brightness*(NUM_IMAGES);
> >    float level=floor(temp);
> >    float scalingfactor = 1.0/NUM_IMAGES;
> >    float y0=0.0;
> >    float x0= module(level,NUM_IMAGES)*scalingfactor;
> >    vec2 myCoord=(symbolCoord*vec2(1.0)/vec2(NUM_IMAGES,1))+vec2(x0,y0);
> >    vec4 finalColor=texture2D(symbol1,myCoord);
> >    gl_FragColor = debug?finalColor:col;
> >}
> > ```
>
#### Video
There are two sliders that allow configuring the resolution. The **First Slider** decide the pow(1,100,1.000,10.000,100.000).The **Second Slider** is a number from 1 to 10. This configuration lets the users visualize multiple resolutions that generate a variety of results  


> :Tabs
> >:Tab title= Visualization
> >
> > > :P5 sketch=/docs/sketches/workshop2/exercise4/photomosaicHardwareCamara.js, width=600, height=600
>
> >:Tab title= PhotomosaicHardwareCamara.js
> >
> > ```js | PhotomosaicHardwareCamara.js
> >let mosaic;
> >let symbol1;
> >let myImage;
> >let debug;
> >let slider;
> >const WIDTH_PIXEL = 64;
> >const HEIGHT_PIXEL = 64;
> >const NUM_IMAGES = 70;
> >function preload() {
> >  myImage = createCapture(VIDEO);
> >  myImage.hide();
> >  symbol1 = loadImage("/vc/docs/sketches/images/concat_dataset.jpg");
> >  mosaic = loadShader(
> >    "/vc/docs/sketches/shaders/shader.vert",
> >    "/vc/docs/sketches/shaders/hardwarePhotomosaic.frag"
> >  );
> >}
> >
> >function setup() {
> >  slider = createSlider(1, 6, 4,1);
> >  slider.position(10, 10);
> >  slider.style('width', '100px');
> >  createCanvas(600, 600, WEBGL);
> >  textureMode(NORMAL);
> >  noStroke();
> >  shader(mosaic);
> >  mosaic.setUniform("image", myImage);
> >  mosaic.setUniform("WIDTH_PIXEL", WIDTH_PIXEL);
> >  mosaic.setUniform("NUM_IMAGES", NUM_IMAGES);
> >  mosaic.setUniform("HEIGHT_PIXEL", HEIGHT_PIXEL);
> >  debug = true;
> >  mosaic.setUniform("debug", debug);
> >  let img = symbol1;
> >  mosaic.setUniform("symbol1", img);
> >}
> >
> >function draw() {
> >  mosaic.setUniform("resolution", Math.pow(10,slider.value()));
> >
> >  background(33);
> >  cover(true);
> >}
> >
> >function cover(texture = false) {
> >  beginShape();
> >  if (texture) {
> >    vertex(-width / 2, -height / 2, 0, 0, 0);
> >    vertex(width / 2, -height / 2, 0, 1, 0);
> >    vertex(width / 2, height / 2, 0, 1, 1);
> >    vertex(-width / 2, height / 2, 0, 0, 1);
> >  } else {
> >    vertex(-width / 2, -height / 2, 0);
> >    vertex(width / 2, -height / 2, 0);
> >    vertex(width / 2, height / 2, 0);
> >    vertex(-width / 2, height / 2, 0);
> >  }
> >  endShape(CLOSE);
> >}
> >
> >function keyPressed() {
> >  if (key === "d") {
> >    debug = !debug;
> >    mosaic.setUniform("debug", debug);
> >  }
> >}
> >```
> > 
>
> >:Tab title= shader.vert
> >
> > ``` glsl | shader.vert
> >precision highp float;
> >attribute vec3 aPosition;
> >attribute vec2 aTexCoord;
> >attribute vec4 aVertexColor;
> >uniform mat4 uProjectionMatrix;
> >uniform mat4 uModelViewMatrix;
> >varying vec4 vVertexColor;
> >varying vec2 vTexCoord;
> >
> >void main() {
> >  vVertexColor = aVertexColor;
> >  vTexCoord = aTexCoord;
> >  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
> >}
> > ```
>
> >:Tab title=hardwarePhotomosaic.frag
> >
> > ``` glsl | hardwarePhotomosaic.vert
> >precision mediump float;
> >uniform sampler2D image;
> >uniform sampler2D symbol1;
> >uniform bool debug;
> >uniform float resolution;
> >uniform float NUM_IMAGES;
> >uniform float WIDTH_PIXEL;
> >uniform float HEIGHT_PIXEL;
> >varying vec2 vTexCoord;
> >varying vec4 vVertexColor;
> >
> >float module( float x , float y ){
> >    float flt_res = x-(y*(floor(x/y)));
> >    return flt_res;
> >}
> >
> >void main() {
> >    vec2 symbolCoord=vTexCoord*resolution;
> >    vec2 imageCoord=floor(symbolCoord);
> >    symbolCoord=symbolCoord-imageCoord;
> >    imageCoord=imageCoord*vec2(1.0)/vec2(resolution);
> >    vec4 col=texture2D(image,imageCoord);
> >    float brightness = dot(col.xyz, vec3(0.2126, 0.7152, 0.0722));
> >    float temp=brightness*(NUM_IMAGES);
> >    float level=floor(temp);
> >    float scalingfactor = 1.0/NUM_IMAGES;
> >    float y0=0.0;
> >    float x0= module(level,NUM_IMAGES)*scalingfactor;
> >    vec2 myCoord=(symbolCoord*vec2(1.0)/vec2(NUM_IMAGES,1))+vec2(x0,y0);
> >    vec4 finalColor=texture2D(symbol1,myCoord);
> >    gl_FragColor = debug?finalColor:col;
> >}
> > ```
>
## References

 - [Spatial Coherence](https://es.wikipedia.org/wiki/Luz_coherente)
 - [Young's Experiment](https://es.wikipedia.org/wiki/Experimento_de_Young)
