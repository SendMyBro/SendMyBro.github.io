/* ============================================================
   Variation 1 — Coastal Light · Send My Brother
   Vanilla JS: sticky nav, active link, counters, scroll reveal,
   mobile menu, dynamic contact form, friendly submit confirm.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. Sticky nav ---------- */
  var navbar = document.getElementById('navbar');
  function onScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 5. Mobile menu ---------- */
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
  }
  function toggleMenu() {
    var open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  hamburger.addEventListener('click', toggleMenu);

  /* ---------- 2. Active link + close on click ---------- */
  var links = Array.prototype.slice.call(navLinks.querySelectorAll('.nav-link'));
  var sections = links
    .map(function (l) {
      var id = l.getAttribute('href');
      return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  links.forEach(function (l) {
    l.addEventListener('click', function () {
      if (window.innerWidth <= 900) closeMenu();
    });
  });

  function setActive() {
    var pos = window.scrollY + 120;
    var currentId = sections.length ? '#' + sections[0].id : '';
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= pos) currentId = '#' + sections[i].id;
    }
    links.forEach(function (l) {
      l.classList.toggle('active', l.getAttribute('href') === currentId);
    });
  }
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  /* ---------- 4. Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 3. Animated counters ---------- */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1600;
    var start = null;

    function tick(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      // ease-out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString('en-ZA') + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString('en-ZA') + suffix;
      }
    }
    requestAnimationFrame(tick);
  }

  var counters = document.querySelectorAll('.stat-number[data-target]');
  if ('IntersectionObserver' in window) {
    var countObs = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (c) { countObs.observe(c); });
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- 6. Dynamic contact form ---------- */
  var enquiryType = document.getElementById('enquiryType');
  var dynamicFields = document.getElementById('dynamicFields');

  function field(html) { return html; }

  function textField(id, label, type) {
    type = type || 'text';
    return '<div class="field">' +
      '<label for="' + id + '">' + label + '</label>' +
      '<input type="' + type + '" id="' + id + '" name="' + id + '">' +
      '</div>';
  }
  function textareaField(id, label) {
    return '<div class="field">' +
      '<label for="' + id + '">' + label + '</label>' +
      '<textarea id="' + id + '" name="' + id + '"></textarea>' +
      '</div>';
  }
  function fileField(id, label) {
    return '<div class="field">' +
      '<label for="' + id + '">' + label + '</label>' +
      '<input type="file" id="' + id + '" name="' + id + '" accept="image/*" multiple>' +
      '</div>';
  }
  function planSelectField() {
    return '<div class="field">' +
      '<label for="planChoice">Preferred Plan</label>' +
      '<select id="planChoice" name="planChoice">' +
        '<option value="">Select a plan</option>' +
        '<option value="Little Brother">Little Brother</option>' +
        '<option value="Big Brother">Big Brother</option>' +
        '<option value="Favourite Child">Favourite Child</option>' +
      '</select>' +
      '</div>';
  }

  function renderDynamicFields(type) {
    var html = '';
    switch (type) {
      case 'service':
        html = textField('serviceRequired', 'Service Required') +
               textareaField('serviceMessage', 'Tell us how we can help');
        break;
      case 'quote':
        html = textField('serviceRequiredQuote', 'Service Required') +
               textField('propertyAddress', 'Property Address') +
               textField('preferredDate', 'Preferred Date', 'date') +
               fileField('photos', 'Photos (optional)');
        break;
      case 'plan':
        html = textField('planAddress', 'Property Address') +
               planSelectField();
        break;
      case 'dispute':
        html = textField('jobNumber', 'Job Number') +
               textareaField('issueDescription', 'Describe the issue');
        break;
      default:
        html = '';
    }
    dynamicFields.innerHTML = field(html);
  }

  if (enquiryType) {
    enquiryType.addEventListener('change', function () {
      renderDynamicFields(this.value);
    });
  }

  /* ---------- 7. Submit confirmation ---------- */
  var form = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      success.hidden = false;
      success.textContent = 'Thank you! Your enquiry has been sent — we’ll be in touch shortly.';
      form.reset();
      renderDynamicFields('');
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(function () { success.hidden = true; }, 8000);
    });
  }
})();
