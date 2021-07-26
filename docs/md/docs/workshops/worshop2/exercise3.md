# PhotoMosaic in Hardware
## Processing the dataset
This implementation uses the list given by [Paul Bourke in Character representation of grey scale images](http://paulbourke.net/dataformats/asciiart/). The "Standard" character ramp for grey scale pictures, black -> white.

> "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^`'. "

An image of 64x64 is created for each character. Then, the images are concatenated and passed to the shaders. The shaders have the logic to select the part of this new large image to choose the proper character. The creation of the  characters images was developed in Python, code below:

> :Tabs
> >:Tab title= Visualization
> >
> > > :P5 sketch=/docs\sketches\workshop2\exercice3\datasetExample.js, width=4050, height=64
>
> >:Tab title= Code
> >```python
>>import cv2
>>from glob import glob
>>from PIL import Image,ImageStat, ImageDraw,>>ImageFont
>>import math
>>
>>def brightness( img_file ):
>>   im = Image.open(img_file)
>>   stat = ImageStat.Stat(im)
>>   r,g,b = stat.rms
>>   bright= math.sqrt(0.241*(r**2) + 0.691*(g**2) >>+ 0.068*(b**2))
>>   return { 'brightness': bright, 'filename': >>img_file }
>>
>>def orderByBrightness(files):
>>  dataset= []
>>  for f in files:
>>    img_brightness = brightness(f)
>>    dataset.append(img_brightness)
>>  return sorted(dataset, key = lambda i: i>>['brightness'])
>>
>>def createCharFromImage(char):
>>  W, H = (64,64)
>>  img = Image.new('RGB', (W, H), color = (255, >>255, 255))
>>  d = ImageDraw.Draw(img)
>>  w, h = d.textsize(char)
>>  fnt = ImageFont.truetype("./font2.otf", 70)
>>  d.text(((W-w)/2,0), char, font=fnt, fill=(0,0,>>0))
>>  img.save('characters/_{}_.jpg'.format(char))
>>
>>characters = "$@B%8&>>WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft()1{}[]?-_>>+~<>i!lI;:,\"^`'. "
>>
>>for char in characters:
>>  createCharFromImage(char)
>>
>>img_w = None
>>for i, char in enumerate(characters):
>>  file = 'characters/_{}_.jpg'.format(char)
>>  if i==0:
>>    img_w = cv2.imread(file)
>>    continue
>>  img = cv2.imread(file)
>>  img_w = cv2.hconcat([img_w, img])
>>
>>cv2.imwrite('Characters.jpg', img_w)
> >```

## Final Results

### Image
> :Tabs
> >:Tab title= Visualization
> >
> > > :P5 sketch=/docs\sketches\workshop2\exercice3\ascii.js, width=600, height=600
>
> >:Tab title= ascii.js
> >
> > ```js | ascii.js
> >let mosaic;
> >let symbol1;
> >let myImage;
> >let debug;
> >let slider;
> >let slider2;
> >const WIDTH_PIXEL = 64;
> >const HEIGHT_PIXEL = 64;
> >const NUM_IMAGES = 70;
> >
> >
> >function preload() {
> >  myImage = loadImage("/vc/docs/sketches/images/mandrill.png");
> >  symbol1 = loadImage("/vc/docs/sketches/images/Characters.jpg");
> >  mosaic = loadShader(
> >    "/vc/docs/sketches/shaders/shader.vert",
> >    "/vc/docs/sketches/shaders/hardwarePhotomosaic.frag"
> >  );
> >}
> >
> >function setup() {
> >  slider = createSlider(1, 9, 1,1);
> >  slider.position(10, 30);
> >  slider.style('width', '100px');
> >  slider2 = createSlider(0,5,3,1);
> >  slider2.position(10,10);
> >  slider2.style('width', '100px');
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
> >  const pow = Math.pow(10,slider2.value())
> >    mosaic.setUniform("resolution", pow*slider.value());
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
> > ``` glsl | hardwareAscii.vert
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



## Video
There are two sliders that allow configuring the resolution. The **First Slider** decide the pow(1,100,1.000,10.000,100.000).The **Second Slider** is a number from 1 to 10. This configuration lets the users visualize multiple resolutions that generate a variety of results   


> :Tabs
> >:Tab title= Visualization
> >
> > > :P5 sketch=/docs\sketches\workshop2\exercice3\asciiCamara.js, width=600, height=600
>
> >:Tab title= asciiCamara.js
> >
> > ```js | asciiCamara.js
> >let mosaic;
> >let symbol1;
> >let myImage;
> >let debug;
> >let slider;
> >let slider2;
> >const WIDTH_PIXEL = 64;
> >const HEIGHT_PIXEL = 64;
> >const NUM_IMAGES = 70;
> >
> >
> >function preload() {
> >  myImage = createCapture(VIDEO);
> >  myImage.hide();
> >  symbol1 = loadImage("/vc/docs/sketches/images/Characters.jpg");
> >  mosaic = loadShader(
> >    "/vc/docs/sketches/shaders/shader.vert",
> >    "/vc/docs/sketches/shaders/hardwarePhotomosaic.frag"
> >  );
> >}
> >
> >function setup() {
> >  slider = createSlider(1, 9, 1,1);
> >  slider.position(10, 30);
> >  slider.style('width', '100px');
> >  slider2 = createSlider(0,5,3,1);
> >  slider2.position(10,10);
> >  slider2.style('width', '100px');
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
> >  const pow = Math.pow(10,slider2.value())
> >    mosaic.setUniform("resolution", pow*slider.value());
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
> > ``` glsl | hardwareAscii.vert
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
