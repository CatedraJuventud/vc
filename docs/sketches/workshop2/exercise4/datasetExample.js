let original;

function preload() {
    const location = '/vc/docs/sketches/images/concat_dataset.jpg'
    original = loadImage(location);
}

function setup() {
    createCanvas(16000, 100);
    image(original,0,0);
}
