let mosaic;
let symbol1;
let myImage;
let debug;
let slider;
const WIDTH_PIXEL = 64;
const HEIGHT_PIXEL = 64;
const NUM_IMAGES = 70;

function imagePreprocessing (img, contrast){
  applyContrast(img, contrast);
  return applyLuma(img);
}

function applyLuma (img){
  let lumaMatrix = []; // Stores luma values in matrix : [[row1], [row2], ..., [rowN]]

  let luma_Y = (pixel) => 0.2126 * red(pixel) + 0.7152 * green(pixel) + 0.0722 * blue(pixel);
  img.loadPixels();
  for (let j = 0; j < img.height; j++) {
    let row = [] // Single row of the matrix
    for (let i = 0; i < img.width; i++) {
      row.push(luma_Y(img.get(i, j))); // Apply luma to every pixel in image
    }
    lumaMatrix.push(row); 
  }
  return { 
    values: lumaMatrix ,
    minValue: luma_Y(color(0, 0, 0)), // Used for mapPixelToASCII
    maxValue: luma_Y(color(255, 255, 255)) // Used in mapPixelToASCII
  }
}

function applyContrast(img, contrast) {
  img.loadPixels();
  for (let x = 0; x < img.width; x +=1) {
    for (let y = 0; y < img.height; y +=1) {
      let c = img.get(x,y);
      let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
      let nR = constrain(factor*(red(c)-128) + 128, 0, 255);
      let nG = constrain(factor*(green(c)-128) + 128, 0, 255);
      let nB = constrain(factor*(blue(c)-128) + 128, 0, 255);
      let nC = color(nR,nG,nB);
      img.set(x,y,nC);
    }
  }
  img.updatePixels();
}

function preload() {
  myImage = loadImage("/vc/docs/sketches/images/mandrill.png");
  symbol1 = loadImage("/vc/docs/sketches/images/Characters.jpg");
  mosaic = loadShader(
    "/vc/docs/sketches/shaders/shader.vert",
    "/vc/docs/sketches/shaders/hardwareAscii.frag"
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
  imagePreprocessing(myImage, contrast=100);
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
