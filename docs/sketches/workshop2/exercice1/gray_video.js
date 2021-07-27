
let grayShader;
let lumaShader;
let space;
let shaderTexture;
let inverseShader;


function preload() {
  video = createVideo(['/vc/docs/sketches/fingers.mov', '/vc/docs/sketches/fingers.webm']);
  grayShader = loadShader('/vc/docs/sketches/workshop2/exercice1/shader.vert', '/vc/docs/sketches/workshop2/exercice1/rgb.frag');
  lumaShader = loadShader('/vc/docs/sketches/workshop2/exercice1/shader.vert', '/vc/docs/sketches/workshop2/exercice1/luma.frag');
  inverseShader = loadShader('/vc/docs/sketches/workshop2/exercice1/shader.vert','/vc/docs/sketches/workshop2/exercice1/inverse.frag')
  video.hide();
}

function setup() {
  createCanvas(768, 256, WEBGL);
  noStroke();

  theShader = createGraphics(256, 256, WEBGL);
  theShader.noStroke();

  video.loop(); 
  angleMode(DEGREES);
}

function draw() {

  theShader.shader(grayShader);
  grayShader.setUniform('tex', video);
  texture(theShader);
  theShader.rect(0,0,256,256);
  rect(-124,-256/2.0,256,256)

  theShader.shader(inverseShader);
  inverseShader.setUniform('tex', video);
  texture(theShader);
  theShader.rect(0,0,256,256);
  rect(140,-256/2.0,256,256);

  theShader.shader(lumaShader);
  rotateY(180);
  lumaShader.setUniform('tex0', video);
  texture(theShader);
  theShader.rect(0,0,256,256);
  rect(132,-256/2.0,256,256)

}

function mousePressed() {
  video.loop(); 
}
