// ============================================
// TRAVEL HORIZON - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- UI ELEMENTS ----
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  // ---- NAVBAR SCROLL ----
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
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

  // ---- DYNAMIC NAVBAR DROPDOWNS ----
  function renderNavDropdowns() {
    if (!window.navCategories) return;
    
    // Find the India and International nav items
    const navItems = document.querySelectorAll('.nav-item');
    let indiaDropdown = null;
    let intlDropdown = null;

    navItems.forEach(item => {
      const linkText = item.querySelector('.nav-link')?.textContent.trim();
      if (linkText === 'India ▾') indiaDropdown = item.querySelector('.mega-dropdown');
      if (linkText === 'International ▾') intlDropdown = item.querySelector('.mega-dropdown');
    });

    const buildMegaMenu = (dataObj) => {
      let html = '';
      for (const [subRegion, places] of Object.entries(dataObj)) {
        html += `<div class="mega-col"><div class="mega-title">${subRegion}</div>`;
        places.forEach(place => {
          html += `<a href="destination-tours.html?dest=${place.id}">${place.name}</a>`;
        });
        html += `</div>`;
      }
      return html;
    };

    if (indiaDropdown && window.navCategories.india) {
      indiaDropdown.innerHTML = buildMegaMenu(window.navCategories.india);
    }
    if (intlDropdown && window.navCategories.international) {
      intlDropdown.innerHTML = buildMegaMenu(window.navCategories.international);
    }
  }
  
  // Call it immediately
  renderNavDropdowns();

  // ---- DYNAMIC STYLE COUNTS (HOMEPAGE) ----
  function updateStyleCounts() {
    if (!window.tourData) return;
    const catCards = document.querySelectorAll('.cat-card');
    if (!catCards.length) return;

    catCards.forEach(card => {
      const nameEl = card.querySelector('.cat-name');
      const countEl = card.querySelector('.cat-count');
      if (!nameEl || !countEl) return;

      const styleName = nameEl.textContent.trim().toLowerCase();
      let count = 0;

      for (const [, pkg] of Object.entries(window.tourData)) {
        const pkgStyle = (pkg.style || '').toLowerCase();
        const fallback = ((pkg.title||'') + ' ' + (pkg.overviewText||'')).toLowerCase();
        
        if (pkgStyle === styleName || pkgStyle.includes(styleName) || fallback.includes(styleName)) {
          count++;
        }
      }

      countEl.textContent = `${count} package${count !== 1 ? 's' : ''}`;
    });
  }

  updateStyleCounts();

  // ---- BACK TO TOP ----
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ---- DYNAMIC PACKAGE RENDERING & FILTERING ----
  const dynamicGrid   = document.getElementById('dynamic-pkg-grid');
  const applyFiltersBtn = document.getElementById('applyFiltersBtn');
  const toursCount    = document.querySelector('.tours-count strong');
  const priceRange    = document.getElementById('priceRange');
  const priceDisplay  = document.getElementById('priceDisplay');
  const sortSelect    = document.getElementById('sortSelect');

  // ---- HELPERS ----
  function getPrice(pkg) {
    if (!pkg.price) return 0;
    return parseInt(pkg.price.replace(/[^0-9]/g, ''), 10) || 0;
  }
  function getNights(pkg) {
    const m = pkg.meta && pkg.meta.match(/(\d+)N/);
    return m ? parseInt(m[1], 10) : 0;
  }

  // ---- RENDER ----
  function renderPackages(data, sortBy) {
    if (!dynamicGrid) return;
    sortBy = sortBy || 'recommended';
    let entries = Object.entries(data || {});

    // Sort
    if      (sortBy === 'price-low')      entries.sort((a, b) => getPrice(a[1]) - getPrice(b[1]));
    else if (sortBy === 'price-high')     entries.sort((a, b) => getPrice(b[1]) - getPrice(a[1]));
    else if (sortBy === 'duration-short') entries.sort((a, b) => getNights(a[1]) - getNights(b[1]));
    else if (sortBy === 'duration-long')  entries.sort((a, b) => getNights(b[1]) - getNights(a[1]));

    // Clear
    dynamicGrid.innerHTML = '';

    // No results
    if (entries.length === 0) {
      dynamicGrid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:70px 20px;">
          <div style="font-size:52px;margin-bottom:18px;">&#128269;</div>
          <h3 style="font-family:'Playfair Display',serif;font-size:1.5rem;color:var(--primary);margin-bottom:12px;">No packages found</h3>
          <p style="color:var(--text-muted);max-width:380px;margin:0 auto 28px;">Try adjusting your filters or reset them to see all available tours.</p>
          <button class="btn btn-primary" onclick="window.resetFilters&&window.resetFilters()">&#8635; Reset Filters</button>
        </div>`;
      if (toursCount) toursCount.textContent = '0';
      return;
    }

    if (toursCount) toursCount.textContent = entries.length;

    entries.forEach(([id, pkg], i) => {
      const delay   = i % 3 === 1 ? 'fade-up-delay-1' : i % 3 === 2 ? 'fade-up-delay-2' : '';
      const badge   = pkg.category === 'group'
        ? `<span class="pkg-badge group">Group Tour</span>`
        : `<span class="pkg-badge">Recommended</span>`;
      const image   = pkg.heroImage || '';
      const price   = pkg.price   || 'Contact us';
      const depart  = pkg.departure || (pkg.meta && pkg.meta.split('\u2022')[1]) || '';

      dynamicGrid.insertAdjacentHTML('beforeend', `
        <div class="pkg-card fade-up visible ${delay}" data-category="${pkg.category||'domestic'}">
          <div class="pkg-img-wrap">
            <div class="pkg-placeholder" style="height:100%;background-image:url('${image}');background-size:cover;background-position:center;"></div>
            ${badge}
          </div>
          <div class="pkg-body">
            <div class="pkg-meta"><span class="pkg-duration">${pkg.meta ? pkg.meta.split('\u2022')[0] : ''}</span></div>
            <h3 class="pkg-title">${pkg.title||''}</h3>
            <p class="pkg-locations">${depart}</p>
            <div class="pkg-footer">
              <div class="pkg-price"><div class="current">${price} <span class="per">/ person</span></div></div>
              <a href="tour-detail.html?pkg=${id}" class="btn btn-primary pkg-btn">View Details</a>
            </div>
          </div>
        </div>`);
    });
  }

  // ---- FILTER ----
  function applyFilters() {
    if (!window.tourData) return;

    const selectedTypes     = Array.from(document.querySelectorAll('input[name="type"]:checked')).map(el => el.value);
    const selectedDurations = Array.from(document.querySelectorAll('input[name="duration"]:checked')).map(el => el.value);
    const selectedRegions   = Array.from(document.querySelectorAll('input[name="region"]:checked')).map(el => el.value);
    const selectedStyles    = Array.from(document.querySelectorAll('input[name="style"]:checked')).map(el => el.value);
    const maxPrice          = priceRange ? parseInt(priceRange.value, 10) : 999999;
    const sortBy            = sortSelect  ? sortSelect.value : 'recommended';

    const filtered = Object.fromEntries(
      Object.entries(window.tourData).filter(([, pkg]) => {

        // 1. Type
        if (selectedTypes.length && !selectedTypes.includes('all')) {
          const t = (pkg.category || 'domestic').toLowerCase();
          if (!selectedTypes.some(s => s.toLowerCase() === t)) return false;
        }

        // 2. Price
        const price = getPrice(pkg);
        if (price > 0 && price > maxPrice) return false;

        // 3. Duration
        if (selectedDurations.length) {
          const nights = getNights(pkg);
          const days   = nights + 1;
          const ok = selectedDurations.some(d => {
            if (d === '1-3')  return days >= 1  && days <= 3;
            if (d === '4-6')  return days >= 4  && days <= 6;
            if (d === '7-10') return days >= 7  && days <= 10;
            if (d === '10+')  return days > 10;
            return false;
          });
          if (!ok) return false;
        }

        // 4. Region — exact field match first, then fuzzy fallback
        if (selectedRegions.length) {
          const pkgRegion = (pkg.region || '').toLowerCase();
          const fallback  = ((pkg.meta||'') + ' ' + (pkg.title||'')).toLowerCase();
          const ok = selectedRegions.some(r => {
            const rl = r.toLowerCase();
            return pkgRegion === rl || pkgRegion.includes(rl) || fallback.includes(rl);
          });
          if (!ok) return false;
        }

        // 5. Style — exact field match first, then fuzzy fallback
        if (selectedStyles.length) {
          const pkgStyle = (pkg.style || '').toLowerCase();
          const fallback = ((pkg.title||'') + ' ' + (pkg.overviewText||'')).toLowerCase();
          const ok = selectedStyles.some(s => {
            const sl = s.toLowerCase();
            return pkgStyle === sl || pkgStyle.includes(sl) || fallback.includes(sl);
          });
          if (!ok) return false;
        }

        return true;
      })
    );

    renderPackages(filtered, sortBy);
  }

  // ---- RESET ----
  function resetFilters() {
    document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    const allBtn = document.getElementById('type-all');
    if (allBtn) allBtn.checked = true;
    if (priceRange) {
      priceRange.value = priceRange.max;
      if (priceDisplay) priceDisplay.textContent = '\u20b9' + parseInt(priceRange.max, 10).toLocaleString('en-IN');
    }
    if (sortSelect) sortSelect.value = 'recommended';
    renderPackages(window.tourData);
    if (toursCount) toursCount.textContent = Object.keys(window.tourData || {}).length;
  }
  window.resetFilters = resetFilters;

  // ---- BOOT ----
  if (dynamicGrid && window.tourData) {

    // Set initial price display
    if (priceRange && priceDisplay) {
      priceDisplay.textContent = '\u20b9' + parseInt(priceRange.value, 10).toLocaleString('en-IN');
    }

    // Initial render
    renderPackages(window.tourData);

    // Apply button
    if (applyFiltersBtn) applyFiltersBtn.addEventListener('click', applyFilters);

    // Sort dropdown
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);

    // Price slider — real-time
    if (priceRange) {
      priceRange.addEventListener('input', () => {
        if (priceDisplay) priceDisplay.textContent = '\u20b9' + parseInt(priceRange.value, 10).toLocaleString('en-IN');
        applyFilters();
      });
    }

    // Checkboxes — real-time with 'All Tours' mutual-exclusion logic
    document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.name === 'type') {
          if (cb.id === 'type-all' && cb.checked) {
            // 'All' ticked → uncheck all specific types
            document.querySelectorAll('input[name="type"]').forEach(i => { if (i.id !== 'type-all') i.checked = false; });
          } else if (cb.checked) {
            // Specific type ticked → uncheck 'All'
            const allBtn = document.getElementById('type-all');
            if (allBtn) allBtn.checked = false;
          }
        }
        applyFilters();
      });
    });

    // URL params on load (?type=group, ?style=Adventure)
    const params    = new URLSearchParams(window.location.search);
    const typeParam = params.get('type');
    const styleParam= params.get('style');
    if (typeParam) {
      const cb = document.querySelector(`input[name="type"][value="${typeParam}"]`);
      if (cb) {
        const all = document.getElementById('type-all');
        if (all && typeParam !== 'all') all.checked = false;
        cb.checked = true;
        applyFilters();
      }
    }
    if (styleParam) {
      const cb = document.querySelector(`input[name="style"][value="${styleParam}"]`);
      if (cb) { cb.checked = true; applyFilters(); }
    }

  } else {
    if (dynamicGrid) dynamicGrid.innerHTML = '<p style="padding:40px;text-align:center;color:var(--text-muted);">Tour data could not be loaded. Please refresh the page.</p>';
    console.error('Filter init failed: dynamicGrid=' + !!dynamicGrid + ', tourData=' + !!window.tourData);
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

  // Price range slider is handled inside the dynamicGrid block above

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
