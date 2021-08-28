let mosaic;
let symbol1;
let myImage;
let debug;
let slider;
const WIDTH_PIXEL = 64;
const HEIGHT_PIXEL = 64;
const NUM_IMAGES = 70;
function preload() {
  myImage = loadImage("/vc/docs/sketches/images/mandrill.png");
  symbol1 = loadImage("/vc/docs/sketches/images/concat_dataset.jpg");
  mosaic = loadShader(
    "/vc/docs/sketches/shaders/shader.vert",
    "/vc/docs/sketches/shaders/hardwarePhotomosaic.frag"
  );
}

function setup() {
  slider = createSlider(1, 6, 4,1);
  slider.position(10, 10);
  slider.style('width', '100px');
  createCanvas(600, 600, WEBGL);
  textureMode(NORMAL);
  noStroke();
  shader(mosaic);
  mosaic.setUniform("image", myImage);
  mosaic.setUniform("WIDTH_PIXEL", WIDTH_PIXEL);
  mosaic.setUniform("NUM_IMAGES", NUM_IMAGES);
  mosaic.setUniform("HEIGHT_PIXEL", HEIGHT_PIXEL);
  debug = true;
  mosaic.setUniform("debug", debug);
  let img = symbol1;
  mosaic.setUniform("symbol1", img);
}

function draw() {
  mosaic.setUniform("resolution", Math.pow(10,slider.value()));

  background(33);
  cover(true);
}

function cover(texture = false) {
  beginShape();
  if (texture) {
    //texture(img);
    vertex(-width / 2, -height / 2, 0, 0, 0);
    vertex(width / 2, -height / 2, 0, 1, 0);
    vertex(width / 2, height / 2, 0, 1, 1);
    vertex(-width / 2, height / 2, 0, 0, 1);
  } else {
    vertex(-width / 2, -height / 2, 0);
    vertex(width / 2, -height / 2, 0);
    vertex(width / 2, height / 2, 0);
    vertex(-width / 2, height / 2, 0);
  }
  endShape(CLOSE);
}

function keyPressed() {
  if (key === "d") {
    debug = !debug;
    mosaic.setUniform("debug", debug);
  }
}
