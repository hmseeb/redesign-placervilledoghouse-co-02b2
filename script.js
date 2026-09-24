/* The Placerville Dog House — interactions
   Vanilla JS: mobile nav, sticky header, scroll reveal,
   active-section highlighting, FAQ accordion, contact form. */
(function () {
  'use strict';

  /* ---------- mobile nav ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeNav();
    });
  }

  /* ---------- sticky header shadow ---------- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 12) header.classList.add('is-stuck');
    else header.classList.remove('is-stuck');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(
    '.about__card, .svc, .why, .commit, .qa, .stat, .area__copy, .area__list, .form-card, .intro__body, .sec-head'
  );

  if ('IntersectionObserver' in window) {
    Array.prototype.forEach.call(revealTargets, function (el) {
      el.classList.add('reveal');
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    Array.prototype.forEach.call(revealTargets, function (el) {
      io.observe(el);
    });
  }

  /* ---------- active nav link on scroll ---------- */
  var sections = ['about', 'services', 'why', 'area', 'faq', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navLinks = nav ? nav.querySelectorAll('a[href^="#"]') : [];

  function setActive() {
    var pos = window.scrollY + (window.innerHeight * 0.3);
    var currentId = '';
    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) currentId = sec.id;
    });
    Array.prototype.forEach.call(navLinks, function (link) {
      var isActive = link.getAttribute('href') === '#' + currentId;
      link.classList.toggle('is-active', !!currentId && isActive);
    });
  }
  if (sections.length && navLinks.length) {
    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
  }

  /* ---------- FAQ: one open at a time ---------- */
  var faqItems = document.querySelectorAll('#faqList .qa');
  Array.prototype.forEach.call(faqItems, function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      Array.prototype.forEach.call(faqItems, function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ---------- contact form ---------- */
  var form = document.getElementById('contactForm');
  var msg = document.getElementById('formMsg');

  function show(text, ok) {
    if (!msg) return;
    msg.textContent = text;
    msg.className = 'form-msg ' + (ok ? 'is-ok' : 'is-err');
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var required = form.querySelectorAll('[required]');
      var firstBad = null;

      Array.prototype.forEach.call(required, function (field) {
        var value = (field.value || '').trim();
        var bad = !value;
        if (!bad && field.type === 'email') {
          bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
        }
        field.classList.toggle('is-invalid', bad);
        if (bad && !firstBad) firstBad = field;
      });

      if (firstBad) {
        show('Oops — please fill in your name, a valid email, and a short message so we can reply.', false);
        firstBad.focus();
        return;
      }

      var data = new FormData(form);
      var name = [data.get('firstName'), data.get('lastName')].join(' ').trim();
      var lines = [
        'Name: ' + name,
        'Email: ' + (data.get('email') || ''),
        'Phone: ' + (data.get('phone') || 'Not provided'),
        'Service: ' + (data.get('service') || ''),
        '',
        data.get('message') || ''
      ];

      var mailto =
        'mailto:placervilledoghouse@gmail.com' +
        '?subject=' + encodeURIComponent('Pet care inquiry from ' + name) +
        '&body=' + encodeURIComponent(lines.join('\n'));

      show(
        'Thank you for contacting us! Your email app is opening with your message — send it and we will get back to you as soon as possible. In a hurry? Call (530) 497-0393.',
        true
      );

      window.location.href = mailto;
      form.reset();
    });

    form.addEventListener('input', function (e) {
      if (e.target.classList) e.target.classList.remove('is-invalid');
    });
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
