let original;

function preload() {
    const location = '/vc/docs/sketches/images/Characters.jpg'
    original = loadImage(location);
}

function setup() {
    createCanvas(4480, 64);
    image(original,0,0);
}
