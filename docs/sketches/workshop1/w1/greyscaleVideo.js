let fingers;
let lienzo1;
let lienzo2;
let contador=0;

let maxFr=0;
let frames=0;
let i =0;

function setup() {
  fingers = createVideo(['/vc/docs/sketches/fingers.mov', '/vc/docs/sketches/fingers.webm']);
  fingers.hide(); 
  createCanvas(960, 240);
  lienzo1=createImage(320,240);
  lienzo2=createImage(320,240);
  fingers.loop();
  // frameRate(3);
  frameRate(120);
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
  fingers.loadPixels();
  
  lienzo1.loadPixels();
  lienzo2.loadPixels();

  for (let x = 0; x <fingers.width; x++) {
    for (let y = 0; y < fingers.height; y++ ) {

      let loc = (x + y*fingers.width) * 4;
      let prom = (fingers.pixels[loc] + fingers.pixels[loc + 1] + fingers.pixels[loc + 2])/3;
      lienzo1.pixels[loc] = prom;
      lienzo1.pixels[loc + 1] = prom;
      lienzo1.pixels[loc + 2] = prom;
      lienzo1.pixels[loc + 3] = 255;

      let luma = 0.2126 * red(fingers.pixels[loc]) + 0.7152 * green(fingers.pixels[loc + 1]) + 0.0722 * blue(fingers.pixels[loc + 2]);

      lienzo2.pixels[loc] = luma;
      lienzo2.pixels[loc + 1] = luma;
      lienzo2.pixels[loc + 2] = luma;
      lienzo2.pixels[loc + 3] = 255;

    }
  }

  lienzo1.updatePixels();
  lienzo2.updatePixels();

  image(fingers,1,0); 
  image(lienzo1,fingers.width,0);
  image(lienzo2,fingers.width*2,0); 
}

function mousePressed() {
  fingers.loop(); 
}
