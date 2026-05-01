// ============================================
// TRAVEL HORIZON - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- NAVBAR SCROLL ----
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    backToTop.classList.toggle('visible', window.scrollY > 400);
  });

  // ---- MOBILE NAV ----
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileClose = document.getElementById('mobileClose');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
    mobileClose?.addEventListener('click', () => mobileNav.classList.remove('open'));
    mobileNav.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', () => mobileNav.classList.remove('open'))
    );
  }

  // ---- BACK TO TOP ----
  const backToTop = document.getElementById('backToTop');
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ---- DYNAMIC PACKAGE RENDERING ----
  const dynamicGrid = document.getElementById('dynamic-pkg-grid');
  if (dynamicGrid && typeof tourData !== 'undefined') {
    let delayCounter = 0;
    for (const [id, pkg] of Object.entries(tourData)) {
      const delayClass = delayCounter % 3 === 0 ? '' : (delayCounter % 3 === 1 ? 'fade-up-delay-1' : 'fade-up-delay-2');
      const badgeHtml = pkg.category === 'group' ? `<span class="pkg-badge group">Group Tour</span>` : 
                        (delayCounter % 2 === 0 ? `<span class="pkg-badge">Recommended</span>` : `<span class="pkg-badge sale">Popular</span>`);
      
      let priceHtml = `<div class="current">${pkg.price} <span class="per">/ person</span></div>`;
      
      const cardHTML = `
        <div class="pkg-card fade-up ${delayClass}" data-category="${pkg.category || 'domestic'}">
          <div class="pkg-img-wrap">
            <div class="pkg-placeholder" style="height:100%;background-image:url('${pkg.heroImage}');background-size:cover;background-position:center;"></div>
            ${badgeHtml}
          </div>
          <div class="pkg-body">
            <div class="pkg-meta"><span class="pkg-duration">${pkg.meta.split('•')[0]}</span></div>
            <h3 class="pkg-title">${pkg.title}</h3>
            <p class="pkg-locations">${pkg.departure || pkg.meta.split('•')[1]}</p>
            <div class="pkg-footer">
              <div class="pkg-price">${priceHtml}</div>
              <a href="tour-detail.html?pkg=${id}" class="btn btn-primary pkg-btn">View Details</a>
            </div>
          </div>
        </div>
      `;
      dynamicGrid.insertAdjacentHTML('beforeend', cardHTML);
      delayCounter++;
    }
  }

  // ---- INTERSECTION OBSERVER (fade-up) ----
  const fadeEls = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => io.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // ---- PACKAGE TABS ----
  const tabs = document.querySelectorAll('.pkg-tab');
  const pkgCards = document.querySelectorAll('.pkg-card[data-category]');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      pkgCards.forEach(card => {
        const show = cat === 'all' || card.dataset.category === cat;
        card.style.display = show ? 'block' : 'none';
      });
    });
  });

  // ---- CONTACT FORM ----
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = '✓ Message Sent!';
    btn.style.background = '#27ae60';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });

  // ---- NEWSLETTER ----
  const nlForm = document.getElementById('nlForm');
  nlForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = nlForm.querySelector('input');
    const btn = nlForm.querySelector('button');
    const original = btn.textContent;
    btn.textContent = '✓ Subscribed!';
    btn.style.background = '#27ae60';
    input.value = '';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
    }, 3000);
  });

  // ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- PRICE RANGE SLIDER ----
  const priceRange = document.getElementById('priceRange');
  const priceDisplay = document.getElementById('priceDisplay');
  if (priceRange && priceDisplay) {
    priceRange.addEventListener('input', () => {
      const val = Number(priceRange.value).toLocaleString('en-IN');
      priceDisplay.textContent = '₹' + val;
    });
  }

  // ---- ACTIVE NAV LINK ----
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href === currentPage) link.classList.add('active');
  });

  // ---- COUNTER ANIMATION ----
  const counters = document.querySelectorAll('.count-up');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.target);
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = Math.floor(current).toLocaleString();
        }, 16);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

});
