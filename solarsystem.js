// Global variables
let centerX, centerY;           // Center coordinates of the canvas
let stars = [];                 // Array to store star positions
let planets = [];               // Array to store planet objects
let timeStep = 0.01;            // Time increment per frame (years)
let isPaused = false;           // Boolean to track pause state
let sunPresent = true;          // Boolean to track Sun’s presence
let sun;                        // Sun object

// Setup function: initializes the simulation
function setup() {
  createCanvas(800, 800);
  centerX = width / 2;          // 400
  centerY = height / 2;         // 400

  // Generate background stars
  for (let i = 0; i < 100; i++) {
    stars.push({x: random(width), y: random(height)});
  }

  // Define the Sun
  sun = {name: "Sun", type: "sun", color: "#FFFF00", size: 50, isPresent: true};

  // Define planets with science facts
  planets = [
    { name: "Mercury", color: "#A9A9A9", size: 6,  orbitRadius: 50,  auDistance: 0.387,  orbitalPeriod: 0.24,    angle: 0, isPresent: true, fact: "Mercury has no atmosphere, so its surface is scarred by countless craters." },
    { name: "Venus",   color: "#FFD700", size: 10, orbitRadius: 80,  auDistance: 0.723,  orbitalPeriod: 0.62,    angle: 0, isPresent: true, fact: "Venus spins backwards and has a day longer than its year!" },
    { name: "Earth",   color: "#0000FF", size: 12, orbitRadius: 110, auDistance: 1.0,    orbitalPeriod: 1.0,     angle: 0, isPresent: true, fact: "Earth is the only planet known to support life, thanks to its liquid water." },
    { name: "Mars",    color: "#FF0000", size: 8,  orbitRadius: 140, auDistance: 1.524,  orbitalPeriod: 1.88,    angle: 0, isPresent: true, fact: "Mars hosts the solar system’s largest volcano, Olympus Mons." },
    { name: "Jupiter", color: "#FFA500", size: 30, orbitRadius: 200, auDistance: 5.203,  orbitalPeriod: 11.86,   angle: 0, isPresent: true, fact: "Jupiter’s Great Red Spot is a storm that’s raged for over 300 years." },
    { name: "Saturn",  color: "#FFFFE0", size: 25, orbitRadius: 250, auDistance: 9.539,  orbitalPeriod: 29.46,   angle: 0, isPresent: true, fact: "Saturn’s rings are made of ice, dust, and rock, stretching thousands of kilometers." },
    { name: "Uranus",  color: "#ADD8E6", size: 18, orbitRadius: 300, auDistance: 19.191, orbitalPeriod: 84.01,   angle: 0, isPresent: true, fact: "Uranus rolls on its side due to a dramatic tilt, likely from an ancient collision." },
    { name: "Neptune", color: "#00008B", size: 18, orbitRadius: 350, auDistance: 30.069, orbitalPeriod: 164.79,  angle: 0, isPresent: true, fact: "Neptune has the strongest winds in the solar system, up to 2,000 km/h." }
  ];

  // Initialize planet positions and velocities
  for (let planet of planets) {
    planet.x = centerX + planet.orbitRadius * cos(planet.angle);
    planet.y = centerY + planet.orbitRadius * sin(planet.angle);
    planet.vx = 0;
    planet.vy = 0;
  }
}

// Draw function: updates and renders the simulation
function draw() {
  background(0);

  // Draw stars
  fill(255, 50);
  noStroke();
  for (let star of stars) {
    ellipse(star.x, star.y, 2);
  }

  // Draw instruction box in top-left corner
  fill(0, 150);                // Semi-transparent black background
  rect(10, 10, 260, 100);      // Rectangle for instructions
  fill(255);                   // White text
  textSize(14);
  text("Instructions:", 20, 30);
  textSize(12);
  text("- Press 's' to pause/resume", 20, 50);
  text("- Hover over planet for info", 20, 70);
  text("- Click Sun/planet to remove", 20, 90);

  // Draw Sun if present
  if (sun.isPresent) {
    fill(sun.color);
    ellipse(centerX, centerY, sun.size);
  }

  // Draw orbital paths if Sun is present
  if (sunPresent) {
    noFill();
    stroke(255, 50);
    for (let planet of planets) {
      if (planet.isPresent) {
        ellipse(centerX, centerY, 2 * planet.orbitRadius);
      }
    }
    noStroke();
  }

  // Update planets if not paused
  if (!isPaused) {
    if (sunPresent) {
      for (let planet of planets) {
        if (planet.isPresent) {
          planet.angle += (TWO_PI / planet.orbitalPeriod) * timeStep;
          planet.x = centerX + planet.orbitRadius * cos(planet.angle);
          planet.y = centerY + planet.orbitRadius * sin(planet.angle);
        }
      }
    } else {
      for (let planet of planets) {
        if (planet.isPresent) {
          planet.x += planet.vx;
          planet.y += planet.vy;
        }
      }
    }
  }

  // Draw planets and labels
  fill(255);
  textSize(12);
  let infoText = "";

  for (let planet of planets) {
    if (planet.isPresent) {
      fill(planet.color);
      ellipse(planet.x, planet.y, planet.size);
      fill(255);
      text(planet.name, planet.x + planet.size / 2 + 5, planet.y);

      // Hover info with science fact
      let d = dist(mouseX, mouseY, planet.x, planet.y);
      if (d < planet.size / 2 + 5) {
        infoText = `${planet.name}, Distance: ${planet.auDistance.toFixed(3)} AU\nFact: ${planet.fact}`;
      }
    }
  }

  // Display hover info at top center
  if (infoText != "") {
    textAlign(CENTER);
    fill(0, 150);              // Semi-transparent black background for readability
    rect(width / 2 - 150, 120, 300, 60); // Rectangle below instruction box
    fill(255);                 // White text
    text(infoText, width / 2, 140); // Positioned at top, below instructions
    textAlign(LEFT);
  }
}

// Toggle pause with 's' key
function keyPressed() {
  if (key == 's' || key == 'S') {
    isPaused = !isPaused;
  }
}

// Remove Sun or planet on click
function mousePressed() {
  // Remove Sun
  if (dist(mouseX, mouseY, centerX, centerY) < sun.size / 2 && sun.isPresent) {
    sun.isPresent = false;
    sunPresent = false;
    for (let planet of planets) {
      if (planet.isPresent) {
        let deltaAngle = (TWO_PI / planet.orbitalPeriod) * timeStep;
        let x_current = centerX + planet.orbitRadius * cos(planet.angle);
        let y_current = centerY + planet.orbitRadius * sin(planet.angle);
        let x_future = centerX + planet.orbitRadius * cos(planet.angle + deltaAngle);
        let y_future = centerY + planet.orbitRadius * sin(planet.angle + deltaAngle);
        planet.vx = (x_future - x_current);
        planet.vy = (y_future - y_current);
        planet.x = x_current;
        planet.y = y_current;
      }
    }
  }

  // Remove planet
  for (let planet of planets) {
    if (planet.isPresent && dist(mouseX, mouseY, planet.x, planet.y) < planet.size / 2) {
      planet.isPresent = false;
    }
  }
}
