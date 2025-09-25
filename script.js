function $(sel,root=document){return root.querySelector(sel)}
function $all(sel,root=document){return Array.from(root.querySelectorAll(sel))}
function formatPriceINR(value){return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(value)}

// Theme switching
const rootEl = document.documentElement;
const THEME_KEY = 't2t-theme';
function applyTheme(theme){
  rootEl.setAttribute('data-theme', theme);
}
function initTheme(){
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || 'light');
}
initTheme();
document.getElementById('themeToggle')?.addEventListener('click', ()=>{
  const current = rootEl.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});

// Render cards
const grid = document.getElementById('grid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterChips = $all('.filter-chip');

let activeFilter = 'all';
let query = '';

function matchesFilter(stay){
  if(activeFilter === 'all') return true;
  if(activeFilter === 'villa' || activeFilter === 'resort') return stay.type === activeFilter;
  return (stay.tags || []).includes(activeFilter);
}
function matchesQuery(stay){
  if(!query) return true;
  const q = query.toLowerCase();
  return (
    stay.name.toLowerCase().includes(q) ||
    stay.area.toLowerCase().includes(q) ||
    stay.city.toLowerCase().includes(q)
  );
}

function render(stays){
  if(!grid) return;
  const items = (stays||[]).filter(matchesFilter).filter(matchesQuery);
  if(items.length === 0){
    grid.innerHTML = `<div class="muted" style="grid-column:1/-1;padding:14px;border:1px dashed rgba(255,255,255,.15);border-radius:12px">No stays match your search.</div>`;
    return;
  }
  grid.innerHTML = items.map(s=>`
    <article class="card">
      <a href="${s.type==='villa' ? (s.id==='v1' ? 'arabian-vista-villa.html' : s.id==='v2' ? 'palm-grove-estate.html' : s.id==='v3' ? 'sea-cliff-mansion.html' : 'villa.html') : (s.id==='r1' ? 'bayfront-royale-resort.html' : s.id==='r2' ? 'conrad-marine-bay.html' : s.id==='r3' ? 'lotus-cove-retreat.html' : 'details.html')}?id=${s.id}" class="card-media">
        <img src="${s.image}" alt="${s.name}">
        <span class="badge">⭐ ${s.rating}</span>
      </a>
      <div class="card-body">
        <div class="card-title">
          <h4>${s.name}</h4>
          <strong>${formatPriceINR(s.price)}</strong>
        </div>
        <div class="card-meta">${s.area}, ${s.city} • ${s.type.toUpperCase()} • ${s.bedrooms} BR • ${s.bathrooms} BA</div>
        <div class="tags">${(s.tags||[]).slice(0,3).map(t=>`<span class="tag">${t.replace('-', ' ')}</span>`).join('')}</div>
        <div class="card-actions">
          <a class="btn btn-outline" href="${s.type==='villa' ? (s.id==='v1' ? 'arabian-vista-villa.html' : s.id==='v2' ? 'palm-grove-estate.html' : s.id==='v3' ? 'sea-cliff-mansion.html' : 'villa.html') : (s.id==='r1' ? 'bayfront-royale-resort.html' : s.id==='r2' ? 'conrad-marine-bay.html' : s.id==='r3' ? 'lotus-cove-retreat.html' : 'details.html')}?id=${s.id}">View</a>
          <button class="btn btn-primary" data-book="${s.id}">Book</button>
        </div>
      </div>
    </article>
  `).join('');

  // Bind book buttons
  $all('[data-book]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const stay = window.STAYS.find(s=>s.id===btn.getAttribute('data-book'));
      if(stay) openBooking(stay);
    });
  });

  // Remove automatic booking modal on page load
  // if(stay) openBooking(stay);
}

// Suggestions via tiny React widget already present
const suggestRoot = document.getElementById('suggestRoot');
function updateSuggestions(){
  if(!suggestRoot || !window.Trip2TripSuggestions) return;
  window.Trip2TripSuggestions.mount(suggestRoot, window.STAYS, (picked)=>{
    query = picked;
    if(searchInput) searchInput.value = picked;
    render(window.STAYS);
    window.Trip2TripSuggestions.unmount(suggestRoot);
  }, query);
}

// Events
filterChips.forEach(c=>c.addEventListener('click',()=>{
  filterChips.forEach(x=>x.classList.remove('is-active'));
  c.classList.add('is-active');
  // trigger left-to-right sweep animation
  c.classList.remove('sweep');
  // force reflow to restart animation
  void c.offsetWidth;
  c.classList.add('sweep');
  activeFilter = c.getAttribute('data-type');
  render(window.STAYS);
}));

if(searchInput){
  searchInput.addEventListener('input', (e)=>{
    query = e.target.value.trim();
    updateSuggestions();
    render(window.STAYS);
  });
}
if(searchBtn){
  searchBtn.addEventListener('click',()=>{
    query = (searchInput?.value||'').trim();
    render(window.STAYS);
  });
}

// Initial render
if(window.STAYS) render(window.STAYS);

// Booking modal logic (shared with details)
const bookingDialog = document.getElementById('bookingDialog');
const bookingTitle = document.getElementById('bookingTitle');
const bookingSubtitle = document.getElementById('bookingSubtitle');
const bookingMedia = document.getElementById('bookingMedia');
const bookingStatus = document.getElementById('bookingStatus');

function openBooking(item){
  if(!bookingDialog) return;
  bookingTitle.textContent = `Book ${item.name}`;
  bookingSubtitle.textContent = `${item.area} • ${item.type.toUpperCase()} • ${formatPriceINR(item.price)} / night`;
  bookingMedia.style.backgroundImage = `url(${item.image})`;
  document.getElementById('bookingForm').setAttribute('data-stay-id', item.id);
  if(typeof bookingDialog.showModal === 'function') bookingDialog.showModal();
  else bookingDialog.setAttribute('open','');
}

document.getElementById('bookingForm')?.addEventListener('submit', e=>{
  e.preventDefault();
  const inDate = document.getElementById('checkIn').value;
  const outDate = document.getElementById('checkOut').value;
  const guests = document.getElementById('guestCount').value;
  const name = document.getElementById('guestName').value.trim();
  const phone = document.getElementById('guestPhone').value.trim();
  if(!inDate || !outDate || !name || !phone){
    bookingStatus.textContent = 'Please fill all required details.';
    return;
  }
  // Store booking
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if(user){
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const stayId = e.target.getAttribute('data-stay-id'); // Need to set this
    bookings.push({userEmail: user.email, stayId, checkIn: inDate, checkOut: outDate, guests, name, phone, date: new Date().toISOString()});
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }
  bookingStatus.textContent = 'Request sent! Our concierge will reach out shortly.';
  setTimeout(()=>{
    bookingDialog.close();
    bookingStatus.textContent = '';
    e.target.reset();
  }, 1200);
});

document.querySelector('.dialog-close')?.addEventListener('click', ()=>{
  bookingDialog.close();
});

// Page transition animation
let pageTransition = document.getElementById('pageTransition');
function ensureTransitionOverlay(){
  pageTransition = document.getElementById('pageTransition');
  if(pageTransition) return pageTransition;
  const div = document.createElement('div');
  div.id = 'pageTransition';
  div.className = 'page-transition active';
  div.innerHTML = `
    <div class="walking-person">
      <div class="person">
        <div class="head"></div>
        <div class="body"></div>
        <div class="arm-left"></div>
        <div class="arm-right"></div>
        <div class="leg-left"></div>
        <div class="leg-right"></div>
      </div>
      <div class="suitcase"></div>
    </div>
    <div class="transition-text">Loading your next adventure...</div>
  `;
  document.body.appendChild(div);
  pageTransition = div;
  return pageTransition;
}
function showTransition(){
  if(!pageTransition) ensureTransitionOverlay();
  if(pageTransition) pageTransition.classList.add('active');
}
function hideTransition(){
  if(pageTransition) pageTransition.classList.remove('active');
}

// Add transition to all internal links
document.addEventListener('click', (e)=>{
  const link = e.target.closest('a');
  if(!link) return;
  
  const href = link.getAttribute('href');
  // Only animate for internal links (not external or hash links)
  if(href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto:')){
    e.preventDefault();
    showTransition();
    
    // Navigate after animation starts (faster for mobile)
    const delay = window.innerWidth <= 768 ? 300 : 600; // Shorter delay on mobile
    setTimeout(()=>{
      window.location.href = href;
    }, delay);
  }
});

// Initial load: show overlay until page fully loaded
document.addEventListener('DOMContentLoaded', ()=>{
  ensureTransitionOverlay();
  // Show overlay on initial page load for animation of person with suitcase going left to right
  showTransition();
});
window.addEventListener('load', ()=>{
  setTimeout(hideTransition, 900);
});

// Hero showcase click → navigate to details with transition
document.addEventListener('DOMContentLoaded', ()=>{
  const hero = document.querySelector('.hero-showcase');
  if(!hero) return;
  hero.addEventListener('click', (e)=>{
    const tile = e.target.closest('.showcase-main, .showcase-item');
    if(!tile) return;
    const id = tile.getAttribute('data-id');
    if(!id) return;
    const stay = (window.STAYS||[]).find(s=>s.id===id);
    let page = 'details.html';
    if(stay){
      if(stay.type==='villa'){
        page = stay.id==='v1' ? 'arabian-vista-villa.html' : stay.id==='v2' ? 'palm-grove-estate.html' : stay.id==='v3' ? 'sea-cliff-mansion.html' : 'villa.html';
      } else {
        page = stay.id==='r1' ? 'bayfront-royale-resort.html' : stay.id==='r2' ? 'conrad-marine-bay.html' : stay.id==='r3' ? 'lotus-cove-retreat.html' : 'details.html';
      }
    }
    showTransition();
    setTimeout(()=>{ window.location.href = `${page}?id=${id}`; }, 600);
  });
});

// Global click shimmer trigger for interactive elements
document.addEventListener('click', (e)=>{
  const el = e.target.closest('a, button, .btn, .filter-chip, .collection, .card, .showcase-item, .showcase-main, .menu a, .footer a, .brand');
  if(!el) return;
  el.classList.remove('sheen-run');
  void el.offsetWidth;
  el.classList.add('sheen-run');
  setTimeout(()=>el.classList.remove('sheen-run'), 900);
});



function initNavigation() {
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

  // Toggle mobile menu
  function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';

    // Animate hamburger lines
    const lines = mobileMenuToggle.querySelectorAll('.hamburger-line');
    if (mobileMenu.classList.contains('active')) {
      lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      lines[1].style.opacity = '0';
      lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
      lines[0].style.transform = 'none';
      lines[1].style.opacity = '1';
      lines[2].style.transform = 'none';
    }
  }

  // Close mobile menu
  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';

    // Reset hamburger lines
    const lines = mobileMenuToggle.querySelectorAll('.hamburger-line');
    lines[0].style.transform = 'none';
    lines[1].style.opacity = '1';
    lines[2].style.transform = 'none';
  }

  // Event listeners
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }

  // Close menu when clicking on links
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close menu when clicking outside
  mobileMenu?.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      closeMobileMenu();
    }
  });

  // Handle mobile theme toggle
  const mobileThemeToggle = document.getElementById('mobileThemeToggle');
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', () => {
      const current = rootEl.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
      closeMobileMenu();
    });
  }

  // Close mobile menu on window resize if it becomes desktop size
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // Prevent scroll when mobile menu is open
  document.addEventListener('touchmove', (e) => {
    if (mobileMenu.classList.contains('active')) {
      e.preventDefault();
    }
  }, { passive: false });
}



