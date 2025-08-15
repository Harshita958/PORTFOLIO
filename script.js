// ===== Helpers =====
const qs = (s, o = document) => o.querySelector(s);
const qsa = (s, o = document) => [...o.querySelectorAll(s)];

// ===== Custom Cursor =====
const cursorOuter = qs('.cursor--outer');
const cursorInner = qs('.cursor--inner');
let mouseX = 0, mouseY = 0, outerX = 0, outerY = 0;

// Track pointer
window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorInner.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
});

// Smooth follow for outer ring
const lerp = (a, b, n) => (1 - n) * a + n * b;
function render() {
  outerX = lerp(outerX, mouseX, 0.18);
  outerY = lerp(outerY, mouseY, 0.18);
  cursorOuter.style.transform = `translate(${outerX}px, ${outerY}px) translate(-50%, -50%)`;
  requestAnimationFrame(render);
}
render();

// Enlarge ring on interactive elements
const interactive = 'a, button, .btn, .chip, .card, input, textarea, .hamburger';
qsa(interactive).forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorOuter.style.width = '56px';
    cursorOuter.style.height = '56px';
    cursorOuter.style.borderWidth = '2px';
  });
  el.addEventListener('mouseleave', () => {
    cursorOuter.style.width = '36px';
    cursorOuter.style.height = '36px';
    cursorOuter.style.borderWidth = '1px';
  });
});

// ===== Mobile Menu =====
const burger = qs('.hamburger');
const mobileMenu = qs('.mobile-menu');
burger?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  mobileMenu.style.display = mobileMenu.classList.contains('open') ? 'flex' : 'none';
});

// ===== Magnetic Effect =====
function makeMagnetic(el, strength = 0.3) {
  const rect = () => el.getBoundingClientRect();
  let isHover = false;

  function onMove(e) {
    if (!isHover) return;
    const r = rect();
    const relX = e.clientX - (r.left + r.width / 2);
    const relY = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`;
  }

  function reset() {
    el.style.transform = 'translate(0,0)';
  }

  el.addEventListener('mouseenter', () => { isHover = true; });
  el.addEventListener('mousemove', onMove);
  el.addEventListener('mouseleave', () => { isHover = false; reset(); });
}

qsa('.magnetic').forEach(el => {
  const s = parseFloat(el.dataset.strength || '0.3');
  makeMagnetic(el, s);
});

// ===== Parallax (simple, pointer-based) =====
qsa('.parallax').forEach(el => {
  const depth = parseFloat(el.dataset.depth || '0.1');
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    el.style.transform = `translate(${x * depth * 20}px, ${y * depth * 20}px)`;
  });
});

// ===== GSAP Scroll Animations =====
gsap.registerPlugin(ScrollTrigger);

// Reveal on scroll
qsa('.reveal').forEach((el, i) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: 'power3.out',
    delay: i * 0.05,
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
    }
  });
});

// Hero lines stagger
gsap.from('.hero-title .line', {
  yPercent: 120,
  opacity: 0,
  duration: 1.1,
  ease: 'power4.out',
  stagger: 0.08
});

gsap.from('.hero-sub', { opacity: 0, y: 16, duration: 0.8, delay: 0.2, ease: 'power2.out' });
gsap.from('.hero-cta .btn', { opacity: 0, y: 14, duration: 0.7, delay: 0.35, ease: 'power2.out', stagger: 0.08 });

// Slight float on hero photo card
gsap.to('.photo-card', { y: -8, duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut' });

// Cards hover lift
qsa('.card').forEach(card => {
  card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-6px)');
  card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');
});

// Footer year
qs('#year').textContent = new Date().getFullYear();

// ===== NEW: Contact Page Background Blur Animation =====
gsap.fromTo(".contact-form", 
  { backdropFilter: "blur(0px)", opacity: 0, y: 40 }, 
  { backdropFilter: "blur(6px)", opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
    scrollTrigger: {
      trigger: ".contact-form",
      start: "top 85%",
    }
  }
);

// ===== NEW: Smooth Scrolling Portfolio Cards =====
gsap.from(".portfolio .card", {
  opacity: 0,
  y: 40,
  duration: 1,
  ease: "power2.out",
  stagger: 0.15,
  scrollTrigger: {
    trigger: ".portfolio",
    start: "top 85%",
  }
});

/* ===== Smooth Portfolio Section Scroll Animations ===== */
qsa('.portfolio-item').forEach((item, i) => {
  gsap.from(item, {
    opacity: 0,
    y: 60,
    duration: 1.3,
    ease: 'power4.out',
    delay: i * 0.2,
    scrollTrigger: {
      trigger: item,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });

  // Smooth zoom-in effect for portfolio images
  const img = qs('img', item);
  if (img) {
    gsap.from(img, {
      scale: 1.15,
      duration: 1.8,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: img,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  }
});

