(function () {
  const loader = document.getElementById('site-loader');
  if (loader) {
    const started = performance.now();
    const minimumVisible = 2350;
    const releaseLoader = () => {
      const elapsed = performance.now() - started;
      window.setTimeout(() => {
        loader.classList.add('is-leaving');
        document.body.classList.remove('is-loading');
        window.setTimeout(() => loader.remove(), 820);
      }, Math.max(0, minimumVisible - elapsed));
    };
    if (document.readyState === 'complete') releaseLoader();
    else window.addEventListener('load', releaseLoader, { once: true });
  }

  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? '✕' : '☰';
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = '☰';
    }));
  }

  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .12 }) : null;
  document.querySelectorAll('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('in'));

  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const intake = document.querySelector('#intake-form');
  if (intake) {
    const status = document.querySelector('#form-status');
    document.querySelector('#print-intake')?.addEventListener('click', () => window.print());
    document.querySelector('#clear-intake')?.addEventListener('click', () => {
      if (confirm('Clear all information entered in this form?')) {
        intake.reset();
        if (status) status.style.display = 'none';
      }
    });
    document.querySelector('#copy-intake')?.addEventListener('click', async () => {
      const data = new FormData(intake);
      const labels = {};
      intake.querySelectorAll('[name]').forEach(field => {
        const label = intake.querySelector(`label[for="${field.id}"]`);
        labels[field.name] = label ? label.textContent.trim() : field.name;
      });
      const lines = ['TENDER CARE RESPITE SERVICES — FAMILY INTAKE INFORMATION', ''];
      for (const [key, value] of data.entries()) {
        if (String(value).trim()) lines.push(`${labels[key] || key}: ${String(value).trim()}`);
      }
      lines.push('', 'Parent/Guardian signature: ____________________', `Date: ${new Date().toLocaleDateString()}`);
      try {
        await navigator.clipboard.writeText(lines.join('\n'));
        if (status) {
          status.textContent = 'Intake summary copied. Contact Tender Care to arrange a secure way to provide it.';
          status.style.display = 'block';
        }
      } catch (e) {
        alert('Copy was not available in this browser. You can use Print / Save PDF instead.');
      }
    });
  }
})();
