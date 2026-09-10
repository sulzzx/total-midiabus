/* =========================================================
   Total MidiaBus — Scripts
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header: shrink + shadow on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const onScrollHeader = () => {
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Active nav link on scroll (IntersectionObserver) ---------- */
  const sections = document.querySelectorAll('main section[id], main#top');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  document.querySelectorAll('section[id]').forEach(sec => sectionObserver.observe(sec));

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated counters (hero stats) ---------- */
  const counters = document.querySelectorAll('.hero-stats strong');
  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-count')) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  };

  const statsObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(el => statsObserver.observe(el));

  /* ---------- Back to top button ---------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });

  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- WhatsApp floating button ---------- */
  const whatsappBtn = document.getElementById('whatsappBtn');
  whatsappBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const phone = '5511000000000'; // TODO: substituir pelo número real da empresa
    const message = encodeURIComponent('Olá! Gostaria de saber mais sobre a plotagem de ônibus da Total MidiaBus.');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank', 'noopener');
  });

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  const validators = {
    name: (v) => v.trim().length >= 2 || 'Informe seu nome completo.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Informe um e-mail válido.',
    phone: (v) => v.trim().replace(/\D/g, '').length >= 10 || 'Informe um telefone válido com DDD.',
    message: (v) => v.trim().length >= 10 || 'Conte um pouco mais sobre sua marca (mín. 10 caracteres).',
  };

  const showFieldError = (field, msg) => {
    const wrapper = field.closest('.form-field');
    const errorEl = wrapper.querySelector('.error-msg');
    if (msg) {
      wrapper.classList.add('invalid');
      if (errorEl) errorEl.textContent = msg;
    } else {
      wrapper.classList.remove('invalid');
      if (errorEl) errorEl.textContent = '';
    }
  };

  const validateField = (field) => {
    const rule = validators[field.name];
    if (!rule) return true;
    const result = rule(field.value);
    if (result === true) {
      showFieldError(field, '');
      return true;
    }
    showFieldError(field, result);
    return false;
  };

  ['name', 'email', 'phone', 'message'].forEach(fieldName => {
    const field = form.elements[fieldName];
    if (field) {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.closest('.form-field').classList.contains('invalid')) validateField(field);
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMsg.classList.remove('show');

    let isValid = true;
    ['name', 'email', 'phone', 'message'].forEach(fieldName => {
      const field = form.elements[fieldName];
      if (field && !validateField(field)) isValid = false;
    });

    if (!isValid) {
      const firstInvalid = form.querySelector('.form-field.invalid input, .form-field.invalid textarea');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Sem backend configurado: aqui é onde uma integração real (API, e-mail, CRM) entraria.
    successMsg.classList.add('show');
    form.reset();

    setTimeout(() => {
      successMsg.classList.remove('show');
    }, 6000);
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
