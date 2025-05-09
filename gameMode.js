// Create Start Game Button
const gameModeButton = document.createElement('button');
gameModeButton.innerHTML = 'Start Game';
document.body.appendChild(gameModeButton);

// Style Start Game Button
Object.assign(gameModeButton.style, {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '15px 30px',
  fontSize: '20px',
  fontWeight: 'bold',
  borderRadius: '10px',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: '#ffffff',
  color: '#000',
  zIndex: 2
});

// Create Rules Text
const gameRules = document.createElement('div');
gameRules.id = 'game-rules';
gameRules.innerHTML = `
  <p>
    Use your cursor to herd the sheep.
  </p>
`;
document.body.appendChild(gameRules);

// Style Rules
Object.assign(gameRules.style, {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  color: 'white',
  fontSize: '30px',
  fontFamily: 'Arial, sans-serif',
  maxWidth: '600px',
  lineHeight: '1.6',
  zIndex: '1',
  pointerEvents: 'none',
  fontWeight: '400',
  textShadow: '2px 2px 6px rgba(0, 0, 0, 0.7)',
});

// Game State
let isGameMode = false;
const target = {
  x: width / 2,
  y: height / 2,
  radius: 100
};

// Start Game on Button Click
gameModeButton.addEventListener('click', () => {
  isGameMode = true;
  gameModeButton.style.display = 'none';
  gameRules.style.display = 'none';
  initParticles(settings.particleCount);  // Reset particles
  gameLoop();  // Start game loop
});

// Draw Target
function drawTarget() {
  ctx.beginPath();
  ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(165, 42, 42, 0.5)';
  ctx.fill();
  ctx.closePath();
}

let score = 0;

function gameLoop() {
  // Background
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 1.2);
  gradient.addColorStop(0, settings.innerColor);
  gradient.addColorStop(0.9, settings.outerColor);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Target
  drawTarget();

// Remove particles that enter the target area and update score
particles = particles.filter(p => {
  const dist = Math.sqrt(Math.pow(p.x - target.x, 2) + Math.pow(p.y - target.y, 2));
  if (dist < target.radius) {
    score += 1;
    return false; // remove this particle
  }
  return true; // keep this particle
});

  // Score Display
  ctx.font = '30px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText(`Score: ${score}`, 10, 50);

  // Update Particles
  for (let particle of particles) {
    particle.update();
  }

  if (isGameMode) {
    requestAnimationFrame(gameLoop);
  }
}


initParticles(250);
animate();