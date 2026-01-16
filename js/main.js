(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const toggleIcon = document.querySelector('.theme-icon');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)');

  const setTheme = (mode) => {
    const isLight = mode === 'light';
    root.classList.toggle('light', isLight);
    toggleIcon.textContent = isLight ? '☀️' : '🌙';
    const accent = isLight ? '#f7f8fb' : '#0f172a';
    if (themeMeta) themeMeta.setAttribute('content', accent);
    localStorage.setItem('theme', mode);
  };

  const initTheme = () => {
    const saved = localStorage.getItem('theme');
    const initial = saved || (prefersLight.matches ? 'light' : 'dark');
    setTheme(initial);
  };

  toggle?.addEventListener('click', () => {
    const isLight = root.classList.contains('light');
    setTheme(isLight ? 'dark' : 'light');
  });

  prefersLight.addEventListener('change', (e) => {
    const saved = localStorage.getItem('theme');
    if (!saved) setTheme(e.matches ? 'light' : 'dark');
  });

  initTheme();

  // Intersection Observer for reveal animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.16,
  });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  // Contact form handling (real submission)
  const form = document.querySelector('.contact-form');
  const status = document.querySelector('.form-status');
  const submitBtn = form?.querySelector('button[type="submit"]');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const endpoint = form.dataset.endpoint || form.getAttribute('action');
    if (!endpoint) {
      status.textContent = 'يرجى ضبط رابط الإرسال أولاً.';
      status.style.color = '#f97316';
      return;
    }

    status.textContent = 'جارٍ إرسال رسالتك...';
    status.style.color = 'var(--muted)';
    if (submitBtn) submitBtn.disabled = true;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      status.textContent = 'تم إرسال رسالتك بنجاح! سيتم الرد عليك قريباً.';
      status.style.color = 'var(--accent)';
      form.reset();
    } catch (error) {
      status.textContent = 'تعذر إرسال الرسالة الآن. حاول مرة أخرى لاحقاً.';
      status.style.color = '#f97316';
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  // Dynamic year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
