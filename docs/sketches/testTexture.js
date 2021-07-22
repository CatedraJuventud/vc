
let img;
function setup(){
  createCanvas(720,540,WEBGL);
  img=loadImage('/vc/docs/sketches/lenna.png');
   ortho(-width/2,width/2,-height/2,height/2);
   textureMode(NORMAL);
}

function draw(){
background(255);
texture(img);
cover(true);
orbitControl();//poscicion de camara a partir del mouse

}

function cover(texture=false){
beginShape();
if (texture) {
  //texture(img);
  vertex(-width / 2, -height / 2, 0, 0, 0);
  vertex(width / 2, -height / 2, 0, 1, 0);
  vertex(width / 2, height / 2, 0, 1, 1);
  vertex(-width / 2, height / 2, 0, 0, 1);
}
else {
  vertex(-width / 2, -height / 2, 0);
  vertex(width / 2, -height / 2, 0);
  vertex(width / 2, height / 2, 0);
  vertex(-width / 2, height / 2, 0);
}
endShape(CLOSE);
}