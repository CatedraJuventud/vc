let iA;
let img;
const pixelSize=5;
let textures=[];
let theShader;
function preload() {
 for (let p=1;p<58;p++){
   
    let im=loadImage(`../sketches/images/generatedtext (${p}).png`);
    textures.push(im);
 
 }
 theShader = loadShader('../sketches/shaders/shader.vert', '../sketches/shaders/normalTexture.frag');
  img=loadImage('../sketches/lenna.png');
}
function setup(){
  createCanvas(500, 400,WEBGL);
  textureMode(NORMAL);
  noLoop();
  img.resize(img.width/pixelSize,img.height/pixelSize);
  shader(theShader);
  noStroke();
}

function draw() {
    img.loadPixels();
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++ ) {
      let loc = (x + y*img.width) * 4;
      let brigthness=(img.pixels[loc] +img.pixels[loc + 1] +img.pixels[loc + 2] )/3;
      let position = Math.round(map(brigthness, 0, 255, 0, textures.length - 1));
     cover(x*pixelSize-(width/2),y*pixelSize-(height/2),textures[position]);
      
    }
  }
}

function cover(x,y,img){
  beginShape();
  theShader.setUniform('texture', img);
  vertex(x, y-pixelSize, 0, 0, 0);
  vertex(x+pixelSize, y-pixelSize, 0, 1, 0);
  vertex(x+pixelSize, y, 0, 1, 1);
  vertex(x,y, 0, 0, 1);
  endShape();
}
