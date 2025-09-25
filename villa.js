function $(sel,root=document){return root.querySelector(sel)}
function getParam(name){const u=new URL(location.href);return u.searchParams.get(name)}

const id = getParam('id');
const stay = window.STAYS.find(s=>s.id===id);
const root = document.getElementById('villaRoot');

if(!stay){
  root.innerHTML = `<div class="muted" style="padding:20px;border:1px dashed rgba(255,255,255,.15);border-radius:12px">Villa not found.</div>`;
} else {
  renderVilla(stay);
}

function renderVilla(s){
  root.innerHTML = `
    <div class="section-header" style="padding-top:10px">
      <h2 class="detail-title">${s.name}</h2>
      <p class="detail-subtitle">${s.address || `${s.area}, ${s.city}, ${s.state}`} • ${s.bedrooms} BR • ${s.bathrooms} BA • Up to ${s.guests} guests • ⭐ ${s.rating}</p>
    </div>
    <div class="detail-grid">
      <div class="detail-content">
        <div class="media-grid">
          ${(s.gallery||[]).map((url,i)=>`<img src="${url}" alt="Photo ${i+1} of ${s.name}" loading="lazy" data-index="${i}" class="gallery-image">`).join('')}
        </div>
        ${s.video ? `
        <div class="detail-card" style="margin-bottom:16px">
          <video src="${s.video}" controls style="width:100%;border-radius:12px;display:block"></video>
        </div>` : ''}
        <div class="detail-card">
          <h4>Overview</h4>
          <p class="muted">Experience ${s.name}, a premium villa in ${s.area}. Amenities include ${(s.amenities||[]).slice(0,4).join(', ')} and more. Concierge support is included with every booking.</p>
          <div class="tags" style="margin-top:12px">${(s.tags||[]).map(t=>`<span class="tag">${t.replace('-', ' ')}</span>`).join('')}</div>
        </div>
        <div class="detail-card">
          <h4>Reviews</h4>
          <div id="reviewsList" class="reviews-section">
            ${s.reviews && s.reviews.length > 0 ? s.reviews.map(r => `
              <div class="review-card">
                <strong>${r.user}</strong> <span>⭐ ${r.rating}</span>
                <p>${r.comment}</p>
                <small class="muted">${r.date}</small>
              </div>
            `).join('') : '<p class="muted">No reviews yet.</p>'}
          </div>
          <button id="writeReviewBtn" class="btn btn-outline btn-full" style="margin-top: 16px;">Write a Review</button>
          <dialog id="reviewDialog" class="review-dialog" style="padding: 20px; border-radius: 12px; max-width: 400px;">
            <form id="reviewForm" novalidate>
              <h3>Write a Review</h3>
              <label>
                <span>Rating</span>
                <select id="reviewRating" required>
                  <option value="">Select rating</option>
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </label>
              <label>
                <span>Comment</span>
                <textarea id="reviewComment" rows="4" required></textarea>
              </label>
              <div style="margin-top: 16px; display: flex; justify-content: flex-end; gap: 12px;">
                <button type="submit" class="btn btn-primary">Submit</button>
                <button type="button" id="cancelReviewBtn" class="btn btn-outline">Cancel</button>
              </div>
              <p id="reviewStatus" class="muted" style="margin-top: 12px;"></p>
            </form>
          </dialog>
        </div>
      </div>
      <aside class="detail-sidebar">
        <div class="detail-card">
          <div class="price-section">
            <strong>${new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(s.price)}</strong>
            <span class="muted">per night</span>
          </div>
          <button class="btn btn-primary btn-full" id="bookNow">Book This Villa</button>
          <div class="muted" style="margin-top:12px">Best rate guaranteed when you book direct.</div>
        </div>
        <div class="detail-card">
          <h4>Contact Owner</h4>
          <p class="muted" style="margin:0 0 16px 0">${(s.owner?.name)||'Owner'} • ${(s.area)}, ${(s.city)}</p>
          <div class="contact-grid">
            <a class="btn btn-outline" href="tel:${encodeURIComponent(s.owner?.phone||'')}">Call ${s.owner?.phone||''}</a>
            <a class="btn btn-outline" href="https://wa.me/${(s.owner?.phone||'').replace(/[^0-9]/g,'')}?text=${encodeURIComponent('Hello, I am interested in '+s.name)}" target="_blank" rel="noreferrer">WhatsApp</a>
            <a class="btn btn-outline" href="mailto:${s.owner?.email||''}?subject=${encodeURIComponent('Inquiry: '+s.name)}">Email</a>
          </div>
        </div>
        <div class="detail-card">
          <h4>Location</h4>
          <p class="muted">${s.address || `${s.area}, ${s.city} • Maharashtra`}</p>
          <a class="btn btn-outline btn-full" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((s.address||'') || (s.name + ' ' + s.area + ' ' + s.city))}" target="_blank" rel="noreferrer">Open in Google Maps</a>
        </div>
      </aside>
    </div>
  `;

  document.getElementById('bookNow').addEventListener('click',()=>openBooking(s));

  // Reviews functionality
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const hasBooked = bookings.some(b => b.userEmail === user?.email && b.stayId === s.id);
  const writeReviewBtn = document.getElementById('writeReviewBtn');
  const reviewDialog = document.getElementById('reviewDialog');
  const reviewForm = document.getElementById('reviewForm');
  const cancelReviewBtn = document.getElementById('cancelReviewBtn');
  const reviewStatus = document.getElementById('reviewStatus');

  if (user && hasBooked) {
    writeReviewBtn.style.display = 'block';
  } else {
    writeReviewBtn.style.display = 'none';
  }

  writeReviewBtn.addEventListener('click', () => {
    if (reviewDialog.showModal) reviewDialog.showModal();
    else reviewDialog.setAttribute('open', '');
  });

  cancelReviewBtn.addEventListener('click', () => {
    reviewDialog.close();
    reviewStatus.textContent = '';
    reviewForm.reset();
  });

  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const rating = document.getElementById('reviewRating').value;
    const comment = document.getElementById('reviewComment').value.trim();
    if (!rating || !comment) {
      reviewStatus.textContent = 'Please fill all fields.';
      return;
    }
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    reviews.push({
      stayId: s.id,
      user: user.name,
      rating: parseInt(rating),
      comment,
      date: new Date().toISOString().split('T')[0]
    });
    localStorage.setItem('reviews', JSON.stringify(reviews));
    reviewStatus.textContent = 'Review submitted!';
    setTimeout(() => {
      reviewDialog.close();
      reviewStatus.textContent = '';
      reviewForm.reset();
      // Re-render reviews
      const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]').filter(r => r.stayId === s.id);
      const reviewsList = document.getElementById('reviewsList');
      reviewsList.innerHTML = allReviews.length > 0 ? allReviews.map(r => `
        <div class="review-card" style="border-bottom: 1px solid #ccc; padding: 8px 0;">
          <strong>${r.user}</strong> <span>⭐ ${r.rating}</span>
          <p>${r.comment}</p>
          <small class="muted">${r.date}</small>
        </div>
      `).join('') : '<p class="muted">No reviews yet.</p>';
    }, 1000);
  });

  // Image gallery functionality
  const galleryImages = document.querySelectorAll('.gallery-image');
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


