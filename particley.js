let inc = 0.1;
let scl = 100;
let cols, rows;
let zoff = 0;

let particles = [];
let flowfield;

function setup() {
  createCanvas(1000, 1000);
  cols = floor(width / scl);
  rows = floor(height / scl);
  flowfield = new Array(cols * rows);

  // Create particles
  for (let i = 0; i < 10000; i++) {
    particles[i] = new Particle();
  }

  background("#202020"); // Dark background
}

function draw() {
  let yoff = 0;

  // Generate the flowfield
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let angle = noise(xoff, yoff, zoff) * TWO_PI * 3; // Wave-like motion
      let v = p5.Vector.fromAngle(angle);
      flowfield[index] = v;
      v.setMag(0.6);
      xoff += inc;
    }
    yoff += inc;
  }
  zoff += 0.002; // Adjust for dynamic flow

  // Update and display particles
  for (let particle of particles) {
    particle.follow(flowfield);
    particle.update();
    particle.edges();
    particle.show();
  }

  // Draw wave crests
  drawWaveCrests();
}

// Particle class
class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxspeed = 5;

    this.prevPos = this.pos.copy();
  }

  follow(vectors) {
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);
    let index = x + y * cols;
    let force = vectors[index];
    this.applyForce(force);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  show() {
    stroke(255, 50);
    strokeWeight(1);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.updatePrev();
  }

  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  edges() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.updatePrev();
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.updatePrev();
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.updatePrev();
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.updatePrev();
    }
  }
}

function drawWaveCrests() {
  noFill();


  // Draw a limited number of wave lines
  for (let i = 0; i < 1; i++) { // Only draw 3 wave lines
    let amplitude = random(50, 40); // Control the height of the waves
    let wavelength = random(300, 6000); // Control the length of the waves
    let phase = frameCount * 50 + i * 200; // Offset each wave slightly for variety

    beginShape();
    for (let x = 0; x < width; x += 2000) { // Wider gaps between points
      let y =
        height / 2 +
        sin((x / wavelength + phase) * TWO_PI) * amplitude +
        random(-5, 50); // Slight randomness for a natural look
      vertex(x, y);
    }
    endShape();
  }
}



