// Año dinámico en el footer
document.getElementById('year').textContent = new Date().getFullYear();

// Respeta Reducir movimiento, pero permite una activación explícita.
const motionToggle = document.getElementById('motionToggle');
const savedMotionPreference = localStorage.getItem('motion-enabled');
let motionEnabled = savedMotionPreference !== 'false';

function updateMotionPreference() {
  document.documentElement.classList.toggle('motion-reduced', !motionEnabled);
  motionToggle.setAttribute('aria-pressed', motionEnabled);
  motionToggle.setAttribute('aria-label', motionEnabled ? 'Desactivar animaciones' : 'Activar animaciones');
}

motionToggle.addEventListener('click', () => {
  motionEnabled = !motionEnabled;
  localStorage.setItem('motion-enabled', motionEnabled);
  updateMotionPreference();
  window.location.reload();
});
updateMotionPreference();

// Evita que la foto se seleccione, arrastre o se abra desde el menú contextual.
const profilePhoto = document.querySelector('.frame-photo');
profilePhoto.addEventListener('dragstart', event => event.preventDefault());
profilePhoto.addEventListener('contextmenu', event => event.preventDefault());

// Menú móvil
const burger = document.getElementById('burgerBtn');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', isOpen);
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

// Animaciones avanzadas con GSAP cuando la librería está disponible
if (window.gsap && motionEnabled) {
  const gsap = window.gsap;

  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero .tag', { opacity: 0, y: 18, duration: .55 })
    .from('.hero h1', { opacity: 0, y: 28, duration: .75 }, '-=.25')
    .from('.hero .role, .hero .lead', { opacity: 0, y: 18, duration: .55, stagger: .08 }, '-=.35')
    .from('.hero-cta, .hero-meta', { opacity: 0, y: 16, duration: .5 }, '-=.25');

  gsap.to('.hero', {
    backgroundPosition: '100% 50%, 0% 100%',
    duration: 12,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
  });

  gsap.to('.frame-wrap', {
    y: -10,
    rotation: .6,
    duration: 3.2,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
  });

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -10, duration: .3, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0, duration: .45, ease: 'power2.out' });
    });
  });
}

// Reveal on scroll (una sola vez por elemento)
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// Animación de las barras de habilidades + contador numérico
const gauges = document.querySelectorAll('.gauge-fill');
const gaugeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const fill = entry.target;
      const target = parseInt(fill.dataset.target, 10);
      fill.style.width = target + '%';

      const counterEl = fill.closest('.skill-row').querySelector('.counter');
      let current = 0;
      const duration = 1100;
      const start = performance.now();
      function step(now){
        const progress = Math.min((now - start) / duration, 1);
        current = Math.round(progress * target);
        counterEl.textContent = current;
        if(progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);

      gaugeObserver.unobserve(fill);
    }
  });
}, { threshold: 0.4 });
gauges.forEach(g => gaugeObserver.observe(g));
