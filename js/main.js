/**
 * ABDULLAH ABID — PORTFOLIO JAVASCRIPT
 * Handles navigation, interactive filters, dynamic Vercel gallery, modals, and clipboard.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initProjectFiltering();
  initDynamicGallery();
  initCopyEmail();
});

/* ==========================================================================
   1. NAVIGATION & SCROLL TRACKING
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      const icon = mobileToggle.querySelector('svg');
      if (icon) {
        if (isOpen) {
          icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
        } else {
          icon.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
        }
      }
    });

    // Close menu when clicking outside or on a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          mobileToggle.setAttribute('aria-expanded', 'false');
          const icon = mobileToggle.querySelector('svg');
          if (icon) {
            icon.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
          }
        }
      });
    });
  }

  // Active link highlighter using IntersectionObserver
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }
}

/* ==========================================================================
   2. PROJECT CATEGORY FILTERING
   ========================================================================== */
function initProjectFiltering() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length === 0 || projectCards.length === 0) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || (category && category.includes(filterValue))) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   3. DYNAMIC VERCEL IMAGE GALLERY
   ========================================================================== */
function initDynamicGallery() {
  const galleryImg = document.getElementById('dynamicGalleryImage');
  const shuffleBtn = document.getElementById('shuffleGalleryBtn');
  const loader = document.getElementById('galleryLoader');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');

  if (!galleryImg) return;

  const VERCEL_API_URL = 'https://abdullahabid04-portfolio.vercel.app/api/random-image';

  function fetchRandomPhoto() {
    if (loader) loader.style.display = 'flex';
    galleryImg.classList.add('loading');
    if (shuffleBtn) {
      shuffleBtn.disabled = true;
      shuffleBtn.style.opacity = '0.7';
    }

    const timestamp = new Date().getTime();
    const newSrc = `${VERCEL_API_URL}?t=${timestamp}`;

    const tempImg = new Image();
    tempImg.onload = () => {
      galleryImg.src = newSrc;
      galleryImg.classList.remove('loading');
      if (loader) loader.style.display = 'none';
      if (shuffleBtn) {
        shuffleBtn.disabled = false;
        shuffleBtn.style.opacity = '1';
      }
      if (lightboxImg) lightboxImg.src = newSrc;
    };
    tempImg.onerror = () => {
      // Fallback: still show previous image or direct repo asset if available
      galleryImg.classList.remove('loading');
      if (loader) loader.style.display = 'none';
      if (shuffleBtn) {
        shuffleBtn.disabled = false;
        shuffleBtn.style.opacity = '1';
      }
    };
    tempImg.src = newSrc;
  }

  // Shuffle button event
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', fetchRandomPhoto);
  }

  // Lightbox view
  if (galleryImg && lightboxModal && lightboxImg) {
    galleryImg.addEventListener('click', () => {
      lightboxImg.src = galleryImg.src;
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (lightboxClose && lightboxModal) {
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
}

/* ==========================================================================
   4. CLIPBOARD & TOAST NOTIFICATIONS
   ========================================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const toast = document.getElementById('toast');

  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    const email = 'abrps2004@gmail.com';
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      showToast('Email copied to clipboard!');
    } catch (err) {
      showToast('Email: abrps2004@gmail.com');
    }
  });

  function showToast(msg) {
    if (!toast) return;
    const toastText = toast.querySelector('.toast-text') || toast;
    toastText.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}
