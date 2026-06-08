/* =============================================
   MegaPrint — utils.js
   Shared utility functions
   ============================================= */

// ── Toast Notifications ──
const Toast = (() => {
  let container = null;

  function getContainer() {
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  const icons = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  };

  function show(message, type = 'info', duration = 4000) {
    const c = getContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-msg">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;
    c.appendChild(toast);

    if (duration > 0) {
      setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }
    return toast;
  }

  return {
    success: (msg, duration) => show(msg, 'success', duration),
    error: (msg, duration) => show(msg, 'error', duration),
    warning: (msg, duration) => show(msg, 'warning', duration),
    info: (msg, duration) => show(msg, 'info', duration),
  };
})();

// ── Skeleton Loader ──
const Skeleton = {
  card: () => `
    <div class="card" style="padding:0;">
      <div class="skeleton" style="aspect-ratio:4/3;border-radius:var(--radius-lg) var(--radius-lg) 0 0;"></div>
      <div style="padding:1.25rem;display:flex;flex-direction:column;gap:0.6rem;">
        <div class="skeleton" style="height:18px;width:70%;border-radius:4px;"></div>
        <div class="skeleton" style="height:14px;width:90%;border-radius:4px;"></div>
        <div class="skeleton" style="height:14px;width:60%;border-radius:4px;"></div>
        <div class="skeleton" style="height:36px;width:40%;border-radius:20px;margin-top:0.5rem;"></div>
      </div>
    </div>
  `,
  testimonial: () => `
    <div class="card" style="padding:1.5rem;">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;">
        <div class="skeleton" style="width:50px;height:50px;border-radius:50%;flex-shrink:0;"></div>
        <div style="flex:1;display:flex;flex-direction:column;gap:0.4rem;">
          <div class="skeleton" style="height:16px;width:60%;border-radius:4px;"></div>
          <div class="skeleton" style="height:12px;width:40%;border-radius:4px;"></div>
        </div>
      </div>
      <div class="skeleton" style="height:12px;width:100%;border-radius:4px;margin-bottom:0.4rem;"></div>
      <div class="skeleton" style="height:12px;width:85%;border-radius:4px;"></div>
    </div>
  `,
  row: () => `
    <tr>
      <td><div class="skeleton" style="width:48px;height:48px;border-radius:6px;"></div></td>
      <td><div class="skeleton" style="height:14px;width:80%;border-radius:4px;"></div></td>
      <td><div class="skeleton" style="height:14px;width:60%;border-radius:4px;"></div></td>
      <td><div class="skeleton" style="height:24px;width:70px;border-radius:20px;"></div></td>
      <td><div style="display:flex;gap:0.4rem;">
        <div class="skeleton" style="width:32px;height:32px;border-radius:6px;"></div>
        <div class="skeleton" style="width:32px;height:32px;border-radius:6px;"></div>
      </div></td>
    </tr>
  `,
  renderCards: (container, count = 6) => {
    if (!container) return;
    container.innerHTML = Array(count).fill(Skeleton.card()).join('');
  },
};

// ── Scroll Reveal ──
const ScrollReveal = (() => {
  let observer = null;

  function init() {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      observer.observe(el);
    });
  }

  function observe(el) {
    if (observer && el) observer.observe(el);
  }

  return { init, observe };
})();

// ── Lightbox ──
const Lightbox = (() => {
  let images = [];
  let currentIndex = 0;
  let overlay = null;
  let img = null;

  function build() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <div class="lightbox-inner">
        <button class="lightbox-close" id="lb-close">✕</button>
        <button class="lightbox-btn" id="lb-prev">&#8249;</button>
        <img class="lightbox-img" id="lb-img" src="" alt="Imagen">
        <button class="lightbox-btn" id="lb-next">&#8250;</button>
      </div>
    `;
    document.body.appendChild(overlay);

    img = overlay.querySelector('#lb-img');
    overlay.querySelector('#lb-close').addEventListener('click', close);
    overlay.querySelector('#lb-prev').addEventListener('click', () => navigate(-1));
    overlay.querySelector('#lb-next').addEventListener('click', () => navigate(1));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', handleKey);
  }

  function handleKey(e) {
    if (!overlay?.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  }

  function open(imgList, index = 0) {
    build();
    images = imgList;
    currentIndex = index;
    show();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function show() {
    img.src = images[currentIndex];
    img.alt = `Imagen ${currentIndex + 1} de ${images.length}`;
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + images.length) % images.length;
    img.style.opacity = 0;
    setTimeout(() => { show(); img.style.opacity = 1; }, 150);
    img.style.transition = 'opacity 0.15s';
  }

  function close() {
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  return { open, close };
})();

// ── Stars Rating Render ──
function renderStars(rating, max = 5) {
  return Array.from({ length: max }, (_, i) =>
    `<span class="star ${i < rating ? '' : 'empty'}">★</span>`
  ).join('');
}

// ── Pagination ──
function renderPagination(container, currentPage, lastPage, onPageChange) {
  if (!container || lastPage <= 1) {
    if (container) container.innerHTML = '';
    return;
  }

  const pages = [];
  const range = 2;
  for (let i = 1; i <= lastPage; i++) {
    if (i === 1 || i === lastPage || (i >= currentPage - range && i <= currentPage + range)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  container.innerHTML = `
    <button class="page-btn" ${currentPage <= 1 ? 'disabled' : ''} data-page="${currentPage - 1}">&#8249;</button>
    ${pages.map(p => p === '...'
      ? `<span class="page-btn" style="cursor:default;">...</span>`
      : `<button class="page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`
    ).join('')}
    <button class="page-btn" ${currentPage >= lastPage ? 'disabled' : ''} data-page="${currentPage + 1}">&#8250;</button>
  `;

  container.querySelectorAll('.page-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = parseInt(btn.dataset.page);
      if (p && p !== currentPage) onPageChange(p);
    });
  });
}

// ── Format Date ──
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ── Truncate Text ──
function truncate(str, n = 100) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n).trim() + '…' : str;
}

// ── Debounce ──
function debounce(fn, delay = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

// ── WhatsApp Link ──
function whatsappLink(message = '', phone = '59177712345') {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

// ── Modal ──
const Modal = {
  open: (id) => {
    const m = document.getElementById(id);
    if (m) { m.classList.add('active'); document.body.style.overflow = 'hidden'; }
  },
  close: (id) => {
    const m = document.getElementById(id);
    if (m) { m.classList.remove('active'); document.body.style.overflow = ''; }
  },
  closeAll: () => {
    document.querySelectorAll('.modal-overlay.active').forEach(m => {
      m.classList.remove('active');
    });
    document.body.style.overflow = '';
  },
};

// ── Form Validation ──
function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const err = form.querySelector(`[data-error="${field.name}"]`);
    if (!field.value.trim()) {
      field.classList.add('error');
      if (err) err.textContent = 'Este campo es requerido';
      valid = false;
    } else {
      field.classList.remove('error');
      if (err) err.textContent = '';
    }
  });
  return valid;
}

// ── Particles Generator ──
function generateParticles(container, count = 20) {
  const colors = ['#fbbf24', '#e91e8c', '#ff2d9b', '#fde047'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 4 + 2}px;
      height: ${Math.random() * 4 + 2}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${Math.random() * 0.6 + 0.2};
    `;
    container.appendChild(p);
  }
}

// ── Image Preview ──
function setupImagePreview(inputEl, previewEl) {
  if (!inputEl || !previewEl) return;
  inputEl.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    previewEl.innerHTML = '';
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = document.createElement('img');
        img.src = ev.target.result;
        img.className = 'table-img';
        img.style.width = '80px';
        img.style.height = '80px';
        previewEl.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  });
}

// ── Export globals ──
window.Toast = Toast;
window.Skeleton = Skeleton;
window.ScrollReveal = ScrollReveal;
window.Lightbox = Lightbox;
window.Modal = Modal;
window.renderStars = renderStars;
window.renderPagination = renderPagination;
window.formatDate = formatDate;
window.truncate = truncate;
window.debounce = debounce;
window.whatsappLink = whatsappLink;
window.validateForm = validateForm;
window.generateParticles = generateParticles;
window.setupImagePreview = setupImagePreview;
