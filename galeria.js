/* =========================================================
   Total MidiaBus — Galeria de fotos dos formatos (janela)
   ---------------------------------------------------------
   COMO ADICIONAR / TROCAR FOTOS
   1. Coloque as fotos em img/galeria/ (JPG, ~1600 px de largura, até ~300 KB).
   2. Escreva o caminho de cada foto na lista do formato, abaixo.
      - "src" é o caminho do arquivo; "legenda" é o texto embaixo da foto (pode ficar vazio '').
   3. Formato sem fotos na lista = o botão "Ver fotos" daquele card some sozinho.
   As fotos abaixo são só EXEMPLO (usam as imagens que já estão no site).
   ========================================================= */
const GALERIAS = {
  backbus: {
    titulo: 'BackBus',
    fotos: [
      { src: 'img/backbus1.JPEG', legenda: 'Traseira plotada — Ormimaq' },
      { src: 'img/backbus2.JPEG', legenda: 'Traseira plotada — Mart Minas' },
      { src: 'img/backbus3.JPEG', legenda: 'Traseira plotada — Ministério do Trabalho e Emprego' },
      { src: 'img/backbus4.JPEG', legenda: 'Traseira plotada — Mart Minas' },
      { src: 'img/backbus5.JPEG', legenda: 'Traseira plotada — Mart Minas' },
      { src: 'img/backbus6.JPEG', legenda: 'Traseira plotada — Unimed' },
      { src: 'img/backbus7.JPEG', legenda: 'Traseira plotada — Assembleia Legislativa de Minas Gerais' },
      { src: 'img/backbus8.JPEG', legenda: 'Traseira plotada — 94,5 FM' },
      { src: 'img/backbus9.JPEG', legenda: 'Traseira plotada — Afya' },
      { src: 'img/backbus10.JPEG', legenda: 'Traseira plotada — Yakan' },
      { src: 'img/backbus11.JPEG', legenda: 'Traseira plotada — Saudali' },
    ],
  },
  backseat: {
    titulo: 'BackSeat',
    fotos: [
      // { src: 'img/galeria/backseat-1.jpg', legenda: '' },
    ],
  },
  total: {
    titulo: 'Plotagem Total',
    fotos: [
      { src: 'img/convencional1.JPG', legenda: 'Convencional — ViaOuro' },
      { src: 'img/convencional2.JPG', legenda: 'Convencional — Mart Minas' },
      { src: 'img/convencional3.JPG', legenda: 'Convencional — Barbearia do Rapha' },
      { src: 'img/convencional4.JPG', legenda: 'Convencional — BH FM' },
      { src: 'img/convencional5.JPG', legenda: 'Convencional — Algar' },
      { src: 'img/convencional6.JPG', legenda: 'Convencional — Mart Minas' },
      { src: 'img/convencional7.JPG', legenda: 'Convencional — Aurora' },
    ],
  },
  articulado: {
    titulo: 'Envelopamento Articulado',
    fotos: [
      { src: 'img/articulado2.JPG', legenda: 'Articulado — Coca-Cola' },
      { src: 'img/onibus-3.jpg', legenda: 'Articulado — BIS' },
      { src: 'img/onibus-4.jpg', legenda: 'Articulado — Othon de Carvalho' },
      { src: 'img/articulado1.JPG', legenda: 'Articulado — Bulbe' },
      { src: 'img/articulado3.JPG', legenda: 'Articulado — Sesc' },
      { src: 'img/articulado4.JPG', legenda: 'Articulado — Skol Beats' },
      { src: 'img/articulado5.JPG', legenda: 'Articulado — Pachá' },
    ],
  },
};

(function () {
  const modal = document.getElementById('galleryModal');
  if (!modal) return;

  const titleEl = document.getElementById('galleryTitle');
  const imgEl = document.getElementById('galleryImg');
  const captionEl = document.getElementById('galleryCaption');
  const counterEl = document.getElementById('galleryCounter');
  const thumbsEl = document.getElementById('galleryThumbs');
  const prevBtn = modal.querySelector('.gallery-nav.prev');
  const nextBtn = modal.querySelector('.gallery-nav.next');
  const closeBtn = modal.querySelector('.gallery-close');
  const ctaBtn = modal.querySelector('.gallery-cta');
  const stage = modal.querySelector('.gallery-stage');

  let currentKey = null;
  let photos = [];
  let index = 0;
  let lastFocus = null;

  /* Esconde o botão "Ver fotos" dos formatos sem fotos */
  document.querySelectorAll('[data-gallery]').forEach((btn) => {
    const g = GALERIAS[btn.getAttribute('data-gallery')];
    if (!g || !g.fotos || g.fotos.length === 0) btn.hidden = true;
  });

  const show = (i) => {
    index = (i + photos.length) % photos.length;
    const p = photos[index];
    imgEl.src = p.src;
    imgEl.alt = p.legenda || `${titleEl.textContent} — foto ${index + 1}`;
    captionEl.textContent = p.legenda || '';
    counterEl.textContent = `${index + 1} / ${photos.length}`;
    thumbsEl.querySelectorAll('.gallery-thumb').forEach((t, n) => {
      t.classList.toggle('is-active', n === index);
      t.setAttribute('aria-current', n === index ? 'true' : 'false');
    });
    const active = thumbsEl.children[index];
    if (active && active.scrollIntoView) active.scrollIntoView({ block: 'nearest', inline: 'center' });
    // pré-carrega a próxima foto
    if (photos.length > 1) new Image().src = photos[(index + 1) % photos.length].src;
    const single = photos.length < 2;
    prevBtn.hidden = single; nextBtn.hidden = single; thumbsEl.hidden = single; counterEl.hidden = single;
  };

  const open = (key, opener) => {
    const g = GALERIAS[key];
    if (!g || !g.fotos.length) return;
    currentKey = key;
    photos = g.fotos;
    lastFocus = opener || document.activeElement;
    titleEl.textContent = g.titulo;

    thumbsEl.innerHTML = '';
    photos.forEach((p, n) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'gallery-thumb';
      b.setAttribute('aria-label', `Ver foto ${n + 1}`);
      const im = document.createElement('img');
      im.src = p.src; im.alt = ''; im.loading = 'lazy';
      b.appendChild(im);
      b.addEventListener('click', () => show(n));
      thumbsEl.appendChild(b);
    });

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => modal.classList.add('is-open'));
    show(0);
    closeBtn.focus();
  };

  const close = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { modal.hidden = true; imgEl.removeAttribute('src'); }, 220);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  document.querySelectorAll('[data-gallery]').forEach((btn) => {
    btn.addEventListener('click', () => open(btn.getAttribute('data-gallery'), btn));
  });

  modal.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', close));
  prevBtn.addEventListener('click', () => show(index - 1));
  nextBtn.addEventListener('click', () => show(index + 1));

  /* "Quero este formato": fecha a janela, já seleciona o formato no formulário e vai ao contato */
  ctaBtn.addEventListener('click', () => {
    const select = document.getElementById('format');
    if (select && currentKey && [...select.options].some((o) => o.value === currentKey)) {
      select.value = currentKey;
    }
    close();
  });

  /* Teclado: Esc fecha, setas trocam de foto, Tab fica dentro da janela */
  document.addEventListener('keydown', (e) => {
    if (modal.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft' && photos.length > 1) show(index - 1);
    else if (e.key === 'ArrowRight' && photos.length > 1) show(index + 1);
    else if (e.key === 'Tab') {
      const f = [...modal.querySelectorAll('button, a[href]')].filter((el) => !el.hidden && el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* Celular: arrastar para o lado troca de foto */
  let startX = null;
  stage.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (startX === null || photos.length < 2) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  }, { passive: true });
})();
