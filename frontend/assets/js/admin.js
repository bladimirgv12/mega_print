/* =============================================
   MegaPrint — admin.js
   Admin panel logic
   ============================================= */

const Admin = (() => {
  let currentSection = 'dashboard';

  // ── Auth Guard ──
  function checkAuth() {
    if (!API.Auth.isLoggedIn()) {
      showLogin();
      return false;
    }
    return true;
  }

  function showLogin() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-app').style.display = 'none';
  }

  function showApp() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-app').style.display = 'grid';
  }

  // ── Login ──
  async function handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Ingresando...';

    try {
      const res = await API.Auth.login({
        email: form.querySelector('[name="email"]').value,
        password: form.querySelector('[name="password"]').value,
      });
      API.Auth.setToken(res.token || res.data?.token);
      API.Auth.setUser(res.user || res.data?.user);
      showApp();
      loadDashboard();
    } catch (err) {
      Toast.error(err.message || 'Credenciales incorrectas');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Ingresar';
    }
  }

  // ── Dashboard ──
  async function loadDashboard() {
    setActiveSection('dashboard');
    const content = document.getElementById('admin-content');
    content.innerHTML = `
      <div class="admin-header">
        <h2 class="admin-title">Dashboard</h2>
      </div>
      <div class="stats-grid" id="stats-grid">
        ${[...Array(4)].map(() => `
          <div class="stat-card">
            <div class="skeleton" style="width:48px;height:48px;border-radius:var(--radius-md);"></div>
            <div style="display:flex;flex-direction:column;gap:.4rem;">
              <div class="skeleton" style="height:28px;width:60px;border-radius:4px;"></div>
              <div class="skeleton" style="height:14px;width:80px;border-radius:4px;"></div>
            </div>
          </div>`).join('')}
      </div>
      <p style="color:var(--color-white-muted);text-align:center;padding:2rem;">Bienvenido al panel de administración de MegaPrint.</p>
    `;

    try {
      const [products, jobs, testimonials, contacts] = await Promise.allSettled([
        API.Products.getAll({ per_page: 1 }),
        API.Jobs.getAll({ per_page: 1 }),
        API.Testimonials.getAll({ per_page: 1 }),
        API.Contacts.getAll({ per_page: 1 }),
      ]);

      const icons = {
        yellow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>`,
        fuchsia: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,
        green: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`,
        blue: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
      };

      const stats = [
        { label: 'Productos', value: products.value?.meta?.total || 0, icon: 'yellow' },
        { label: 'Trabajos', value: jobs.value?.meta?.total || 0, icon: 'fuchsia' },
        { label: 'Testimonios', value: testimonials.value?.meta?.total || 0, icon: 'green' },
        { label: 'Contactos', value: contacts.value?.meta?.total || 0, icon: 'blue' },
      ];

      document.getElementById('stats-grid').innerHTML = stats.map(s => `
        <div class="stat-card">
          <div class="stat-icon ${s.icon}">${icons[s.icon]}</div>
          <div>
            <div class="stat-number">${s.value}</div>
            <div class="stat-label">${s.label}</div>
          </div>
        </div>
      `).join('');
    } catch (err) { console.warn(err); }
  }

  // ── Products Section ──
  async function loadProducts() {
    setActiveSection('products');
    const content = document.getElementById('admin-content');
    content.innerHTML = `
      <div class="admin-header">
        <h2 class="admin-title">Productos</h2>
        <button class="btn btn-primary" onclick="Admin.openProductModal()">+ Nuevo Producto</button>
      </div>
      <div style="background:var(--color-black-card);border:1px solid var(--color-black-border);border-radius:var(--radius-lg);overflow:hidden;">
        <table class="data-table">
          <thead><tr>
            <th>Imagen</th><th>Nombre</th><th>Categoría</th><th>Estado</th><th>Acciones</th>
          </tr></thead>
          <tbody id="products-tbody">${[...Array(4)].map(() => Skeleton.row()).join('')}</tbody>
        </table>
      </div>
      <div id="prod-pagination" style="margin-top:1.5rem;"></div>
      ${productModal()}
    `;

    await loadProductsData(1);
    setupProductModal();
  }

  async function loadProductsData(page = 1) {
    const tbody = document.getElementById('products-tbody');
    if (!tbody) return;
    try {
      const res = await API.Products.getAll({ page, per_page: 10 });
      const items = res.data || [];
      if (!items.length) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--color-white-muted);">Sin productos aún.</td></tr>';
        return;
      }
      tbody.innerHTML = items.map(p => `
        <tr>
          <td><img class="table-img" src="${API.getImageUrl(p.images?.[0]?.path)}" alt="${p.name}" onerror="this.src='assets/images/placeholder.jpg'"></td>
          <td><strong>${p.name}</strong><br><small style="color:var(--color-white-muted);">${truncate(p.description, 50)}</small></td>
          <td><span class="badge badge-fuchsia">${p.category?.name || '—'}</span></td>
          <td><span class="badge ${p.is_active ? 'badge-green' : 'badge-yellow'}">${p.is_active ? 'Activo' : 'Inactivo'}</span></td>
          <td>
            <div class="action-btns">
              <button class="action-btn edit" onclick="Admin.editProduct(${p.id})" title="Editar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="action-btn delete" onclick="Admin.deleteProduct(${p.id},'${p.name}')" title="Eliminar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
      renderPagination(document.getElementById('prod-pagination'), res.meta?.current_page || page, res.meta?.last_page || 1, loadProductsData);
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="5" style="color:#ef4444;text-align:center;padding:2rem;">${err.message}</td></tr>`;
    }
  }

  function productModal() {
    return `
    <div class="modal-overlay" id="product-modal">
      <div class="modal" style="max-width:640px;">
        <div class="modal-header">
          <h3 class="modal-title" id="product-modal-title">Nuevo Producto</h3>
          <button class="modal-close" onclick="Modal.close('product-modal')">✕</button>
        </div>
        <form id="product-form">
          <input type="hidden" name="product_id" id="product_id">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
            <div class="form-group" style="grid-column:1/-1;">
              <label class="form-label">Nombre *</label>
              <input class="form-control" name="name" required placeholder="Ej: Manta Vinílica Premium">
            </div>
            <div class="form-group">
              <label class="form-label">Categoría</label>
              <select class="form-control" name="category_id" id="modal-cat-select">
                <option value="">Sin categoría</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Precio base (Bs.)</label>
              <input class="form-control" name="price" type="number" step="0.01" placeholder="0.00">
            </div>
            <div class="form-group" style="grid-column:1/-1;">
              <label class="form-label">Descripción *</label>
              <textarea class="form-control" name="description" required rows="3" placeholder="Descripción del producto..."></textarea>
            </div>
            <div class="form-group" style="grid-column:1/-1;">
              <label class="form-label">Materiales</label>
              <input class="form-control" name="materials" placeholder="Ej: Vinilo, Lona 440g">
            </div>
            <div class="form-group" style="grid-column:1/-1;">
              <label class="form-label">Imágenes</label>
              <input class="form-control" name="images[]" type="file" accept="image/*" multiple id="product-images-input">
              <div id="product-images-preview" style="display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.5rem;"></div>
            </div>
            <div class="form-group">
              <label style="display:flex;align-items:center;gap:.5rem;cursor:pointer;font-size:.875rem;">
                <input type="checkbox" name="is_active" value="1" checked style="accent-color:var(--color-fuchsia);">
                Producto activo
              </label>
            </div>
            <div class="form-group">
              <label style="display:flex;align-items:center;gap:.5rem;cursor:pointer;font-size:.875rem;">
                <input type="checkbox" name="is_featured" value="1" style="accent-color:var(--color-yellow);">
                Producto destacado
              </label>
            </div>
          </div>
          <div style="display:flex;gap:.75rem;justify-content:flex-end;margin-top:1rem;">
            <button type="button" class="btn btn-ghost" onclick="Modal.close('product-modal')">Cancelar</button>
            <button type="submit" class="btn btn-primary" id="product-submit-btn">Guardar Producto</button>
          </div>
        </form>
      </div>
    </div>`;
  }

  function setupProductModal() {
    setupImagePreview(
      document.getElementById('product-images-input'),
      document.getElementById('product-images-preview')
    );

    API.Categories.getAll().then(res => {
      const cats = res.data || res;
      const sel = document.getElementById('modal-cat-select');
      if (sel) sel.innerHTML += cats.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }).catch(() => {});

    document.getElementById('product-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const id = form.querySelector('[name="product_id"]').value;
      const btn = document.getElementById('product-submit-btn');
      btn.disabled = true; btn.textContent = 'Guardando...';

      const fd = new FormData(form);
      try {
        if (id) {
          await API.Products.update(id, fd);
          Toast.success('Producto actualizado.');
        } else {
          await API.Products.create(fd);
          Toast.success('Producto creado.');
        }
        Modal.close('product-modal');
        loadProductsData(1);
      } catch (err) {
        Toast.error(err.message);
      } finally {
        btn.disabled = false; btn.textContent = 'Guardar Producto';
      }
    });
  }

  async function openProductModal() {
    const form = document.getElementById('product-form');
    if (!form) { await loadProducts(); return; }
    form.reset();
    document.getElementById('product_id').value = '';
    document.getElementById('product-modal-title').textContent = 'Nuevo Producto';
    document.getElementById('product-images-preview').innerHTML = '';
    Modal.open('product-modal');
  }

  async function editProduct(id) {
    try {
      const res = await API.Products.getById(id);
      const p = res.data || res;
      const form = document.getElementById('product-form');
      form.querySelector('[name="product_id"]').value = p.id;
      form.querySelector('[name="name"]').value = p.name;
      form.querySelector('[name="description"]').value = p.description;
      form.querySelector('[name="materials"]').value = p.materials || '';
      form.querySelector('[name="price"]').value = p.price || '';
      form.querySelector('[name="category_id"]').value = p.category_id || '';
      form.querySelector('[name="is_active"]').checked = !!p.is_active;
      form.querySelector('[name="is_featured"]').checked = !!p.is_featured;
      document.getElementById('product-modal-title').textContent = 'Editar Producto';
      Modal.open('product-modal');
    } catch (err) { Toast.error(err.message); }
  }

  async function deleteProduct(id, name) {
    if (!confirm(`¿Eliminar el producto "${name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await API.Products.delete(id);
      Toast.success('Producto eliminado.');
      loadProductsData(1);
    } catch (err) { Toast.error(err.message); }
  }

  // ── Testimonials Section ──
  async function loadTestimonials() {
    setActiveSection('testimonials');
    const content = document.getElementById('admin-content');
    content.innerHTML = `
      <div class="admin-header">
        <h2 class="admin-title">Testimonios</h2>
      </div>
      <div style="background:var(--color-black-card);border:1px solid var(--color-black-border);border-radius:var(--radius-lg);overflow:hidden;">
        <table class="data-table">
          <thead><tr><th>Cliente</th><th>Comentario</th><th>Calificación</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody id="test-tbody">${[...Array(3)].map(() => Skeleton.row()).join('')}</tbody>
        </table>
      </div>
    `;
    try {
      const res = await API.Testimonials.getAll({ per_page: 20 });
      const items = res.data || [];
      const tbody = document.getElementById('test-tbody');
      if (!items.length) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--color-white-muted);">Sin testimonios.</td></tr>';
        return;
      }
      tbody.innerHTML = items.map(t => `
        <tr>
          <td><strong>${t.name}</strong></td>
          <td>${truncate(t.comment, 60)}</td>
          <td><div class="stars">${renderStars(t.rating)}</div></td>
          <td><span class="badge ${t.is_approved ? 'badge-green' : 'badge-yellow'}">${t.is_approved ? 'Aprobado' : 'Pendiente'}</span></td>
          <td>
            <div class="action-btns">
              ${!t.is_approved ? `<button class="action-btn edit" onclick="Admin.approveTestimonial(${t.id})" title="Aprobar">✓</button>` : ''}
              <button class="action-btn delete" onclick="Admin.deleteTestimonial(${t.id})" title="Eliminar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    } catch (err) {
      document.getElementById('test-tbody').innerHTML = `<tr><td colspan="5" style="color:#ef4444;padding:2rem;">${err.message}</td></tr>`;
    }
  }

  async function approveTestimonial(id) {
    try {
      await API.Testimonials.approve(id);
      Toast.success('Testimonio aprobado.');
      loadTestimonials();
    } catch (err) { Toast.error(err.message); }
  }

  async function deleteTestimonial(id) {
    if (!confirm('¿Eliminar este testimonio?')) return;
    try {
      await API.Testimonials.delete(id);
      Toast.success('Testimonio eliminado.');
      loadTestimonials();
    } catch (err) { Toast.error(err.message); }
  }

  // ── Contacts Section ──
  async function loadContacts() {
    setActiveSection('contacts');
    const content = document.getElementById('admin-content');
    content.innerHTML = `
      <div class="admin-header"><h2 class="admin-title">Mensajes de Contacto</h2></div>
      <div style="background:var(--color-black-card);border:1px solid var(--color-black-border);border-radius:var(--radius-lg);overflow:hidden;">
        <table class="data-table">
          <thead><tr><th>Nombre</th><th>Email</th><th>Asunto</th><th>Mensaje</th><th>Fecha</th></tr></thead>
          <tbody id="contacts-tbody">${[...Array(3)].map(() => Skeleton.row()).join('')}</tbody>
        </table>
      </div>
    `;
    try {
      const res = await API.Contacts.getAll({ per_page: 20 });
      const items = res.data || [];
      const tbody = document.getElementById('contacts-tbody');
      if (!items.length) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--color-white-muted);">Sin mensajes aún.</td></tr>';
        return;
      }
      tbody.innerHTML = items.map(c => `
        <tr>
          <td><strong>${c.name}</strong><br><small style="color:var(--color-white-muted);">${c.phone || ''}</small></td>
          <td>${c.email}</td>
          <td>${c.subject || '—'}</td>
          <td>${truncate(c.message, 60)}</td>
          <td style="white-space:nowrap;">${formatDate(c.created_at)}</td>
        </tr>
      `).join('');
    } catch (err) {
      document.getElementById('contacts-tbody').innerHTML = `<tr><td colspan="5" style="color:#ef4444;padding:2rem;">${err.message}</td></tr>`;
    }
  }

  // ── Jobs Section ──
  async function loadJobs() {
    setActiveSection('jobs');
    const content = document.getElementById('admin-content');
    content.innerHTML = `
      <div class="admin-header">
        <h2 class="admin-title">Trabajos Realizados</h2>
        <button class="btn btn-primary" onclick="Admin.openJobModal()">+ Nuevo Trabajo</button>
      </div>
      <div style="background:var(--color-black-card);border:1px solid var(--color-black-border);border-radius:var(--radius-lg);overflow:hidden;">
        <table class="data-table">
          <thead><tr><th>Imagen</th><th>Título</th><th>Categoría</th><th>Ubicación</th><th>Acciones</th></tr></thead>
          <tbody id="jobs-tbody">${[...Array(3)].map(() => Skeleton.row()).join('')}</tbody>
        </table>
      </div>
      ${jobModal()}
    `;
    setupJobModal();
    loadJobsData();
  }

  async function loadJobsData() {
    const tbody = document.getElementById('jobs-tbody');
    if (!tbody) return;
    try {
      const res = await API.Jobs.getAll({ per_page: 15 });
      const items = res.data || [];
      if (!items.length) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--color-white-muted);">Sin trabajos aún.</td></tr>';
        return;
      }
      tbody.innerHTML = items.map(j => `
        <tr>
          <td><img class="table-img" src="${API.getImageUrl(j.images?.[0]?.path)}" alt="${j.title}" onerror="this.src='assets/images/placeholder.jpg'"></td>
          <td><strong>${j.title}</strong></td>
          <td><span class="badge badge-fuchsia">${j.category?.name || '—'}</span></td>
          <td>${j.location || '—'}</td>
          <td>
            <div class="action-btns">
              <button class="action-btn delete" onclick="Admin.deleteJob(${j.id},'${j.title}')" title="Eliminar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="5" style="color:#ef4444;padding:2rem;">${err.message}</td></tr>`;
    }
  }

  function jobModal() {
    return `
    <div class="modal-overlay" id="job-modal">
      <div class="modal" style="max-width:600px;">
        <div class="modal-header">
          <h3 class="modal-title">Nuevo Trabajo</h3>
          <button class="modal-close" onclick="Modal.close('job-modal')">✕</button>
        </div>
        <form id="job-form">
          <div class="form-group">
            <label class="form-label">Título *</label>
            <input class="form-control" name="title" required placeholder="Ej: Rotulación de vehículo">
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
            <div class="form-group">
              <label class="form-label">Categoría</label>
              <select class="form-control" name="category_id" id="job-cat-select">
                <option value="">Sin categoría</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Ubicación</label>
              <input class="form-control" name="location" placeholder="Ej: Santa Cruz">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Descripción</label>
            <textarea class="form-control" name="description" rows="3" placeholder="Descripción del trabajo..."></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Fecha</label>
            <input class="form-control" name="date" type="date">
          </div>
          <div class="form-group">
            <label class="form-label">Imágenes (múltiples)</label>
            <input class="form-control" name="images[]" type="file" accept="image/*" multiple id="job-images-input">
            <div id="job-images-preview" style="display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.5rem;"></div>
          </div>
          <div style="display:flex;gap:.75rem;justify-content:flex-end;margin-top:1rem;">
            <button type="button" class="btn btn-ghost" onclick="Modal.close('job-modal')">Cancelar</button>
            <button type="submit" class="btn btn-primary" id="job-submit-btn">Guardar Trabajo</button>
          </div>
        </form>
      </div>
    </div>`;
  }

  function setupJobModal() {
    setupImagePreview(document.getElementById('job-images-input'), document.getElementById('job-images-preview'));
    API.Categories.getAll().then(res => {
      const cats = res.data || res;
      const sel = document.getElementById('job-cat-select');
      if (sel) sel.innerHTML += cats.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }).catch(() => {});

    document.getElementById('job-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('job-submit-btn');
      btn.disabled = true; btn.textContent = 'Guardando...';
      try {
        await API.Jobs.create(new FormData(e.target));
        Toast.success('Trabajo guardado.');
        Modal.close('job-modal');
        loadJobsData();
      } catch (err) {
        Toast.error(err.message);
      } finally { btn.disabled = false; btn.textContent = 'Guardar Trabajo'; }
    });
  }

  function openJobModal() { Modal.open('job-modal'); }

  async function deleteJob(id, title) {
    if (!confirm(`¿Eliminar el trabajo "${title}"?`)) return;
    try {
      await API.Jobs.delete(id);
      Toast.success('Trabajo eliminado.');
      loadJobsData();
    } catch (err) { Toast.error(err.message); }
  }

  // ── Categories Section ──
  async function loadCategories() {
    setActiveSection('categories');
    const content = document.getElementById('admin-content');
    content.innerHTML = `
      <div class="admin-header">
        <h2 class="admin-title">Categorías</h2>
        <button class="btn btn-primary" onclick="Admin.openCategoryModal()">+ Nueva Categoría</button>
      </div>
      <div style="background:var(--color-black-card);border:1px solid var(--color-black-border);border-radius:var(--radius-lg);overflow:hidden;">
        <table class="data-table">
          <thead><tr><th>Nombre</th><th>Slug</th><th>Acciones</th></tr></thead>
          <tbody id="cats-tbody">${[...Array(3)].map(() => Skeleton.row()).join('')}</tbody>
        </table>
      </div>
      <div class="modal-overlay" id="category-modal">
        <div class="modal" style="max-width:400px;">
          <div class="modal-header">
            <h3 class="modal-title">Nueva Categoría</h3>
            <button class="modal-close" onclick="Modal.close('category-modal')">✕</button>
          </div>
          <form id="category-form">
            <input type="hidden" name="cat_id" id="cat_id">
            <div class="form-group">
              <label class="form-label">Nombre *</label>
              <input class="form-control" name="name" required placeholder="Ej: Impresión Digital">
            </div>
            <div class="form-group">
              <label class="form-label">Descripción</label>
              <textarea class="form-control" name="description" rows="2"></textarea>
            </div>
            <div style="display:flex;gap:.75rem;justify-content:flex-end;margin-top:1rem;">
              <button type="button" class="btn btn-ghost" onclick="Modal.close('category-modal')">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    `;
    loadCategoriesData();
    document.getElementById('category-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const id = form.querySelector('[name="cat_id"]').value;
      const data = { name: form.querySelector('[name="name"]').value, description: form.querySelector('[name="description"]').value };
      try {
        if (id) { await API.Categories.update(id, data); Toast.success('Categoría actualizada.'); }
        else { await API.Categories.create(data); Toast.success('Categoría creada.'); }
        Modal.close('category-modal');
        loadCategoriesData();
      } catch (err) { Toast.error(err.message); }
    });
  }

  async function loadCategoriesData() {
    const tbody = document.getElementById('cats-tbody');
    if (!tbody) return;
    try {
      const res = await API.Categories.getAll();
      const cats = res.data || res;
      if (!cats.length) { tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:2rem;color:var(--color-white-muted);">Sin categorías.</td></tr>'; return; }
      tbody.innerHTML = cats.map(c => `
        <tr>
          <td><strong>${c.name}</strong></td>
          <td><code style="color:var(--color-fuchsia);font-size:.8rem;">${c.slug || c.name.toLowerCase().replace(/ /g,'-')}</code></td>
          <td>
            <div class="action-btns">
              <button class="action-btn edit" onclick="Admin.editCategory(${c.id},'${c.name}','${c.description||''}')" title="Editar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="action-btn delete" onclick="Admin.deleteCategory(${c.id},'${c.name}')" title="Eliminar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    } catch (err) { tbody.innerHTML = `<tr><td colspan="3" style="color:#ef4444;padding:2rem;">${err.message}</td></tr>`; }
  }

  function openCategoryModal() { document.getElementById('cat_id').value=''; document.getElementById('category-form').reset(); Modal.open('category-modal'); }
  function editCategory(id, name, desc) { document.getElementById('cat_id').value=id; document.getElementById('category-form').querySelector('[name="name"]').value=name; document.getElementById('category-form').querySelector('[name="description"]').value=desc; Modal.open('category-modal'); }
  async function deleteCategory(id, name) {
    if (!confirm(`¿Eliminar categoría "${name}"?`)) return;
    try { await API.Categories.delete(id); Toast.success('Categoría eliminada.'); loadCategoriesData(); } catch (err) { Toast.error(err.message); }
  }

  // ── Nav helper ──
  function setActiveSection(section) {
    currentSection = section;
    document.querySelectorAll('.admin-nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.section === section);
    });
  }

  // ── Logout ──
  async function logout() {
    try { await API.Auth.logout(); } catch (_) {}
    API.Auth.logout();
    showLogin();
  }

  // ── Init ──
  function init() {
    document.getElementById('login-form')?.addEventListener('submit', handleLogin);
    document.getElementById('logout-btn')?.addEventListener('click', logout);

    document.querySelectorAll('.admin-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const section = item.dataset.section;
        if (section === 'dashboard') loadDashboard();
        else if (section === 'products') loadProducts();
        else if (section === 'jobs') loadJobs();
        else if (section === 'testimonials') loadTestimonials();
        else if (section === 'contacts') loadContacts();
        else if (section === 'categories') loadCategories();
      });
    });

    if (checkAuth()) {
      showApp();
      loadDashboard();
    }
  }

  return {
    init, openProductModal, editProduct, deleteProduct,
    approveTestimonial, deleteTestimonial,
    openJobModal, deleteJob,
    openCategoryModal, editCategory, deleteCategory,
  };
})();

window.Admin = Admin;
document.addEventListener('DOMContentLoaded', Admin.init);
