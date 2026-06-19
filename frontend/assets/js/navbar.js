/* =============================================
   MegaPrint — navbar.js
   ============================================= */

(function () {
  const WHATSAPP = '59177712345';

  // ── Inject Navbar ──
  function injectNavbar() {
    const placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) return;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    function navLink(href, label) {
      const active = currentPage === href ? 'active' : '';
      return `<li><a href="${href}" class="${active}">${label}</a></li>`;
    }

    placeholder.innerHTML = `
      <nav class="navbar" id="main-navbar">
        <div class="navbar-inner">
          <a href="index.html" class="navbar-logo">
            <img
              src="assets/images/logo-megaprint.jpg"
              alt="MegaPrint Salcajá"
              class="navbar-logo-img"
            >
          </a>

          <ul class="navbar-nav">
            ${navLink('index.html', 'Inicio')}
            ${navLink('products.html', 'Productos')}
            ${navLink('jobs.html', 'Trabajos')}
            ${navLink('testimonials.html', 'Testimonios')}
            ${navLink('about.html', 'Nosotros')}
            ${navLink('contact.html', 'Contacto')}
          </ul>

          <div class="navbar-actions">
            <a href="https://wa.me/${WHATSAPP}" target="_blank" class="btn btn-yellow btn-sm">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              WhatsApp
            </a>
            <button class="hamburger" id="hamburger-btn" aria-label="Menú">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>

      <!-- Mobile Menu -->
      <div class="mobile-menu" id="mobile-menu">
        <button class="modal-close" id="mobile-close" style="position:absolute;top:1.5rem;right:1.5rem;">✕</button>
        <nav>
          <a href="index.html" onclick="closeMobileMenu()">Inicio</a>
          <a href="products.html" onclick="closeMobileMenu()">Productos</a>
          <a href="jobs.html" onclick="closeMobileMenu()">Trabajos</a>
          <a href="testimonials.html" onclick="closeMobileMenu()">Testimonios</a>
          <a href="about.html" onclick="closeMobileMenu()">Nosotros</a>
          <a href="contact.html" onclick="closeMobileMenu()">Contacto</a>
        </nav>
        <a href="https://wa.me/${WHATSAPP}" target="_blank" class="btn btn-yellow">
          WhatsApp Ahora
        </a>
      </div>
    `;

    initNavbar();
  }

  function initNavbar() {
    const navbar = document.getElementById('main-navbar');
    const hamburger = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileClose = document.getElementById('mobile-close');

    // Scroll behavior
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
    });

    // Hamburger toggle
    hamburger?.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu?.classList.toggle('open');
      document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : '';
    });

    mobileClose?.addEventListener('click', closeMobileMenu);
  }

  window.closeMobileMenu = function () {
    document.getElementById('hamburger-btn')?.classList.remove('open');
    document.getElementById('mobile-menu')?.classList.remove('open');
    document.body.style.overflow = '';
  };

  // ── Inject Footer ──
  function injectFooter() {
    const placeholder = document.getElementById('footer-placeholder');
    if (!placeholder) return;

    placeholder.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <!-- Brand -->
            <div>
              <div class="footer-brand">
                <img src="assets/images/logo-megaprint.jpg" alt="MegaPrint" class="footer-logo">
              </div>
              <p class="footer-desc">
                Tu centro de impresión!
              </p>
              <div class="footer-social">
                <a href="#" class="social-btn" aria-label="Facebook">
                  <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                </a>
                <a href="#" class="social-btn" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href="#" class="social-btn" aria-label="TikTok">
                  <svg viewBox="0 0 24 24"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/></svg>
                </a>
                <a href="https://wa.me/${WHATSAPP}" target="_blank" class="social-btn" aria-label="WhatsApp">
                  <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                </a>
              </div>
            </div>

            <!-- Links -->
            <div>
              <h4 class="footer-title">Navegación</h4>
              <ul class="footer-links">
                <li><a href="index.html">Inicio</a></li>
                <li><a href="products.html">Productos</a></li>
                <li><a href="jobs.html">Trabajos</a></li>
                <li><a href="testimonials.html">Testimonios</a></li>
                <li><a href="about.html">Nosotros</a></li>
                <li><a href="contact.html">Contacto</a></li>
              </ul>
            </div>

            <!-- Services -->
            <div>
              <h4 class="footer-title">Servicios</h4>
              <ul class="footer-links">
                <li><a href="products.html">Mantas Vinílicas</a></li>
                <li><a href="products.html">Stickers</a></li>
                <li><a href="products.html">Rótulos 3D</a></li>
                <li><a href="products.html">Carteles</a></li>
                <li><a href="products.html">Grabado Láser</a></li>
                <li><a href="products.html">Corte Láser</a></li>
                <li><a href="products.html">Letras 3D</a></li>
                <li><a href="products.html">Sellos</a></li>
              </ul>
            </div>

            <!-- Contact -->
            <div>
              <h4 class="footer-title">Contacto</h4>
              <div class="footer-contact-item">
                <svg class="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 12a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.9a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7a2 2 0 011.72 2.03z"/></svg>
                <span>+502 12345678</span>
              </div>
              <div class="footer-contact-item">
                <svg class="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>contacto@megaprint.bo</span>
              </div>
              <div class="footer-contact-item">
                <svg class="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>3ra calle 00-065 zona 2, Salcajá, Quetzaltenango</span>
              </div>
              <div class="footer-contact-item">
                <svg class="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
                <span>Lun-Vie: 8:00 - 18:00<br>Sáb: 8:00 - 13:00</span>
              </div>
            </div>
          </div>

          <div class="footer-bottom">
            <p>© ${new Date().getFullYear()} MegaPrint. Todos los derechos reservados.</p>
            <p>Diseñado con ❤️ para la impresión profesional</p>
          </div>
        </div>
      </footer>
    `;
  }

  // ── WhatsApp Button ──
  function injectWhatsApp() {
    const btn = document.createElement('a');
    btn.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola! Me interesa cotizar un servicio de impresión.')}`;
    btn.target = '_blank';
    btn.className = 'whatsapp-float';
    btn.title = 'Escríbenos por WhatsApp';
    btn.setAttribute('aria-label', 'Contactar por WhatsApp');
    btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>`;
    document.body.appendChild(btn);
  }

  // ── Init ──
  document.addEventListener('DOMContentLoaded', () => {
    injectNavbar();
    injectFooter();
    injectWhatsApp();
    ScrollReveal.init();
  });
})();
