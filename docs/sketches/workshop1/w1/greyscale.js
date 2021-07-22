

let img_original, img_transformed;

function preload() {
  let location = '/vc/docs/sketches/lenna.png';
  img_original = loadImage(location);
  img_transformed = loadImage(location);
}

function setup() {
  createCanvas(775, 255);
  img_original.resize(250, 250);
  image(img_original, 0, 0);

  let values = [applyConvertion(img_original, 'avg').values, applyConvertion(img_original, 'luma').values];

  for (let i=0; i < values.length; i++) {
    let curr = values[i]
    let img = createImage(250, 250);
    img.loadPixels();
    for (let i = 0; i < img.width; i++) {
      for (let j = 0; j < img.height; j++) {
        img.set(i, j, color(curr[j][i]));
      }
    }
    img.updatePixels();
    image(img, 260*(i+1), 0);
  }

}


/**
 * 
 * @param {*} img : image to be processed. Function changes the same reference to image. 
 * @param {*} convertion : type of convertion. 
 * @returns 
 */
function applyConvertion (img, convertion){
  let newImage = []; // Stores values in matrix : [[row1], [row2], ..., [rowN]]
  let conv;

  if (convertion === 'avg') {
    conv = (pixel) => (red(pixel) +  green(pixel) + blue(pixel))/3;
  } else {
    conv = (pixel) => 0.2126 * red(pixel) + 0.7152 * green(pixel) + 0.0722 * blue(pixel);
  }

  img.loadPixels();
  for (let j = 0; j < img.height; j++) {
    let row = [] // Single row of the matrix
    for (let i = 0; i < img.width; i++) {
      row.push(conv(img.get(i, j))); // Apply to every pixel in image
    }
    newImage.push(row); 
  }
  return { 
    values: newImage 
  }
}



