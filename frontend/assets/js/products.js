/* =============================================
   MegaPrint — products.js
   ============================================= */

const Products = (() => {
  let currentPage = 1;
  let currentCategory = '';
  let currentSearch = '';
  let isLoading = false;

  // ── Render Product Card ──
  function renderCard(p) {
    const img = API.getImageUrl(p.images?.[0]?.path || p.image);
    return `
      <div class="card reveal" style="cursor:pointer;" onclick="window.location.href='product-detail.html?id=${p.id}'">
        <div class="img-overlay" style="border-radius:var(--radius-lg) var(--radius-lg) 0 0; overflow:hidden;">
          <img class="card-img" src="${img}" alt="${p.name}"
               onerror="this.src='assets/images/placeholder.jpg'"
               loading="lazy">
          <div class="overlay-icon">
            <svg width="22" height="22" fill="white" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
        </div>
        <div class="card-body">
          ${p.category ? `<span class="badge badge-fuchsia" style="margin-bottom:.5rem;">${p.category.name}</span>` : ''}
          <h3 class="card-title">${p.name}</h3>
          <p class="card-text">${truncate(p.description, 90)}</p>
          ${p.price ? `<p style="color:var(--color-yellow);font-weight:700;margin-top:.5rem;">Desde Bs. ${p.price}</p>` : ''}
          <div style="margin-top:1rem;display:flex;gap:.5rem;align-items:center;">
            <a href="product-detail.html?id=${p.id}" class="btn btn-primary btn-sm" onclick="event.stopPropagation()">Ver más</a>
            <a href="https://wa.me/59177712345?text=${encodeURIComponent(`Hola! Me interesa cotizar: ${p.name}`)}"
               target="_blank" class="btn btn-outline btn-sm" onclick="event.stopPropagation()">
              Cotizar
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // ── Load Products ──
  async function load(page = 1) {
    if (isLoading) return;
    isLoading = true;

    const grid = document.getElementById('products-grid');
    const paginationEl = document.getElementById('products-pagination');
    const countEl = document.getElementById('products-count');

    if (!grid) return;

    // Show skeletons
    Skeleton.renderCards(grid, 6);

    try {
      const params = { page, per_page: 9 };
      if (currentCategory) params.category_id = currentCategory;
      if (currentSearch) params.search = currentSearch;

      const res = await API.Products.getAll(params);
      const products = res.data || [];
      const meta = res.meta || {};

      if (countEl) {
        countEl.textContent = `${meta.total || products.length} productos encontrados`;
      }

      if (products.length === 0) {
        grid.innerHTML = `
          <div style="grid-column:1/-1;text-align:center;padding:4rem 0;">
            <p style="font-size:3rem;margin-bottom:1rem;">🖨️</p>
            <h3 style="margin-bottom:.5rem;">No se encontraron productos</h3>
            <p style="color:var(--color-white-muted);">Intenta con otra búsqueda o categoría.</p>
          </div>
        `;
      } else {
        grid.innerHTML = products.map(renderCard).join('');
        // Observe new cards for scroll reveal
        grid.querySelectorAll('.reveal').forEach(el => ScrollReveal.observe(el));
      }

      renderPagination(paginationEl, meta.current_page || page, meta.last_page || 1, (p) => {
        currentPage = p;
        load(p);
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      currentPage = page;
    } catch (err) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:3rem;">
          <p style="color:#ef4444;">${err.message}</p>
          <button class="btn btn-outline-yellow" style="margin-top:1rem;" onclick="Products.load()">Reintentar</button>
        </div>
      `;
    } finally {
      isLoading = false;
    }
  }

  // ── Load Categories Filter ──
  async function loadCategories() {
    const chipsEl = document.getElementById('category-chips');
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
          currentPage = 1;
          load(1);
        });
      });
    } catch (err) {
      console.warn('No se pudieron cargar las categorías:', err.message);
    }
  }

  // ── Setup Search ──
  function setupSearch() {
    const input = document.getElementById('product-search');
    if (!input) return;
    const debouncedSearch = debounce((val) => {
      currentSearch = val;
      currentPage = 1;
      load(1);
    }, 400);
    input.addEventListener('input', (e) => debouncedSearch(e.target.value.trim()));
  }

  // ── Init (products.html) ──
  function init() {
    loadCategories();
    load(1);
    setupSearch();
  }

  // ── Load Featured (index.html) ──
  async function loadFeatured(containerId, limit = 6) {
    const container = document.getElementById(containerId);
    if (!container) return;
    Skeleton.renderCards(container, limit);
    try {
      const res = await API.Products.getAll({ per_page: limit, featured: 1 });
      const products = res.data || [];
      if (products.length === 0) {
        container.innerHTML = '<p style="color:var(--color-white-muted);text-align:center;grid-column:1/-1;">Próximamente...</p>';
        return;
      }
      container.innerHTML = products.map(renderCard).join('');
      container.querySelectorAll('.reveal').forEach(el => ScrollReveal.observe(el));
    } catch (err) {
      container.innerHTML = `<p style="color:var(--color-white-muted);text-align:center;grid-column:1/-1;">No se pudo cargar los productos.</p>`;
    }
  }

  return { init, load, loadFeatured, renderCard };
})();

window.Products = Products;
