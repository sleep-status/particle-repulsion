//grab canvas from html, and initializes 2d environment
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Create and inject the overlay text element
const overlayText = document.createElement('div');
overlayText.id = 'overlay-text';
overlayText.innerHTML = `
  <p>
  Move your mouse to see how the particles respond. <br>
  </p>
`;
document.body.appendChild(overlayText);

// Style the overlay text directly in JS
Object.assign(overlayText.style, {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  color: 'white',
  fontSize: '24px',
  fontFamily: 'Arial, sans-serif',
  maxWidth: '600px',
  lineHeight: '1.5',
  zIndex: '-1', 
  opacity: '1',
  pointerEvents: 'none', // allows mouse to pass through to canvas
  fontWeight: "0.5",
  textShadow: '2px 2px 6px rgba(0, 0, 0, 0.7)',
});

// UI starting Settings
const settings = {
  particleCount: 3000,
  particleSize: 3,
  particleColor: '#f2f2f2',
  repulsionRadius: 100,
  cursorForce: 500,
  innerColor: '#88b1b1',
  outerColor: '#ffffff'
};

//global variables
let width, height;
let particles = [];

//sets canvas to fill entire browser window, doesn't rely on css
function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

// ensures that canvas size is resized properly if size changes
// runs resizeCanvas() once initialized so it's sized properly on load
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Placeholder for mouse position to start in the centre of the screen
//also keeps track of current mouse position
const mouse = {
  x: width / 2,
  y: height / 2
};

// (e) is just short for "event" - it's an object that contains information about the event that just happened 
//browser automatically creates an "e" object with mouse.x and mouse.y info
canvas.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = settings.particleSize;
    this.color = settings.particleColor;
    this.vx = Math.random() * 2 - 1;
    this.vy = Math.random() * 2 - 1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    ctx.lineWidth = 0.5; 
  ctx.strokeStyle = 'black';
  ctx.stroke();

  ctx.closePath();
  }

  update() {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
  
    const repulsionRadius = settings.repulsionRadius;
    const force = settings.cursorForce / (distance * distance); 
    const angle = Math.atan2(dy, dx);
  
    if (distance < repulsionRadius) {
      this.vx -= Math.cos(angle) * force;
      this.vy -= Math.sin(angle) * force;
    }

//max speed at which particles can move 
const maxSpeed = 2.5
const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  if (speed > maxSpeed) {
    this.vx = (this.vx / speed) * maxSpeed;
    this.vy = (this.vy / speed) * maxSpeed;
  }

// particle friction
const friction = 0.97;

this.vx *= friction;
this.vy *= friction;

// particle repulsion from each other 
for (let other of particles) {
  if (other === this) continue; 

  const dx = other.x - this.x;
  const dy = other.y - this.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const repulsionRadius = 10; 
  
  if (dist < repulsionRadius && dist > 0) {
    const force = 5 / (dist * dist); 
    const angle = Math.atan2(dy, dx);
    
    // Push them away from each other
    this.vx -= Math.cos(angle) * force;
    this.vy -= Math.sin(angle) * force;
  }
}  
    this.x += this.vx;
    this.y += this.vy;
  
    // Optional: bounce off canvas edges
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  
    this.draw();
  }
  
}
// ^^ all above is in the particle class


function initParticles(count = settings.particleCount) {
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(Math.random() * width, Math.random() * height));
  }
}


//clears the entire canvas before drawing the new frame  
function animate() {
  // Create radial gradient background
const gradient = ctx.createRadialGradient(
  width / 2, height / 2, 0,          
  width / 2, height / 2, width / 1.2 
);
gradient.addColorStop(0, settings.innerColor); 
gradient.addColorStop(0.9, settings.outerColor); 

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, width, height); 

  for (let particle of particles) {
    particle.update();
  }

  requestAnimationFrame(animate);
}

initParticles(3000);
animate();

const gui = new dat.GUI();

gui.add(settings, 'particleCount', 500, 5000, 100).onFinishChange((value) => {
  initParticles(value);
});
gui.add(settings, 'particleSize', 1, 10, 1).onChange((value) => {
  particles.forEach(p => p.radius = value);
});
gui.addColor(settings, 'particleColor').onChange((value) => {
  particles.forEach(p => p.color = value);
});
gui.add(settings, 'repulsionRadius', 10, 1000, 50).name('Cursor Radius');
gui.add(settings, 'cursorForce', 10, 1000, 50).name('Cursor Force');
gui.addColor(settings, 'innerColor').name('Center Color');
gui.addColor(settings, 'outerColor').name('Edge Color');
