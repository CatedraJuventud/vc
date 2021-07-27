let fingers;
let lienzo;
let contador=0;
let reproduce = true;

let maxFr=0;
let frames=0;
let i =0;

const Blur_Kernel= [ [0.11, 0.11, 0.11],
[0.11, 0.11, 0.11],
[0.11, 0.11, 0.11]]; 
const Border_Detection= [ [ -1, -1, -1 ],
[ -1,  8, -1 ],
[ -1, -1, -1 ] ];
const Emboss= [  [ 1,  1,  0],
[ 1,  0, -1 ],
[ 0,  -1,  -1] ]; 
const Sharpe= [  [ 0, -1, 0 ],
[ -1,  5, -1],
[ 0, -1, 0 ] ]; 

let matrixCarrousel=[Blur_Kernel,Border_Detection,Emboss,Sharpe];
let matrix =matrixCarrousel[0] ;
const matrixsize=3;
function setup() {
  fingers = createVideo(['/vc/docs/sketches/fingers.mov', '/vc/docs/sketches/fingers.webm']);
  fingers.hide(); 
  createCanvas(640, 240);
  lienzo=createImage(320,240);
  button=createButton('Change Kernel!');
  button2=createButton('Play/Pause');
  button.position(275,200);
  button2.position(290,225);
  button.mousePressed(changeMatrix);
  button2.mousePressed(pauseVideo);
  // frameRate(3);//solo 3 frames por segundo pues no contamos con gpu
  frameRate(120);
  noLoop()
}

function benchmark(f){
  frames+=f;
  maxFr=maxFr<f?f:maxFr;
  i+=1;
  if(i%100==0){
    console.log("max"+maxFr);
    console.log("avg:"+frames/i);
    i=0;
    frames=0;
  }
}


function draw() {
  let f=frameRate()
benchmark(f)
  background(0);
  lienzo.loadPixels();//en lienzo pintamos imagen convolucionada
  fingers.loadPixels();
    // Begin our loop for every pixel in the smaller image
  for (let x = 0; x <fingers.width; x++) {
    for (let y = 0; y < fingers.height; y++ ) {
      let c = convolution(x, y, matrix, matrixsize, fingers);
      let loc = (x + y*fingers.width) * 4;
      lienzo.pixels[loc] = red(c);
      lienzo.pixels[loc + 1] = green(c);
      lienzo.pixels[loc + 2] = blue(c);
      lienzo.pixels[loc + 3] = alpha(c);
    }
  }
  lienzo.updatePixels();
  image(fingers,0,0); 
  image(lienzo,fingers.width+1,0);//pintamos la imagen convolucionada debajo de la original
}
function changeMatrix(){
  contador=(contador+1)%matrixCarrousel.length;
  matrix=matrixCarrousel[contador];
}

function pauseVideo() {
  reproduce = !reproduce;
  if (reproduce){
    
    loop();
    fingers.loop(); // al presionar en el lienzo blanco inicia el video
  }else{
    noLoop();
    fingers.pause(); // al presionar en el lienzo blanco inicia el video
  }
}
function convolution(x, y, matrix, matrixsize, img) {
    let rtotal = 0.0;
    let gtotal = 0.0;
    let btotal = 0.0;
    const offset = Math.floor(matrixsize / 2);
    for (let i = 0; i < matrixsize; i++){
      for (let j = 0; j < matrixsize; j++){
        
        // What pixel are we testing
        const xloc = (x + i - offset);
        const yloc = (y + j - offset);
        let loc = (xloc + img.width * yloc) * 4;
  
        // Make sure we haven't walked off our image, we could do better here
        loc = constrain(loc, 0 , img.pixels.length - 1);
  
        // Calculate the convolution
        // retrieve RGB values
        rtotal += (img.pixels[loc]) * matrix[i][j];
        gtotal += (img.pixels[loc + 1]) * matrix[i][j];
        btotal += (img.pixels[loc + 2]) * matrix[i][j];
      }
    }
    // Make sure RGB is within range
    rtotal = constrain(rtotal, 0, 255);
    gtotal = constrain(gtotal, 0, 255);
    btotal = constrain(btotal, 0, 255);
    
    // Return the resulting color
    return color(rtotal, gtotal, btotal);
  } 