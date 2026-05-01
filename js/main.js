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

  // ---- BACK TO TOP ----
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ---- DYNAMIC PACKAGE RENDERING & FILTERING ----
  const dynamicGrid = document.getElementById('dynamic-pkg-grid');
  const applyFiltersBtn = document.getElementById('applyFiltersBtn');
  const toursCount = document.querySelector('.tours-count strong');

  function renderPackages(filteredData, sortBy = 'recommended') {
    if (!dynamicGrid) return;
    dynamicGrid.innerHTML = '';
    let delayCounter = 0;
    let dataArray = Object.entries(filteredData);
    
    if (dataArray.length === 0) {
      dynamicGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
          <h3 style="font-family:'Playfair Display',serif; font-size: 24px; margin-bottom: 12px;">No packages found</h3>
          <p style="color:var(--text-muted); margin-bottom: 24px;">Try adjusting your filters or clearing them to see more options.</p>
          <button class="btn btn-outline" onclick="location.reload()" style="border-radius:12px;">Clear All Filters</button>
        </div>
      `;
      if (toursCount) toursCount.textContent = '0';
      return;
    }

    // ---- SORTING LOGIC ----
    if (sortBy === 'price-low') {
      dataArray.sort((a, b) => {
        const priceA = parseInt(a[1].price.replace(/[^0-9]/g, '')) || 0;
        const priceB = parseInt(b[1].price.replace(/[^0-9]/g, '')) || 0;
        return priceA - priceB;
      });
    } else if (sortBy === 'price-high') {
      dataArray.sort((a, b) => {
        const priceA = parseInt(a[1].price.replace(/[^0-9]/g, '')) || 0;
        const priceB = parseInt(b[1].price.replace(/[^0-9]/g, '')) || 0;
        return priceB - priceA;
      });
    } else if (sortBy === 'duration-short') {
      dataArray.sort((a, b) => {
        const daysA = parseInt(a[1].meta.match(/(\d+)N/)?.[1] || 0);
        const daysB = parseInt(b[1].meta.match(/(\d+)N/)?.[1] || 0);
        return daysA - daysB;
      });
    } else if (sortBy === 'duration-long') {
      dataArray.sort((a, b) => {
        const daysA = parseInt(a[1].meta.match(/(\d+)N/)?.[1] || 0);
        const daysB = parseInt(b[1].meta.match(/(\d+)N/)?.[1] || 0);
        return daysB - daysA;
      });
    }
    
    if (toursCount) toursCount.textContent = dataArray.length;

    dataArray.forEach(([id, pkg]) => {
      const delayClass = delayCounter % 3 === 0 ? '' : (delayCounter % 3 === 1 ? 'fade-up-delay-1' : 'fade-up-delay-2');
      const badgeHtml = pkg.category === 'group' ? `<span class="pkg-badge group">Group Tour</span>` : 
                        (delayCounter % 2 === 0 ? `<span class="pkg-badge">Recommended</span>` : `<span class="pkg-badge sale">Popular</span>`);
      
      const priceHtml = `<div class="current">${pkg.price} <span class="per">/ person</span></div>`;
      
      const cardHTML = `
        <div class="pkg-card fade-up visible ${delayClass}" data-category="${pkg.category || 'domestic'}">
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
    });
  }

  function applyFilters() {
    const selectedTypes = Array.from(document.querySelectorAll('input[name="type"]:checked')).map(el => el.value);
    const selectedDurations = Array.from(document.querySelectorAll('input[name="duration"]:checked')).map(el => el.value);
    const selectedRegions = Array.from(document.querySelectorAll('input[name="region"]:checked')).map(el => el.value);
    const selectedStyles = Array.from(document.querySelectorAll('input[name="style"]:checked')).map(el => el.value);
    const maxPrice = parseInt(document.getElementById('priceRange').value);
    const sortBy = document.getElementById('sortSelect')?.value || 'recommended';

    const filtered = Object.fromEntries(Object.entries(window.tourData).filter(([id, pkg]) => {
      // 1. Tour Type
      const pkgType = pkg.category || 'domestic';
      if (selectedTypes.length > 0 && !selectedTypes.includes('all') && !selectedTypes.includes(pkgType)) return false;

      // 2. Budget
      const price = parseInt(pkg.price.replace(/[^0-9]/g, ''));
      if (price > maxPrice) return false;

      // 3. Duration (Roughly)
      if (selectedDurations.length > 0) {
        const days = parseInt(pkg.meta.match(/(\d+)N/)?.[1] || 0) + 1;
        const matchesDuration = selectedDurations.some(d => {
          if (d === '1-3') return days >= 1 && days <= 3;
          if (d === '4-6') return days >= 4 && days <= 6;
          if (d === '7-10') return days >= 7 && days <= 10;
          if (d === '10+') return days > 10;
          return false;
        });
        if (!matchesDuration) return false;
      }

      // 4. Region
      if (selectedRegions.length > 0) {
        const metaStr = (pkg.meta + " " + pkg.title + " " + (pkg.region || "")).toLowerCase();
        const matchesRegion = selectedRegions.some(r => metaStr.includes(r.toLowerCase()));
        if (!matchesRegion) return false;
      }

      // 5. Style
      if (selectedStyles.length > 0) {
        const textStr = (pkg.title + " " + pkg.overviewText + " " + (pkg.style || "")).toLowerCase();
        const matchesStyle = selectedStyles.some(s => textStr.includes(s.toLowerCase()));
        if (!matchesStyle) return false;
      }

      return true;
    }));

    renderPackages(filtered, sortBy);
    const layout = document.querySelector('.tours-layout');
    if (layout) window.scrollTo({ top: layout.offsetTop - 100, behavior: 'smooth' });
  }

  if (dynamicGrid && typeof window.tourData !== 'undefined') {
    console.log("Tour data loaded, initializing packages...");
    renderPackages(window.tourData);
    
    applyFiltersBtn?.addEventListener('click', () => {
      console.log("Apply Filters clicked");
      applyFilters();
    });

    document.getElementById('sortSelect')?.addEventListener('change', () => {
      console.log("Sort changed");
      applyFilters();
    });
    
    // Auto-apply when any filter changes for better UX
    document.querySelectorAll('.filter-sidebar input').forEach(input => {
      input.addEventListener('change', () => {
        if (input.type === 'checkbox') {
          // Strict Type Toggling
          if (input.name === 'type') {
            if (input.id === 'type-all' && input.checked) {
              document.querySelectorAll('input[name="type"]').forEach(i => { if (i.id !== 'type-all') i.checked = false; });
            } else if (input.checked) {
              const allBtn = document.getElementById('type-all');
              if (allBtn) allBtn.checked = false;
            }
          }
        }
        applyFilters(); // Instant update
      });
    });

    // Real-time price display update
    const priceRange = document.getElementById('priceRange');
    const priceDisplay = document.getElementById('priceDisplay');
    if (priceRange && priceDisplay) {
      priceRange.addEventListener('input', (e) => {
        const val = parseInt(e.target.value).toLocaleString('en-IN');
        priceDisplay.textContent = `₹${val}`;
        applyFilters();
      });
    }
    
    // Handle URL parameters on load
    const params = new URLSearchParams(window.location.search);
    const styleParam = params.get('style');
    const typeParam = params.get('type');
    
    if (styleParam) {
      const checkbox = document.querySelector(`input[name="style"][value="${styleParam}"]`);
      if (checkbox) {
        // Uncheck 'All' type to ensure strict filtering by style
        const allBtn = document.getElementById('type-all');
        if (allBtn) allBtn.checked = false;
        
        checkbox.checked = true;
        applyFilters();
      }
    }
    if (typeParam) {
      const checkbox = document.querySelector(`input[name="type"][value="${typeParam}"]`);
      if (checkbox) {
        if (typeParam !== 'all') {
           const allBtn = document.getElementById('type-all');
           if (allBtn) allBtn.checked = false;
        }
        checkbox.checked = true;
        applyFilters();
      }
    }
  } else {
    console.error("Critical Error: dynamicGrid or tourData not found!");
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
