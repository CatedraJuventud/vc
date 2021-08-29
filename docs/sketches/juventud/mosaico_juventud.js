let mosaic;
let symbol1;
let myImages=[];
let debug;
let slider;
let counter=0;
const WIDTH_PIXEL = 64;
const HEIGHT_PIXEL = 64;
const NUM_IMAGES = 70;
function preload() {
  myImages[0] = loadImage("/vc/docs/sketches/juventud/joven_guerra.jpg");
  myImages[1]= loadImage("/vc/docs/sketches/juventud/libertad.jpg")
  symbol1 = loadImage("/vc/docs/sketches/images/concat_dataset.jpg");
  mosaic = loadShader(
    "/vc/docs/sketches/shaders/shader.vert",
    "/vc/docs/sketches/shaders/hardwarePhotomosaic.frag"
  );
}

function setup() {
button = createButton('>');
  button.position(580, 300);
  button.mousePressed(change);
  slider = createSlider(1, 10, 1,1);
  slider.position(10, 10);
  slider.style('width', '100px');
  createCanvas(600, 600, WEBGL);
  textureMode(NORMAL);
  noStroke();
  shader(mosaic);
  mosaic.setUniform("image", myImages[0]);
  mosaic.setUniform("WIDTH_PIXEL", WIDTH_PIXEL);
  mosaic.setUniform("NUM_IMAGES", NUM_IMAGES);
  mosaic.setUniform("HEIGHT_PIXEL", HEIGHT_PIXEL);
  debug = true;
  mosaic.setUniform("debug", debug);
  let img = symbol1;
  mosaic.setUniform("symbol1", img);
}

function draw() {
  mosaic.setUniform("resolution", Math.pow(2,slider.value()));
  mosaic.setUniform("image", myImages[counter]);
  background(33);
  cover(true);
}
const scaw=1;
const scah=0.7;
function cover(texture = false) {
  beginShape()
  
  let semiw=width*scaw;
  let semih=height*scah;
  if (texture) {
    //texture(img);
    vertex(-semiw / 2, -height / 2, 0, 0, 0);
    vertex(semiw / 2, -height / 2, 0, 1, 0);
    vertex(semiw / 2, semih / 2, 0, 1, 1);
    vertex(-semiw / 2, semih / 2, 0, 0, 1);
  } else {
    vertex(-semiw / 2, -height / 2, 0);
    vertex(semiw / 2, -height / 2, 0);
    vertex(semiw / 2, semih / 2, 0);
    vertex(-semiw / 2, semih / 2, 0);
  }
  endShape(CLOSE);
}

function keyPressed() {
  if (key === "d") {
    debug = !debug;
    mosaic.setUniform("debug", debug);
  }
}
function change(){
    counter=(counter+1)%myImages.length
    removeElements()
    slider = createSlider(1, 10, 1,1);
    slider.position(10, 10);
    slider.style('width', '100px');
    button = createButton('>');
  button.position(580, 300);
  button.mousePressed(change);
}
