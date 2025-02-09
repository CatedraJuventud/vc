# Convolutional Mask

## Problem Statement
Apply some convolution mask to images and video

## Background
convolution is a mathematical operation on two functions (f and g) that produces a third function (f*g) that expresses how the shape of one is modified by the other. in the case of image processing the convolution is the proccess of adding each element of the image to its local neighbors , weighted by the kernel to extract certain features from an input image.The kernels will define the size of the convolution, the weights applied to it, and an anchor point usually positioned at the center.The origin is the position of the kernel which is above (conceptually) the current output pixel. For a symmetric kernel, the origin is usually the center element.

Of course we are not restricted to 3x3 kernels - this was only done for simplicity. Kernels can be of just about any size. More sophisticated kernels are typically larger, in fact many image processing software packages have options to customize a kernel.

<p align="center">
  <img width="600" height="600" src="/docs/sketches/workshop1/w2/conv.gif">
</p>

One of the earliest uses of the convolution integral appeared in D'Alembert's derivation of Taylor's theorem in Recherches sur différents points importants du système du monde, published in 1754. Soon thereafter, convolution operations appear in the works of Pierre Simon Laplace, Jean-Baptiste Joseph Fourier, Siméon Denis Poisson, and others. The term itself did not come into wide use until the 1950s or 60s. 

## Code and Results

For this, we use a vertex shader and a fragment shader (The same for image, video and camera recording) and just change the Javascript file. 

The kernel matriz is a 3*3 matriz, and it is passed to the shaders in a uniform vector of floats.

The results and code can be seed above.
### Image
> :Tabs
> >:Tab title= Visualization
> >
> > > :P5 sketch=/docs/sketches/workshop2/exercice2/exe.js, width=640, height=400
>
> >:Tab title= Code
> >```js | ConvolutionImage.js
> >let theShader;
> >let img;
> >let reproduce = false;
> >
> >const Blur_Kernel= [ 0.11, 0.11, 0.11 ,0.11, 0.11, 0.11, 0.11, 0.11, 0.11]; 
> >let Border_Detection= [ -1.0, -1.0, -1.0 , -1.0,  8.0, -1.0 , -1.0, -1.0, -1.0  ];
> >const Emboss= [ 1,  1,  0, 1,  0, -1 , 0,  -1,  -1]; 
> >const Sharpe= [ 0, -1, 0 , -1,  5, -1, 0, -1, 0 ]; 
> >
> >let contador=0;
> >let matrixCarrousel= [Blur_Kernel,Border_Detection,Emboss,Sharpe];
> >let kernel = matrixCarrousel[0] ;
> >
> >function preload() {
> >  theShader = loadShader('/vc/docs/sketches/workshop2/exercice2/shader.vert', '/vc/docs/sketches/workshop2/exercice2/edge.frag');
> >  img = loadImage('/vc/docs/sketches/lenna.png');
> >}
> >
> >function setup() {
> >  createCanvas(640, 400, WEBGL);
> >  noStroke();
> >  textureMode(NORMAL); 
> >  shader(theShader);
> >  theShader.setUniform('texture', img);
> >  theShader.setUniform('texOffset',[1/img.width,1/img.height]);
> >  button=createButton('Change Kernel!');
> >  button.position(300,350);
> >  button.mousePressed(changeMatrix);
> >}
> >function draw() {
> >  background(0);
> >  
> >  beginShape() 
> >  vertex(-width / 2, height / 2, 0, 0, 1);
> >  vertex(width / 2, height / 2, 0, 1, 1);
> >  vertex(width / 2, -height / 2, 0, 1, 0);
> >  vertex(-width / 2, -height / 2, 0, 0, 0);
> >  theShader.setUniform('kernel', kernel);
> >  endShape(CLOSE)
> >  
> >}
> > function changeMatrix(){
> >  contador=(contador+1)%matrixCarrousel.length;
> >  kernel=matrixCarrousel[contador];
> >}
>
> >:Tab title= frament
> >```js | ConvolutionImage.frag
> >precision mediump float;
> >uniform float kernel[9];
> >
> >vec4 col[9];
> >vec2 tc[9];
> >
> >// texture is sent by the sketch
> >uniform sampler2D texture;
> >uniform vec2 texOffset;
> >
> >// interpolated color (same name and type as in vertex shader)
> >varying vec4 vVertexColor;
> >
> >// interpolated texcoord (same name and type as in vertex shader)
> >varying vec2 vTexCoord;
> >
> >const vec4 lumcoeff = vec4(0.299, 0.587, 0.114, 0);
> >
> >void main() {
> >  // texture2D(texture, vTexCoord) samples texture at vTexCoord 
> >  // and returns the normalized texel color
> >  // texel color times vVertexColor gives the final normalized pixel col[o]r
> >  tc[0] = vTexCoord + vec2(-texOffset.s, -texOffset.t);
> >  tc[1] = vTexCoord + vec2(         0.0, -texOffset.t);
> >  tc[2] = vTexCoord + vec2(+texOffset.s, -texOffset.t);
> >  tc[3] = vTexCoord + vec2(-texOffset.s,          0.0);
> >  tc[4] = vTexCoord + vec2(         0.0,          0.0);
> >  tc[5] = vTexCoord + vec2(+texOffset.s,          0.0);
> >  tc[6] = vTexCoord + vec2(-texOffset.s, +texOffset.t);
> >  tc[7] = vTexCoord + vec2(         0.0, +texOffset.t);
> >  tc[8] = vTexCoord + vec2(+texOffset.s, +texOffset.t);
> >
> >  for ( int i=0;i<9;i++){
> >    col[i] = texture2D(texture, tc[i]);
> >  }
> >
> >  vec4 sum = kernel[0] * col[0];
> >  for (int i = 1; i<9 ; i++){
> >    vec4 pc =  kernel[i] * col[i];
> >    sum += pc;
> >  }
> >  gl_FragColor = vec4(vec3(sum), 1.0) * vVertexColor;
> >
> >}

### Video
> :Tabs
> >:Tab title= Visualization
> >
> > > :P5 sketch=/docs/sketches/workshop2/exercice2/video.js, width=640, height=400
>
> >:Tab title= Code
> >```js | ConvolutionVideo.js
> >let theShader;
> >let fingers;
> >let reproduce = false;
> >
> >const Blur_Kernel= [ 0.11, 0.11, 0.11 ,0.11, 0.11, 0.11, 0.11, 0.11, 0.11]; 
> >let Border_Detection= [ -1.0, -1.0, -1.0 , -1.0,  8.0, -1.0 , -1.0, -1.0, -1.0  ];
> >const Emboss= [ 1,  1,  0, 1,  0, -1 , 0,  -1,  -1]; 
> >const Sharpe= [ 0, -1, 0 , -1,  5, -1, 0, -1, 0 ]; 
> >
> >let contador=0;
> >let matrixCarrousel= [Blur_Kernel,Border_Detection,Emboss,Sharpe];
> >let kernel = matrixCarrousel[0] ;
> >
> >function preload() {
> >  theShader = loadShader('/vc/docs/sketches/workshop2/exercice2/shader.vert', '/vc/docs/sketches/workshop2/exercice2/edge.frag');
> >  fingers = createVideo(['/vc/docs/sketches/fingers.mov', '/vc/docs/sketches/fingers.webm']);
> >  fingers.hide();
> >}
> >
> >function setup() {
> >  createCanvas(640, 400, WEBGL);
> >  noStroke();
> >  textureMode(NORMAL); 
> >  shader(theShader);
> >  theShader.setUniform('texture', fingers);
> >  theShader.setUniform('texOffset',[1/fingers.width,1/fingers.height]);
> >  button=createButton('Change Kernel!');
> >  button.position(300,350);
> >  button.mousePressed(changeMatrix);
> >}
> >function draw() {
> >  background(0);
> >  
> >  beginShape() 
> >  vertex(-width / 2, height / 2, 0, 0, 1);
> >  vertex(width / 2, height / 2, 0, 1, 1);
> >  vertex(width / 2, -height / 2, 0, 1, 0);
> >  vertex(-width / 2, -height / 2, 0, 0, 0);
> >  theShader.setUniform('kernel', kernel);
> >  endShape(CLOSE)
> >  
> >}
> > function changeMatrix(){
> >  contador=(contador+1)%matrixCarrousel.length;
> >  kernel=matrixCarrousel[contador];
> >}

### Camera

> :Tabs
> >:Tab title= Visualization
> >
> > > :P5 sketch=/docs/sketches/workshop2/exercice2/camara.js, width=640, height=400
>
> >:Tab title= Code
> >```js | ConvolutionCamara.js
> >let theShader;
> >let fingers;
> >let reproduce = false;
> >
> >const Blur_Kernel= [ 0.11, 0.11, 0.11 ,0.11, 0.11, 0.11, 0.11, 0.11, 0.11]; 
> >let Border_Detection= [ -1.0, -1.0, -1.0 , -1.0,  8.0, -1.0 , -1.0, -1.0, -1.0  ];
> >const Emboss= [ 1,  1,  0, 1,  0, -1 , 0,  -1,  -1]; 
> >const Sharpe= [ 0, -1, 0 , -1,  5, -1, 0, -1, 0 ]; 
> >
> >let contador=0;
> >let matrixCarrousel= [Blur_Kernel,Border_Detection,Emboss,Sharpe];
> >let kernel = matrixCarrousel[0] ;
> >
> >function preload() {
> >  theShader = loadShader('/vc/docs/sketches/workshop2/exercice2/shader.vert', '/vc/docs/sketches/workshop2/exercice2/edge.frag');
> >  fingers = createCapture(VIDEO)
> >  fingers.hide();
> >}
> >
> >function setup() {
> >  createCanvas(640, 400, WEBGL);
> >  noStroke();
> >  textureMode(NORMAL); 
> >  shader(theShader);
> >  theShader.setUniform('texture', fingers);
> >  theShader.setUniform('texOffset',[1/fingers.width,1/fingers.height]);
> >  button=createButton('Change Kernel!');
> >  button.position(300,350);
> >  button.mousePressed(changeMatrix);
> >}
> >function draw() {
> >  background(0);
> >  
> >  beginShape() 
> >  vertex(-width / 2, height / 2, 0, 0, 1);
> >  vertex(width / 2, height / 2, 0, 1, 1);
> >  vertex(width / 2, -height / 2, 0, 1, 0);
> >  vertex(-width / 2, -height / 2, 0, 0, 0);
> >  theShader.setUniform('kernel', kernel);
> >  endShape(CLOSE)
> >  
> >}
> > function changeMatrix(){
> >  contador=(contador+1)%matrixCarrousel.length;
> >  kernel=matrixCarrousel[contador];
> >}

## Reference
Filter taking from:
- https://en.wikipedia.org/wiki/Kernel_(image_processing)

- https://docs.gimp.org/2.8/en/plug-in-convmatrix.html 

- https://en.wikipedia.org/wiki/Image_embossing

- https://learnopencv.com/photoshop-filters-in-opencv/

- https://towardsdatascience.com/types-of-convolution-kernels-simplified-f040cb307c37

- https://processing.org/tutorials/pshader/