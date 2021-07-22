let theShader;
let fingers;
let reproduce = false;

const Blur_Kernel= [ 0.11, 0.11, 0.11 ,0.11, 0.11, 0.11, 0.11, 0.11, 0.11]; 
let Border_Detection= [ -1.0, -1.0, -1.0 , -1.0,  8.0, -1.0 , -1.0, -1.0, -1.0  ];
const Emboss= [ 1,  1,  0, 1,  0, -1 , 0,  -1,  -1]; 
const Sharpe= [ 0, -1, 0 , -1,  5, -1, 0, -1, 0 ]; 

let contador=0;
let matrixCarrousel= [Blur_Kernel,Border_Detection,Emboss,Sharpe];
let kernel = matrixCarrousel[0] ;

function preload() {
  theShader = loadShader('/vc/docs/sketches/workshop2/exercice2/shader.vert', '/vc/docs/sketches/workshop2/exercice2/edge.frag');
  fingers = createCapture(VIDEO)
  fingers.hide();
}

function setup() {
  createCanvas(640, 400, WEBGL);
  noStroke();
  textureMode(NORMAL); 
  shader(theShader);
  theShader.setUniform('texture', fingers);
  theShader.setUniform('texOffset',[1/fingers.width,1/fingers.height]);
  button=createButton('Change Kernel!');
  button.position(300,350);
  button.mousePressed(changeMatrix);
}
function draw() {
  background(0);
  
  beginShape() 
  vertex(-width / 2, height / 2, 0, 0, 1);
  vertex(width / 2, height / 2, 0, 1, 1);
  vertex(width / 2, -height / 2, 0, 1, 0);
  vertex(-width / 2, -height / 2, 0, 0, 0);
  theShader.setUniform('kernel', kernel);
  endShape(CLOSE)
  
}
function changeMatrix(){
  contador=(contador+1)%matrixCarrousel.length;
  kernel=matrixCarrousel[contador];
}