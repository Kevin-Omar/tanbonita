const canvas = document.getElementById('starsCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
let shootingStars = [];

function createStars(num) {
  stars = [];
  for (let i = 0; i < num; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() < 0.2 ? Math.random() * 2 + 1.5 : Math.random() * 1 + 0.3,
      speed: Math.random() * 0.2 + 0.05,
      opacity: 0,
      fadeIn: true,
      life: Math.random() * 300 + 200
    });
  }
}

function createShootingStar() {
  shootingStars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height / 2,
    length: Math.random() * 80 + 100,
    speed: Math.random() * 10 + 6,
    angle: Math.PI / 4
  });
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach(star => {
    if (star.fadeIn) {
      star.opacity += 0.005;
      if (star.opacity >= 1) {
        star.fadeIn = false;
      }
    } else {
      star.opacity -= 0.002;
    }

    star.life -= 1;
    if (star.life <= 0 || star.opacity <= 0) {
      star.x = Math.random() * canvas.width;
      star.y = Math.random() * canvas.height;
      star.radius = Math.random() < 0.2 ? Math.random() * 2 + 1.5 : Math.random() * 1 + 0.3;
      star.speed = Math.random() * 0.2 + 0.05;
      star.opacity = 0;
      star.fadeIn = true;
      star.life = Math.random() * 300 + 200;
    }

    ctx.shadowBlur = star.radius > 1.5 ? 15 : 5;
    ctx.shadowColor = "white";
    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();

    star.y += star.speed;
  });

  shootingStars.forEach((s, i) => {
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(
      s.x - Math.cos(s.angle) * s.length,
      s.y - Math.sin(s.angle) * s.length
    );
    ctx.stroke();

    s.x += s.speed;
    s.y += s.speed;

    if (s.x > canvas.width || s.y > canvas.height) {
      shootingStars.splice(i, 1);
    }
  });

  requestAnimationFrame(drawStars);
}

// Inicializar estrellas
createStars(300);
drawStars();
setInterval(createShootingStar, 4000);

// Elementos del DOM
const startBtn = document.getElementById('startBtn');
const mainText = document.getElementById('mainText');
const secondText = document.getElementById('secondText');
const waitText = document.getElementById('waitText');
const bgMusic = document.getElementById('bgMusic');
const poemText = document.getElementById('poemText');
// Evento de clic
startBtn.addEventListener('click', () => {
  // Ocultar el botón
  startBtn.style.transition = "opacity 0.8s ease";
  startBtn.style.opacity = 0;

  // Iniciar música desde el segundo 9
  bgMusic.currentTime = 9;
  bgMusic.play().catch(e => {
    console.warn("No se pudo reproducir el audio automáticamente:", e);
  });

  // Mostrar el primer texto
  setTimeout(() => {
    startBtn.style.display = "none";
    typeWriterText("NO TE VI, PERO SÉ QUE HOY ESTUVISTE TAN BONITA :D", mainText);
  }, 900);

  // Mostrar segundo texto a los 12 segundos
  setTimeout(() => {
    typeWriterText("QUE LE DA CELOS AL CIELO", secondText);
  },  (12 - 6) * 1000);

  // Mostrar "Espera..." 4 segundos después del segundo texto (en el segundo 16)
  setTimeout(() => {
    waitText.style.display = "block";
    waitText.classList.add("slide-up");
  }, (18 - 6) * 1000);
  setTimeout(() => {
  poemText.classList.add("slide-up");
}, (22 - 6) * 1000); // 21s desde el clic (16s + 5s)
setTimeout(() => {
  // Oculta todo el contenido anterior
  mainText.style.display = "none";
  secondText.style.display = "none";
  waitText.style.display = "none";
  poemText.style.display = "none";

  // Centra el mensaje final
  finalMessage.classList.add("slide-up");

  // Opcional: centrar verticalmente solo el mensaje
  const content = document.querySelector(".content");
  content.style.top = "50%";
  content.style.transform = "translate(-50%, -50%)";
}, (45 - 6) * 1000); // En el segundo 22 + 6 = 28

});

// Efecto máquina de escribir
function typeWriterText(text, element) {
  element.textContent = "";
  element.style.width = "0";
  element.style.borderRight = "2px solid white";
  let i = 0;
  let interval = setInterval(() => {
    element.textContent += text.charAt(i);
    i++;
    if (i === text.length) {
      clearInterval(interval);
      element.style.borderRight = "none";
    }
  }, 50);
}
