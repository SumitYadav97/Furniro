/* ============================================================
   FURNIRO – Main JavaScript
   ============================================================ */

/* ── Cart State ── */
const cart = JSON.parse(localStorage.getItem('furniro-cart') || '[]');

function saveCart() {
  localStorage.setItem('furniro-cart', JSON.stringify(cart));
}

function getTotalCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (!badge) return;
  const count = getTotalCount();
  badge.textContent = count;
  badge.classList.toggle('visible', count > 0);
}

function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  saveCart();
  updateCartBadge();
  showToast(`"${name}" added to cart 🛒`, 'success');
}

/* ── Toast Notification ── */
let toastTimer = null;

function showToast(message, type = 'info') {
  let toast = document.getElementById('furniro-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'furniro-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast ${type}`;

  // Force reflow to restart transition
  void toast.offsetWidth;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* ── Mobile Menu ── */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  // Close when a link is clicked
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}

/* ── Highlight Active Nav Link on Scroll ── */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav a, .mobile-nav a');

  if (!sections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

/* ── Sticky header shadow ── */
function initStickyHeader() {
  const header = document.querySelector('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 10
      ? '0 2px 12px rgba(0,0,0,.12)'
      : '0 1px 6px rgba(0,0,0,.08)';
  }, { passive: true });
}

/* ── Newsletter Form ── */
function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value.trim();
    if (!email) return;
    showToast(`Subscribed with ${email} ✓`, 'success');
    form.reset();
  });
}

/* ── Lazy Load Images ── */
function initLazyImages() {
  const imgs = document.querySelectorAll('img[data-src]');
  if (!imgs.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.src = entry.target.dataset.src;
        io.unobserve(entry.target);
      }
    });
  });

  imgs.forEach(img => io.observe(img));
}

/* ── Attach Add-to-Cart buttons ── */
function initProductCards() {
  document.querySelectorAll('.product-card').forEach(card => {
    const btn = card.querySelector('.btn-cart');
    if (!btn) return;

    const name  = card.querySelector('h3')?.textContent?.trim() || 'Product';
    const price = card.querySelector('.new-price')?.textContent?.trim() || '';

    btn.addEventListener('click', e => {
      e.stopPropagation();
      addToCart(name, price);
    });
  });
}

/* ── Smooth scroll for anchor links ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ── Back-to-top button ── */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.title = 'Back to top';
  btn.innerHTML = '&#8679;';
  btn.style.cssText = `
    position: fixed; bottom: 28px; left: 28px;
    width: 44px; height: 44px;
    background: #b88e2f; color: #fff;
    border: none; border-radius: 50%;
    font-size: 22px; line-height: 1;
    cursor: pointer; opacity: 0;
    transform: translateY(10px);
    transition: opacity .3s, transform .3s;
    z-index: 998; box-shadow: 0 2px 10px rgba(0,0,0,.2);
  `;
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    const show = window.scrollY > 400;
    btn.style.opacity = show ? '1' : '0';
    btn.style.transform = show ? 'translateY(0)' : 'translateY(10px)';
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Bootstrap everything on DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initMobileMenu();
  initStickyHeader();
  initScrollSpy();
  initNewsletter();
  initLazyImages();
  initProductCards();
  initSmoothScroll();
  initBackToTop();
});
