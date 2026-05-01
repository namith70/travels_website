// Admin Logic

let currentEditId = null;

// ---- UI RENDERING ----
function renderTable() {
  const tbody = document.getElementById('packageTableBody');
  tbody.innerHTML = '';

  for (const [id, pkg] of Object.entries(tourData)) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><img src="${pkg.heroImage}" alt="${pkg.title}"></td>
      <td><strong>${pkg.title}</strong><br><small>${id}</small></td>
      <td><span style="background:#eee;padding:2px 8px;border-radius:12px;font-size:0.8rem;">${pkg.category || 'domestic'}</span></td>
      <td>${pkg.price}</td>
      <td>
        <button class="action-btn edit-btn" onclick="editPackage('${id}')">Edit</button>
        <button class="action-btn delete-btn" onclick="deletePackage('${id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  }
}

// ---- MODAL & TABS ----
function openPackageModal() {
  document.getElementById('packageModal').classList.add('active');
  document.getElementById('modalTitle').textContent = 'Add New Package';
  document.getElementById('packageForm').reset();
  document.getElementById('pkgSlug').disabled = false;
  currentEditId = null;
  
  // Clear dynamic lists
  document.getElementById('itineraryList').innerHTML = '';
  document.getElementById('inclusionsList').innerHTML = '';
  document.getElementById('exclusionsList').innerHTML = '';
  document.getElementById('faqList').innerHTML = '';
  document.getElementById('expectList').innerHTML = '';
  document.getElementById('suggestionsList').innerHTML = '';
}

function closePackageModal() {
  document.getElementById('packageModal').classList.remove('active');
}

// ---- DYNAMIC LISTS ----

function addItineraryDay(dayStr = '', descStr = '') {
  const list = document.getElementById('itineraryList');
  const div = document.createElement('div');
  div.className = 'dynamic-item itinerary-item';
  div.innerHTML = `
    <button type="button" class="remove-btn" onclick="this.parentElement.remove()">✕</button>
    <div class="form-group" style="margin-bottom:8px;">
      <label>Day Title (e.g. Day 1: Arrival)</label>
      <input type="text" class="itin-day" value="${dayStr}" required>
    </div>
    <div class="form-group">
      <label>Description</label>
      <textarea class="itin-desc" rows="2" required>${descStr}</textarea>
    </div>
  `;
  list.appendChild(div);
}

function addListStringItem(containerId, value = '') {
  const list = document.getElementById(containerId);
  const div = document.createElement('div');
  div.className = 'dynamic-string-item';
  div.innerHTML = `
    <input type="text" value="${value}" required>
    <button type="button" class="remove-btn" onclick="this.parentElement.remove()">✕</button>
  `;
  list.appendChild(div);
}

function addFAQ(questionStr = '', answerStr = '') {
  const list = document.getElementById('faqList');
  const div = document.createElement('div');
  div.className = 'dynamic-item faq-item';
  div.innerHTML = `
    <button type="button" class="remove-btn" onclick="this.parentElement.remove()">✕</button>
    <div class="form-group" style="margin-bottom:8px;">
      <label>Question</label>
      <input type="text" class="faq-q" value="${questionStr}" required>
    </div>
    <div class="form-group">
      <label>Answer</label>
      <textarea class="faq-a" rows="2" required>${answerStr}</textarea>
    </div>
  `;
  list.appendChild(div);
}

// ---- CRUD OPERATIONS ----

function editPackage(id) {
  const pkg = tourData[id];
  if (!pkg) return;

  currentEditId = id;
  document.getElementById('modalTitle').textContent = 'Edit Package';
  document.getElementById('pkgSlug').value = id;
  document.getElementById('pkgSlug').disabled = true;
  document.getElementById('pkgTitle').value = pkg.title || '';
  document.getElementById('pkgPrice').value = pkg.price || '';
  document.getElementById('pkgMeta').value = pkg.meta || '';
  document.getElementById('pkgDeparture').value = pkg.departure || '';
  document.getElementById('pkgCategory').value = pkg.category || 'domestic';
  document.getElementById('pkgImage').value = pkg.heroImage || '';
  document.getElementById('pkgOverview').value = pkg.overviewText || '';
  document.getElementById('pkgNights').value = pkg.nights || '';
  document.getElementById('pkgType').value = pkg.type || '';
  document.getElementById('pkgRegion').value = pkg.region || '';
  document.getElementById('pkgStyle').value = pkg.style || '';

  // Populate Expectations & Suggestions
  document.getElementById('expectList').innerHTML = '';
  if (pkg.expect) {
    pkg.expect.forEach(e => addListStringItem('expectList', e));
  }

  document.getElementById('suggestionsList').innerHTML = '';
  if (pkg.suggestions) {
    pkg.suggestions.forEach(s => addListStringItem('suggestionsList', s));
  }

  // Populate Itinerary
  document.getElementById('itineraryList').innerHTML = '';
  if (pkg.itinerary) {
    pkg.itinerary.forEach(i => addItineraryDay(i.day, i.desc));
  }

  // Populate Inclusions & Exclusions
  document.getElementById('inclusionsList').innerHTML = '';
  if (pkg.inclusions) {
    pkg.inclusions.forEach(i => addListStringItem('inclusionsList', i));
  }
  
  document.getElementById('exclusionsList').innerHTML = '';
  if (pkg.exclusions) {
    pkg.exclusions.forEach(e => addListStringItem('exclusionsList', e));
  }

  // Populate FAQ
  document.getElementById('faqList').innerHTML = '';
  if (pkg.faq) {
    pkg.faq.forEach(f => addFAQ(f.q, f.a));
  }

  document.getElementById('packageModal').classList.add('active');
}

function deletePackage(id) {
  if (confirm(`Are you sure you want to delete package: ${id}?`)) {
    delete tourData[id];
    saveTourData(tourData);
    renderTable();
  }
}

function handleFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('pkgSlug').value.trim();
  if (!id) return alert('Package ID is required');

  // Collect Itinerary
  const itinerary = [];
  document.querySelectorAll('.itinerary-item').forEach(item => {
    itinerary.push({
      day: item.querySelector('.itin-day').value,
      desc: item.querySelector('.itin-desc').value
    });
  });

  // Collect Inclusions
  const inclusions = [];
  document.querySelectorAll('#inclusionsList .dynamic-string-item input').forEach(input => {
    if (input.value.trim()) inclusions.push(input.value.trim());
  });

  // Collect Exclusions
  const exclusions = [];
  document.querySelectorAll('#exclusionsList .dynamic-string-item input').forEach(input => {
    if (input.value.trim()) exclusions.push(input.value.trim());
  });

  // Collect FAQ
  const faq = [];
  document.querySelectorAll('.faq-item').forEach(item => {
    faq.push({
      q: item.querySelector('.faq-q').value,
      a: item.querySelector('.faq-a').value
    });
  });

  // Collect Expectations & Suggestions
  const expect = [];
  document.querySelectorAll('#expectList .dynamic-string-item input').forEach(input => {
    if (input.value.trim()) expect.push(input.value.trim());
  });

  const suggestions = [];
  document.querySelectorAll('#suggestionsList .dynamic-string-item input').forEach(input => {
    if (input.value.trim()) suggestions.push(input.value.trim());
  });

  const pkg = {
    title: document.getElementById('pkgTitle').value,
    price: document.getElementById('pkgPrice').value,
    meta: document.getElementById('pkgMeta').value,
    departure: document.getElementById('pkgDeparture').value,
    category: document.getElementById('pkgCategory').value,
    region: document.getElementById('pkgRegion').value,
    style: document.getElementById('pkgStyle').value,
    heroImage: document.getElementById('pkgImage').value,
    overviewText: document.getElementById('pkgOverview').value,
    nights: document.getElementById('pkgNights').value,
    type: document.getElementById('pkgType').value,
    itinerary: itinerary,
    inclusions: inclusions,
    exclusions: exclusions,
    faq: faq,
    expect: expect,
    suggestions: suggestions
  };

  tourData[id] = pkg;
  saveTourData(tourData);
  
  closePackageModal();
  renderTable();
}

// ============================================
// CATEGORIES LOGIC
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  renderTable();
  document.getElementById('packageForm').addEventListener('submit', handleFormSubmit);

  // Categories init
  renderAdminCategories();
  populateSubRegionSelect();
  document.getElementById('catMainRegion')?.addEventListener('change', populateSubRegionSelect);
  document.getElementById('addCategoryForm')?.addEventListener('submit', handleAddCategory);
});

function switchAdminTab(tab) {
  document.getElementById('packagesTab').style.display = tab === 'packages' ? 'block' : 'none';
  document.getElementById('categoriesTab').style.display = tab === 'categories' ? 'block' : 'none';
  
  document.getElementById('navPackages').classList.toggle('active', tab === 'packages');
  document.getElementById('navCategories').classList.toggle('active', tab === 'categories');

  document.getElementById('adminMainTitle').textContent = tab === 'packages' ? 'Manage Tour Packages' : 'Manage Destinations';
  document.getElementById('adminMainActionBtn').style.display = tab === 'packages' ? 'inline-flex' : 'none';
}

function renderAdminCategories() {
  const catIndia = document.getElementById('catListIndia');
  const catIntl = document.getElementById('catListIntl');
  if (!catIndia || !catIntl || !window.navCategories) return;

  const buildList = (regionKey) => {
    let html = '';
    for (const [subRegion, places] of Object.entries(window.navCategories[regionKey] || {})) {
      html += `<div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">`;
      html += `<h5 style="margin:0 0 10px; font-size:0.8rem; text-transform:uppercase; color:#64748b;">${subRegion}</h5>`;
      
      if (places.length === 0) {
        html += `<div style="font-size:0.85rem; color:#94a3b8; font-style:italic;">No destinations</div>`;
      } else {
        places.forEach((place, index) => {
          html += `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:8px; background:#fff; border:1px solid #eee; border-radius:6px; margin-bottom:6px;">
              <span style="font-size:0.9rem; font-weight:500;">${place.name}</span>
              <button onclick="deleteCategory('${regionKey}', '${subRegion}', ${index})" style="background:none; border:none; color:#e74c3c; cursor:pointer; font-size:1.1rem; line-height:1;" title="Remove">✕</button>
            </div>
          `;
        });
      }
      html += `</div>`;
    }
    return html;
  };

  catIndia.innerHTML = buildList('india');
  catIntl.innerHTML = buildList('international');
}

function populateSubRegionSelect() {
  const region = document.getElementById('catMainRegion')?.value;
  const subSelect = document.getElementById('catSubRegion');
  if (!region || !subSelect || !window.navCategories) return;

  subSelect.innerHTML = '';
  const subRegions = Object.keys(window.navCategories[region] || {});
  subRegions.forEach(sub => {
    const opt = document.createElement('option');
    opt.value = sub;
    opt.textContent = sub;
    subSelect.appendChild(opt);
  });
}

function handleAddCategory(e) {
  e.preventDefault();
  const nameInput = document.getElementById('catName');
  const region = document.getElementById('catMainRegion').value;
  const subRegion = document.getElementById('catSubRegion').value;
  
  const name = nameInput.value.trim();
  if (!name) return;

  // Generate ID/Slug
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '');

  if (!window.navCategories[region][subRegion]) {
    window.navCategories[region][subRegion] = [];
  }
  
  window.navCategories[region][subRegion].push({ name, id });
  
  if (typeof saveNavCategories === 'function') {
    saveNavCategories(window.navCategories);
  }

  nameInput.value = '';
  renderAdminCategories();
  alert(`${name} added to ${subRegion} (${region})`);
}

function deleteCategory(region, subRegion, index) {
  const place = window.navCategories[region][subRegion][index];
  if (confirm(`Remove "${place.name}" from ${subRegion}?`)) {
    window.navCategories[region][subRegion].splice(index, 1);
    if (typeof saveNavCategories === 'function') {
      saveNavCategories(window.navCategories);
    }
    renderAdminCategories();
  }
}

