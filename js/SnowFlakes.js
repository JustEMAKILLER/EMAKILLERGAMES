// Snowfall JavaScript
const snowflakes = [];
const maxSnowflakes = 50; // Adjust for more/less snow
const flakeCreationInterval = 100; // ms between creating new flakes

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createSnowflake() {
  const flake = document.createElement('div');
  flake.className = 'snowflake';

  const size = random(2, 8); // Random size between 2-8px
  flake.style.width = `${size}px`;
  flake.style.height = `${size}px`;
  flake.style.opacity = random(0.5, 1); // Random opacity

  flake.x = random(0, window.innerWidth); // Start x position
  flake.y = -size; // Start above the screen
  flake.speed = random(1, 3); // Fall speed
  flake.amplitude = random(10, 30); // Horizontal sway amplitude
  flake.phase = random(0, Math.PI * 2); // Random phase for sine wave

  flake.style.left = `${flake.x}px`;
  flake.style.top = `${flake.y}px`;

  document.body.appendChild(flake);
  snowflakes.push(flake);
}

function updateSnowflakes() {
  snowflakes.forEach((flake, index) => {
    flake.y += flake.speed;
    flake.x += Math.sin(flake.y / 20 + flake.phase) * (flake.amplitude / 10); // Sway effect

    flake.style.top = `${flake.y}px`;
    flake.style.left = `${flake.x}px`;

    if (flake.y > window.innerHeight) {
      document.body.removeChild(flake);
      snowflakes.splice(index, 1);
    }
  });

  requestAnimationFrame(updateSnowflakes);
}

// Start creating snowflakes
setInterval(createSnowflake, flakeCreationInterval);

// Limit the number of snowflakes
setInterval(() => {
  while (snowflakes.length > maxSnowflakes) {
    const flake = snowflakes.shift();
    if (flake) {
      document.body.removeChild(flake);
    }
  }
}, 1000);

// Start the animation loop
updateSnowflakes();

// Handle window resize to adjust x positions if needed
window.addEventListener('resize', () => {
  snowflakes.forEach(flake => {
    if (flake.x > window.innerWidth) {
      flake.x = random(0, window.innerWidth);
    }
  });
});