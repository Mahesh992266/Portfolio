/* Interactive Engine for Maheshwar Kadbane Portfolio */

document.addEventListener('DOMContentLoaded', () => {
  initModeSwitcher();
  initCanvasBackground();
  initTiltEffect();
  initTerminalEmulator();
  initMobileNav();
  initContactForm();
});

/* =========================================================================
   1. Mode Switcher (Logic & Lens State Controller)
   ========================================================================= */
let currentMode = 'logic'; // 'logic' or 'lens'

function initModeSwitcher() {
  const toggleBtn = document.getElementById('mode-toggle');
  const instaSocial = document.getElementById('insta-social');

  if (!toggleBtn) return;

  const handleModeChange = (mode) => {
    currentMode = mode;
    if (mode === 'logic') {
      document.body.className = 'mode-logic';
      if (instaSocial) {
        instaSocial.setAttribute('href', 'https://instagram.com/kadbane9922');
      }
      // Re-trigger terminal typing
      triggerTerminalTyping();
    } else {
      document.body.className = 'mode-lens';
      if (instaSocial) {
        instaSocial.setAttribute('href', 'https://instagram.com/mk_creation_9922');
      }
    }
    // Update active nav state to 'About' on theme toggle to maintain clean view
    updateActiveNav();
  };

  toggleBtn.addEventListener('click', () => {
    const newMode = currentMode === 'logic' ? 'lens' : 'logic';
    handleModeChange(newMode);
  });

  // Hotkey toggle: press 'M' to switch modes
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'm' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      const newMode = currentMode === 'logic' ? 'lens' : 'logic';
      handleModeChange(newMode);
    }
  });
}

function updateActiveNav() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#about') {
      link.classList.add('active');
    }
  });
}

/* =========================================================================
   2. Interactive Canvas Background (Neural Net vs. Bokeh Bubble System)
   ========================================================================= */
let canvas, ctx;
let particles = [];
const particleCount = 65;

function initCanvasBackground() {
  canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  
  ctx = canvas.getContext('2d');
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  createParticles();
  animateCanvas();
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1; // Default node size
    this.speedX = (Math.random() - 0.5) * 0.6;
    this.speedY = (Math.random() - 0.5) * 0.6;
    this.alpha = Math.random() * 0.5 + 0.2;
    
    // Lens bokeh parameters
    this.bokehRadius = Math.random() * 35 + 15;
    this.bokehSpeedY = -(Math.random() * 0.4 + 0.1); // float upwards
    this.bokehSpeedX = (Math.random() - 0.5) * 0.15;
    this.bokehAlpha = Math.random() * 0.15 + 0.05;
  }

  update() {
    if (currentMode === 'logic') {
      // Logic mode: normal node movement
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Boundary collision
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    } else {
      // Lens mode: slow floating bokeh bubbles
      this.y += this.bokehSpeedY;
      this.x += this.bokehSpeedX;
      
      // Wrap around top or sides
      if (this.y < -this.bokehRadius * 2) {
        this.y = canvas.height + this.bokehRadius * 2;
        this.x = Math.random() * canvas.width;
      }
      if (this.x < -this.bokehRadius || this.x > canvas.width + this.bokehRadius) {
        this.bokehSpeedX *= -1;
      }
    }
  }

  draw() {
    ctx.beginPath();
    if (currentMode === 'logic') {
      // Draw standard neural network dot
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 242, 254, ${this.alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00f2fe';
      ctx.fill();
    } else {
      // Draw warm bokeh glowing circle
      ctx.arc(this.x, this.y, this.bokehRadius, 0, Math.PI * 2);
      
      // Alternate bokeh colors for artistic lens aesthetic
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.bokehRadius);
      if (this.bokehRadius > 35) {
        gradient.addColorStop(0, `rgba(255, 8, 68, ${this.bokehAlpha})`);
        gradient.addColorStop(1, 'rgba(255, 8, 68, 0)');
      } else if (this.bokehRadius > 25) {
        gradient.addColorStop(0, `rgba(247, 37, 133, ${this.bokehAlpha})`);
        gradient.addColorStop(1, 'rgba(247, 37, 133, 0)');
      } else {
        gradient.addColorStop(0, `rgba(255, 177, 153, ${this.bokehAlpha})`);
        gradient.addColorStop(1, 'rgba(255, 177, 153, 0)');
      }
      
      ctx.fillStyle = gradient;
      ctx.shadowBlur = 0; // standard bokeh is clean blur rather than drop-shadow glow
      ctx.fill();
    }
  }
}

function createParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function drawConnections() {
  if (currentMode !== 'logic') return;
  
  const maxDistance = 110;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < maxDistance) {
        const opacity = (1 - (dist / maxDistance)) * 0.15;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  
  drawConnections();
  
  requestAnimationFrame(animateCanvas);
}

/* =========================================================================
   3. 3D Card Hover Perspective Effect (Standard Tilt Logic)
   ========================================================================= */
function initTiltEffect() {
  const cards = document.querySelectorAll('[data-tilt]');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // cursor pos inside element
      const y = e.clientY - rect.top;
      
      // Convert pos to coordinates between -1 and 1
      const dx = (x - rect.width / 2) / (rect.width / 2);
      const dy = (y - rect.height / 2) / (rect.height / 2);
      
      // Calculate max angle of rotation (e.g. 10 degrees)
      const maxRotation = 10;
      const rx = -dy * maxRotation;
      const ry = dx * maxRotation;
      
      // Apply transforms
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      // Smooth reset back to 0
      card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
    
    // Set transitions to prevent instant snapping
    card.style.transition = 'transform 0.15s ease-out, border-color var(--transition-speed) var(--transition-bezier), box-shadow var(--transition-speed) var(--transition-bezier)';
  });
}

/* =========================================================================
   4. Terminal Emulator Animation (Logic Mode Code Block Typing)
   ========================================================================= */
const terminalData = `{
  <span class="prop">"name"</span>: <span class="val">"Maheshwar Kadbane"</span>,
  <span class="prop">"education"</span>: <span class="val">"PCCOE B.Tech Comp Eng"</span>,
  <span class="prop">"status"</span>: <span class="val">"AI Intern @ SmartGenie"</span>,
  <span class="prop">"certifications"</span>: [
    <span class="val">"Claude Certified Architect"</span>,
    <span class="val">"Microsoft Certified AI"</span>
  ],
  <span class="prop">"focus_areas"</span>: [
    <span class="val">"Generative AI"</span>,
    <span class="val">"Reinforcement Learning"</span>
  ]
}`;

let typingTimer = null;

function initTerminalEmulator() {
  triggerTerminalTyping();
}

function triggerTerminalTyping() {
  const terminalOut = document.getElementById('terminal-stats');
  if (!terminalOut) return;
  
  // Clear any existing typing interval
  if (typingTimer) {
    clearInterval(typingTimer);
    typingTimer = null;
  }
  
  terminalOut.innerHTML = '';
  
  // Parse the terminal string to character tokens (supporting HTML span elements)
  const tokens = [];
  let i = 0;
  while (i < terminalData.length) {
    if (terminalData[i] === '<') {
      const closingIdx = terminalData.indexOf('>', i);
      if (closingIdx !== -1) {
        tokens.push(terminalData.substring(i, closingIdx + 1));
        i = closingIdx + 1;
        continue;
      }
    }
    tokens.push(terminalData[i]);
    i++;
  }
  
  let tokenIndex = 0;
  typingTimer = setInterval(() => {
    if (tokenIndex < tokens.length) {
      terminalOut.innerHTML += tokens[tokenIndex];
      tokenIndex++;
      
      // Auto-scroll terminal inside viewport
      const parent = terminalOut.parentElement;
      if (parent) {
        parent.scrollTop = parent.scrollHeight;
      }
    } else {
      clearInterval(typingTimer);
      typingTimer = null;
    }
  }, 15); // standard speed
}

/* =========================================================================
   5. Mobile Navigation Overlay Toggle
   ========================================================================= */
function initMobileNav() {
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link');
  
  if (!menuBtn || !navLinks) return;
  
  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    menuBtn.classList.toggle('active');
    
    // Animate burger bars
    const bars = menuBtn.querySelectorAll('.bar');
    if (navLinks.classList.contains('open')) {
      bars[0].style.transform = 'rotate(-45deg) translate(-5px, 5px)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'rotate(45deg) translate(-5px, -5px)';
    } else {
      bars[0].style.transform = 'none';
      bars[1].style.opacity = '1';
      bars[2].style.transform = 'none';
    }
  });
  
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuBtn.classList.remove('active');
      const bars = menuBtn.querySelectorAll('.bar');
      bars[0].style.transform = 'none';
      bars[1].style.opacity = '1';
      bars[2].style.transform = 'none';
      
      // Update active nav class
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
  
  // Highlight navigation item on scroll port triggers
  window.addEventListener('scroll', () => {
    let currentSection = '';
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 150;
    
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = sec.getAttribute('id');
      }
    });
    
    if (currentSection) {
      links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* =========================================================================
   6. Contact Form Mock Sender & Status Alert
   ========================================================================= */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusDiv = document.getElementById('form-status');
  
  if (!form || !statusDiv) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const originalText = btnText.textContent;
    
    // Trigger loading state
    submitBtn.disabled = true;
    btnText.textContent = 'Transmitting...';
    statusDiv.className = 'form-status';
    statusDiv.textContent = '';
    
    setTimeout(() => {
      // Simulate successful mail send