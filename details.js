function $(sel,root=document){return root.querySelector(sel)}
function $all(sel,root=document){return Array.from(root.querySelectorAll(sel))}
function formatPriceINR(value){
  return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(value);
}
function getParam(name){
  const u = new URL(location.href);
  return u.searchParams.get(name);
}

const id = window.PAGE_ID || getParam('id');
const stay = window.STAYS.find(s=>s.id===id);
const root = $('#detailsRoot');

if(!stay){
  root.innerHTML = `<div class="muted" style="padding:20px;border:1px dashed rgba(255,255,255,.15);border-radius:12px">Stay not found.</div>`;
} else {
  renderVilla(stay);
}

function renderVilla(s){
  root.innerHTML = `
    <div class="section-header" style="padding-top:10px">
      <h2 style="margin-bottom:6px">${s.name}</h2>
      <p class="muted">${s.address || `${s.area}, ${s.city}, ${s.state}`} • ${s.bedrooms} BR • ${s.bathrooms} BA • Up to ${s.guests} guests • ⭐ ${s.rating}</p>
    </div>
    <div class="grid" style="grid-template-columns:2fr 1fr; gap:20px">
      <div>
        <div class="media-grid" style="grid-template-columns:repeat(2,1fr); gap:10px; margin-bottom:14px">
          ${(s.gallery||[]).map((url,i)=>`<img src="${url}" alt="Photo ${i+1} of ${s.name}" style="width:100%;height:260px;object-fit:cover;border-radius:12px;border:1px solid rgba(255,255,255,.08)">`).join('')}
        </div>
        ${s.video ? `
        <div class="why-card" style="margin-bottom:12px">
          <video src="${s.video}" controls style="width:100%;border-radius:12px;display:block"></video>
        </div>` : ''}
        <div class="why-card">
          <h4 style="margin:0 0 8px">Overview</h4>
          <p class="muted">Experience ${s.name}, a premium ${s.type} in ${s.area}. Amenities include ${(s.amenities||[]).slice(0,4).join(', ')} and more. Concierge support is included with every booking.</p>
          <div class="tags" style="margin-top:12px">${(s.tags||[]).map(t=>`<span class="tag">${t.replace('-', ' ')}</span>`).join('')}</div>
        </div>
      </div>
      <aside>
        <div class="why-card">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <strong style="font-size:20px">${new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(s.price)}</strong>
            <span class="muted">per night</span>
          </div>
          <button class="btn btn-primary btn-full" id="bookNow">Book This Stay</button>
          <div class="muted" style="margin-top:10px">Best rate guaranteed when you book direct.</div>
        </div>
        <div class="why-card" style="margin-top:12px">
          <h4 style="margin:0 0 8px">Contact Owner</h4>
          <p class="muted" style="margin:0 0 10px">${(s.owner?.name)||'Owner'} • ${(s.area)}, ${(s.city)}</p>
          <div style="display:grid;gap:8px">
            <a class="btn btn-outline" href="tel:${encodeURIComponent(s.owner?.phone||'')}">Call ${s.owner?.phone||''}</a>
            <a class="btn btn-outline" href="https://wa.me/${(s.owner?.phone||'').replace(/[^0-9]/g,'')}?text=${encodeURIComponent('Hello, I am interested in '+s.name)}" target="_blank" rel="noreferrer">WhatsApp</a>
            <a class="btn btn-outline" href="mailto:${s.owner?.email||''}?subject=${encodeURIComponent('Inquiry: '+s.name)}">Email</a>
          </div>
        </div>
        <div class="why-card" style="margin-top:12px">
          <h4 style="margin:0 0 8px">Location</h4>
          <p class="muted">${s.address || `${s.area}, ${s.city} • Maharashtra`}</p>
          <a class="btn btn-outline btn-full" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((s.address||'') || (s.name + ' ' + s.area + ' ' + s.city))}" target="_blank" rel="noreferrer">Open in Google Maps</a>
        </div>
      </aside>
    </div>
  `;

  $('#bookNow').addEventListener('click',()=>openBooking(s));

  // Image gallery functionality
  const galleryImages = $all('.media-grid img');
  let currentImageIndex = 0;
  const gallery = s.gallery || [];

  // Create image modal with side scroll
  const imageModal = document.createElement('div');
  imageModal.className = 'image-modal';
  imageModal.innerHTML = `
    <div class="image-modal-content">
      <button class="image-modal-close" aria-label="Close image">×</button>
      <button class="image-modal-nav image-modal-prev" aria-label="Previous image">‹</button>
      <button class="image-modal-nav image-modal-next" aria-label="Next image">›</button>
      <img class="image-modal-img" src="" alt="">
      <div class="image-modal-counter">1 / ${gallery.length}</div>
      <div class="image-modal-thumbnails">
        ${gallery.map((url, i) => `<img src="${url}" alt="Thumbnail ${i+1}" class="image-modal-thumb" data-index="${i}">`).join('')}
      </div>
    </div>
  `;
  document.body.appendChild(imageModal);

  // Add click event to gallery images
  galleryImages.forEach((img, index) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      currentImageIndex = index;
      openImageModal(gallery[currentImageIndex]);
    });
  });

  // Modal navigation functions
  function openImageModal(src) {
    const modalImg = imageModal.querySelector('.image-modal-img');
    const counter = imageModal.querySelector('.image-modal-counter');
    const thumbnails = imageModal.querySelectorAll('.image-modal-thumb');

    // Set loading state
    modalImg.src = '';
    modalImg.src = src;
    counter.textContent = `${currentImageIndex + 1} / ${gallery.length}`;

    // Update thumbnail selection
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === currentImageIndex);
    });

    // Show modal only after image is loaded
    modalImg.onload = () => {
      imageModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    };

    // If image fails to load, show modal anyway after a timeout
    modalImg.onerror = () => {
      imageModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    };
  }

  function closeImageModal() {
    imageModal.style.display = 'none';
    document.body.style.overflow = '';
  }

  function showPrevImage() {
    currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : gallery.length - 1;
    openImageModal(gallery[currentImageIndex]);
  }

  function showNextImage() {
    currentImageIndex = currentImageIndex < gallery.length - 1 ? currentImageIndex + 1 : 0;
    openImageModal(gallery[currentImageIndex]);
  }

  // Thumbnail click handler
  imageModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('image-modal-thumb')) {
      currentImageIndex = parseInt(e.target.dataset.index);
      openImageModal(gallery[currentImageIndex]);
    }
  });

  // Event listeners for modal
  imageModal.querySelector('.image-modal-close').addEventListener('click', closeImageModal);
  imageModal.querySelector('.image-modal-prev').addEventListener('click', showPrevImage);
  imageModal.querySelector('.image-modal-next').addEventListener('click', showNextImage);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (imageModal.style.display === 'flex') {
      if (e.key === 'Escape') closeImageModal();
      if (e.key === 'ArrowLeft') showPrevImage();
      if (e.key === 'ArrowRight') showNextImage();
    }
  });

  // Close modal when clicking outside image
  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) closeImageModal();
  });
}

// Booking modal logic (mirrors index)
// Removed duplicate booking dialog declarations to avoid conflicts with script.js

