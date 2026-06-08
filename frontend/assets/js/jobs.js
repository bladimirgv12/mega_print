/* =============================================
   MegaPrint — jobs.js
   ============================================= */

const Jobs = (() => {
  let currentPage = 1;
  let currentCategory = '';

  function renderCard(job) {
    const img = API.getImageUrl(job.images?.[0]?.path || job.image);
    const allImages = (job.images || []).map(i => API.getImageUrl(i.path));
    const imagesJson = JSON.stringify(allImages).replace(/"/g, '&quot;');

    return `
      <div class="card reveal" style="cursor:pointer;">
        <div class="img-overlay" style="border-radius:var(--radius-lg) var(--radius-lg) 0 0;overflow:hidden;aspect-ratio:4/3;"
             onclick="Lightbox.open(${imagesJson.replace(/'/g, '&#39;')}, 0)">
          <img src="${img}" alt="${job.title}" style="width:100%;height:100%;object-fit:cover;transition:transform .5s ease;"
               onerror="this.src='assets/images/placeholder.jpg'" loading="lazy">
          <div class="overlay-icon">
            <svg width="22" height="22" fill="white" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          </div>
          ${(allImages.length > 1) ? `<span class="badge badge-yellow" style="position:absolute;top:.75rem;right:.75rem;">+${allImages.length} fotos</span>` : ''}
        </div>
        <div class="card-body">
          ${job.category ? `<span class="badge badge-fuchsia" style="margin-bottom:.5rem;">${job.category.name}</span>` : ''}
          <h3 class="card-title">${job.title}</h3>
          <p class="card-text">${truncate(job.description, 90)}</p>
          <div style="margin-top:.75rem;display:flex;align-items:center;gap:1rem;font-size:.8rem;color:var(--color-white-muted);">
            ${job.location ? `<span>📍 ${job.location}</span>` : ''}
            ${job.date ? `<span>📅 ${formatDate(job.date)}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  async function load(page = 1) {
    const grid = document.getElementById('jobs-grid');
    const paginationEl = document.getElementById('jobs-pagination');
    if (!grid) return;

    Skeleton.renderCards(grid, 6);
    try {
      const params = { page, per_page: 9 };
      if (currentCategory) params.category_id = currentCategory;
      const res = await API.Jobs.getAll(params);
      const jobs = res.data || [];
      const meta = res.meta || {};

      if (jobs.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:4rem 0;">
          <p style="font-size:3rem;margin-bottom:1rem;">🎨</p>
          <h3>Sin trabajos en esta categoría</h3>
        </div>`;
      } else {
        grid.innerHTML = jobs.map(renderCard).join('');
        grid.querySelectorAll('.reveal').forEach(el => ScrollReveal.observe(el));
      }

      renderPagination(paginationEl, meta.current_page || page, meta.last_page || 1, (p) => {
        currentPage = p;
        load(p);
      });
      currentPage = page;
    } catch (err) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;">
        <p style="color:#ef4444;">${err.message}</p>
        <button class="btn btn-outline-yellow" style="margin-top:1rem;" onclick="Jobs.load()">Reintentar</button>
      </div>`;
    }
  }

  async function loadCategories() {
    const chipsEl = document.getElementById('jobs-category-chips');
    if (!chipsEl) return;
    try {
      const res = await API.Categories.getAll();
      const cats = res.data || res;
      chipsEl.innerHTML = `
        <button class="filter-chip active" data-id="">Todos</button>
        ${cats.map(c => `<button class="filter-chip" data-id="${c.id}">${c.name}</button>`).join('')}
      `;
      chipsEl.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          chipsEl.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          currentCategory = chip.dataset.id;
          load(1);
        });
      });
    } catch (err) { console.warn('Sin categorías:', err.message); }
  }

  async function loadFeatured(containerId, limit = 4) {
    const container = document.getElementById(containerId);
    if (!container) return;
    Skeleton.renderCards(container, limit);
    try {
      const res = await API.Jobs.getAll({ per_page: limit });
      const jobs = res.data || [];
      container.innerHTML = jobs.length ? jobs.map(renderCard).join('') :
        '<p style="color:var(--color-white-muted);text-align:center;grid-column:1/-1;">Próximamente...</p>';
      container.querySelectorAll('.reveal').forEach(el => ScrollReveal.observe(el));
    } catch (err) {
      container.innerHTML = `<p style="color:var(--color-white-muted);text-align:center;grid-column:1/-1;">No se pudo cargar.</p>`;
    }
  }

  function init() {
    loadCategories();
    load(1);
  }

  return { init, load, loadFeatured, renderCard };
})();

window.Jobs = Jobs;
