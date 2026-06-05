const navToggle = document.querySelector('.nav-toggle');
const navWrap = document.querySelector('.nav-wrap');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle && navWrap) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navToggle.classList.toggle('is-open');
    navWrap.classList.toggle('is-open');
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (navWrap.classList.contains('is-open')) {
      navWrap.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  {
    threshold: 0.2,
  }
);

document.querySelectorAll('.reveal').forEach((element) => {
  revealObserver.observe(element);
});

(function () {
  const loader = document.getElementById('site-loader');
  if (!loader) return;
    // show loader only on first visit
    try {
      const seen = localStorage.getItem('site_loader_seen');
      if (seen) {
        // remove loader immediately and ensure no blur/scroll lock
        const content = document.getElementById('main-content');
        if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
        if (content) content.style.filter = '';
        document.body.style.overflow = '';
        return;
      }
      localStorage.setItem('site_loader_seen', '1');
    } catch (e) {
      // if localStorage fails, proceed to show loader normally
      console.warn('localStorage not available for loader flag', e);
    }

    const bar = loader.querySelector('.bar');
    const content = document.getElementById('main-content');
    const maxTime = 2000; // ms (2 seconds)
    const maxBlur = 8; // px
    let start = performance.now();
    function step(now) {
      const elapsed = now - start;
      const pct = Math.min(1, elapsed / maxTime);
      if (bar) bar.style.width = (pct * 100) + '%';
      if (content) content.style.filter = `blur(${(maxBlur * (1 - pct)).toFixed(2)}px)`;
      if (pct < 1) {
        requestAnimationFrame(step);
      } else {
        // finish and fade out
        loader.classList.add('fade');
        if (content) content.style.filter = '';
        document.body.style.overflow = '';
        setTimeout(() => {
          if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
        }, 350);
      }
    }
    // prevent scrolling while loading and initialize blur
    document.body.style.overflow = 'hidden';
    if (content) content.style.filter = `blur(${maxBlur}px)`;
    requestAnimationFrame(step);
})();
