
let theShader;
let img;
function preload() {
  theShader = loadShader('../sketches/shaders/shader.vert', '../sketches/shaders/edge.frag');
  img = loadImage('../sketches/lenna.png');
}
function setup() {
  createCanvas(710, 400, WEBGL);
  noStroke();
  textureMode(NORMAL);
  shader(theShader);
  theShader.setUniform('texture', img);
  theShader.setUniform('texOffset',[1/img.width,1/img.height]);
}
function draw() {
  background(0);
  beginShape()
  vertex(-width / 2, -height / 2, 0, 0, 1);
  vertex(width / 2, -height / 2, 0, 1, 1);
  vertex(width / 2, height / 2, 0, 1, 0);
  vertex(-width / 2, height / 2, 0, 0, 0);
  endShape(CLOSE)
}
// good example in https://editor.p5js.org/cocopon/sketches/rke1-X8t7