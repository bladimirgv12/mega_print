/* =============================================
   MegaPrint — contact.js
   ============================================= */

(function () {
  async function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm(form)) return;

      const btn = form.querySelector('[type="submit"]');
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner spinner-sm" style="display:inline-block;"></span> Enviando...';

      const data = {
        name: form.querySelector('[name="name"]').value.trim(),
        email: form.querySelector('[name="email"]').value.trim(),
        phone: form.querySelector('[name="phone"]')?.value.trim() || '',
        subject: form.querySelector('[name="subject"]')?.value.trim() || '',
        message: form.querySelector('[name="message"]').value.trim(),
      };

      try {
        await API.Contacts.send(data);
        Toast.success('¡Mensaje enviado! Te responderemos pronto.');
        form.reset();
      } catch (err) {
        Toast.error(`Error: ${err.message}`);
      } finally {
        btn.disabled = false;
        btn.textContent = originalText;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', setupContactForm);
})();
