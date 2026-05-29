/* =============================================
   MegaPrint — testimonials.js
   ============================================= */

const Testimonials = (() => {
  let sliderIndex = 0;
  let sliderItems = [];
  let autoTimer = null;

  function renderCard(t) {
    const img = t.photo ? API.getImageUrl(t.photo) : null;
    return `
      <div class="card" style="padding:1.75rem;flex-shrink:0;width:100%;">
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;">
          ${img
            ? `<img src="${img}" alt="${t.name}" style="width:52px;height:52px;border-radius:50%;object-fit:cover;border:2px solid var(--color-fuchsia);" onerror="this.style.display='none'">`
            : `<div style="width:52px;height:52px;border-radius:50%;background:var(--gradient-accent);display:flex;align-items:center;justify-content:center;font-size:1.3rem;font-weight:700;flex-shrink:0;">${t.name[0]}</div>`
          }
          <div>
            <p style="font-weight:700;margin-bottom:.15rem;">${t.name}</p>
            ${t.product ? `<p style="font-size:.78rem;color:var(--color-yellow);">${t.product}</p>` : ''}
            <div class="stars" style="margin-top:.2rem;">${renderStars(t.rating || 5)}</div>
          </div>
        </div>
        <p style="color:var(--color-white-muted);font-size:.9rem;line-height:1.7;font-style:italic;">"${t.comment}"</p>
        <p style="font-size:.75rem;color:rgba(255,255,255,.25);margin-top:.75rem;">${formatDate(t.created_at)}</p>
      </div>
    `;
  }

  // ── Slider ──
  function initSlider(items, trackId, dotsId) {
    const track = document.getElementById(trackId);
    const dotsContainer = document.getElementById(dotsId);
    if (!track || items.length === 0) return;

    sliderItems = items;
    sliderIndex = 0;

    track.innerHTML = items.map(renderCard).join('');

    // Dots
    if (dotsContainer) {
      dotsContainer.innerHTML = items.map((_, i) =>
        `<button class="slider-dot ${i === 0 ? 'active' : ''}" data-i="${i}"></button>`
      ).join('');
      dotsContainer.querySelectorAll('.slider-dot').forEach(dot => {
        dot.addEventListener('click', () => goTo(parseInt(dot.dataset.i), trackId, dotsId));
      });
    }

    startAuto(trackId, dotsId);
  }

  function goTo(index, trackId, dotsId) {
    const track = document.getElementById(trackId);
    const dotsContainer = document.getElementById(dotsId);
    if (!track) return;
    sliderIndex = (index + sliderItems.length) % sliderItems.length;
    track.style.transform = `translateX(-${sliderIndex * 100}%)`;
    dotsContainer?.querySelectorAll('.slider-dot').forEach((d, i) =>
      d.classList.toggle('active', i === sliderIndex)
    );
  }

  function startAuto(trackId, dotsId) {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(sliderIndex + 1, trackId, dotsId), 4500);
  }

  // ── Load for index.html (slider) ──
  async function loadSlider() {
    const track = document.getElementById('testimonials-track');
    if (!track) return;
    track.innerHTML = `<div style="padding:2rem;text-align:center;width:100%;"><div class="spinner" style="margin:0 auto;"></div></div>`;
    try {
      const res = await API.Testimonials.getAll({ approved: 1, per_page: 8 });
      const items = res.data || [];
      if (!items.length) {
        track.innerHTML = '<p style="padding:2rem;text-align:center;color:var(--color-white-muted);">Sin testimonios aún.</p>';
        return;
      }
      initSlider(items, 'testimonials-track', 'testimonials-dots');

      // Arrow buttons
      document.getElementById('t-prev')?.addEventListener('click', () => {
        goTo(sliderIndex - 1, 'testimonials-track', 'testimonials-dots');
        startAuto('testimonials-track', 'testimonials-dots');
      });
      document.getElementById('t-next')?.addEventListener('click', () => {
        goTo(sliderIndex + 1, 'testimonials-track', 'testimonials-dots');
        startAuto('testimonials-track', 'testimonials-dots');
      });
    } catch (err) {
      track.innerHTML = `<p style="padding:2rem;text-align:center;color:var(--color-white-muted);">No se pudo cargar los testimonios.</p>`;
    }
  }

  // ── Load for testimonials.html (grid) ──
  async function loadGrid() {
    const grid = document.getElementById('testimonials-grid');
    if (!grid) return;
    grid.innerHTML = Array(4).fill(Skeleton.testimonial()).join('');
    try {
      const res = await API.Testimonials.getAll({ approved: 1 });
      const items = res.data || [];
      if (!items.length) {
        grid.innerHTML = '<p style="text-align:center;color:var(--color-white-muted);grid-column:1/-1;padding:3rem;">Sin testimonios aún. ¡Sé el primero!</p>';
        return;
      }
      grid.innerHTML = items.map(t => `<div class="reveal">${renderCard(t)}</div>`).join('');
      grid.querySelectorAll('.reveal').forEach(el => ScrollReveal.observe(el));
    } catch (err) {
      grid.innerHTML = `<p style="color:#ef4444;text-align:center;grid-column:1/-1;">${err.message}</p>`;
    }
  }

  // ── Submit testimonial form ──
  function setupForm() {
    const form = document.getElementById('testimonial-form');
    if (!form) return;

    // Star rating
    const stars = form.querySelectorAll('.star-input');
    let selectedRating = 5;
    stars.forEach(star => {
      star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.value);
        stars.forEach((s, i) => s.classList.toggle('active', i < selectedRating));
      });
      star.addEventListener('mouseover', () => {
        stars.forEach((s, i) => s.classList.toggle('hover', i < parseInt(star.dataset.value)));
      });
      star.addEventListener('mouseleave', () => stars.forEach(s => s.classList.remove('hover')));
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm(form)) return;

      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Enviando...';

      const fd = new FormData(form);
      fd.append('rating', selectedRating);

      try {
        await API.Testimonials.create(fd);
        Toast.success('¡Gracias por tu testimonio! Será revisado pronto.');
        form.reset();
        stars.forEach(s => s.classList.remove('active'));
      } catch (err) {
        Toast.error(err.message);
      } finally {
        btn.disabled = false;
        btn.textContent = 'Enviar Testimonio';
      }
    });
  }

  return { loadSlider, loadGrid, setupForm };
})();

window.Testimonials = Testimonials;
