const body = document.body;
const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const cart = document.querySelector('[data-cart]');
const cartItems = document.querySelector('[data-cart-items]');
const cartCount = document.querySelector('[data-cart-count]');
const cartTotal = document.querySelector('[data-cart-total]');
const toast = document.querySelector('[data-toast]');
const items = [];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const finishLoading = () => {
  window.setTimeout(() => {
    body.classList.remove('loading');
    body.classList.add('is-ready');
    document.querySelectorAll('.hero .reveal').forEach((item, index) => {
      window.setTimeout(() => item.classList.add('revealed'), 130 * index);
    });
  }, reduceMotion ? 80 : 3250);
};

window.addEventListener('load', finishLoading, { once: true });

const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 32);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const scenes = [...document.querySelectorAll('main > section:not(.hero)')];
const motionImages = [...document.querySelectorAll('.portrait-frame img, .ritual-image-wrap img, .skin-image img, .closing > img')];
scenes.forEach((scene) => scene.classList.add('scroll-scene'));

let motionFrame;
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const renderScrollMotion = () => {
  const viewport = window.innerHeight;
  const maxScroll = document.documentElement.scrollHeight - viewport;
  document.documentElement.style.setProperty('--page-progress', maxScroll ? window.scrollY / maxScroll : 0);
  document.documentElement.style.setProperty('--hero-shift', `${Math.min(window.scrollY * .12, 90)}px`);

  scenes.forEach((scene) => {
    const rect = scene.getBoundingClientRect();
    const reveal = clamp((viewport - rect.top) / (viewport * .52));
    scene.style.setProperty('--scene-cover', `${(reveal * 100).toFixed(1)}%`);
  });

  motionImages.forEach((image) => {
    const rect = image.parentElement.getBoundingClientRect();
    const progress = clamp((viewport - rect.top) / (viewport + rect.height));
    image.style.setProperty('--parallax-y', `${-8 + progress * 12}%`);
  });
  motionFrame = null;
};

const requestScrollMotion = () => {
  if (!motionFrame) motionFrame = requestAnimationFrame(renderScrollMotion);
};

if (!reduceMotion) {
  window.addEventListener('scroll', requestScrollMotion, { passive: true });
  window.addEventListener('resize', requestScrollMotion);
  renderScrollMotion();
} else {
  document.documentElement.style.setProperty('--page-progress', 0);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

document.querySelectorAll('.reveal, .reveal-card, .reveal-image').forEach((item, index) => {
  if (!item.closest('.hero')) {
    item.style.setProperty('--order', index % 3);
    revealObserver.observe(item);
  }
});

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
  document.querySelectorAll('.product-image').forEach((stage) => {
    stage.addEventListener('pointermove', (event) => {
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      stage.classList.add('is-tracking');
      stage.style.setProperty('--spot-x', `${x * 100}%`);
      stage.style.setProperty('--spot-y', `${y * 100}%`);
    });
    stage.addEventListener('pointerleave', () => {
      stage.classList.remove('is-tracking');
      ['--spot-x', '--spot-y'].forEach((name) => stage.style.removeProperty(name));
    });
  });
}

const productDialog = document.querySelector('[data-product-dialog]');
const detailStage = document.querySelector('[data-detail-stage]');
const detailImage = document.querySelector('[data-detail-image]');
const detailOpenImage = document.querySelector('[data-detail-open-image]');
const detailOpenButton = document.querySelector('[data-detail-open-button]');
const detailAdd = document.querySelector('[data-detail-add]');
let openJarTimer;

document.querySelectorAll('[data-product-detail]').forEach((button) => button.addEventListener('click', () => {
  const { theme, title, kicker, price, image, openImage, description, ingredients, ritual } = button.dataset;
  window.clearTimeout(openJarTimer);
  detailStage.className = `detail-stage detail-${theme}`;
  detailImage.src = image;
  detailImage.alt = title;
  detailOpenImage.src = openImage || image;
  detailOpenImage.alt = openImage ? `${title}, opened` : '';
  document.querySelector('[data-detail-title]').textContent = title;
  document.querySelector('[data-detail-kicker]').textContent = kicker;
  document.querySelector('[data-detail-description]').textContent = description;
  document.querySelector('[data-detail-ingredients]').innerHTML = ingredients.split('|').map((item) => `<li>${item}</li>`).join('');
  document.querySelector('[data-detail-ritual]').textContent = ritual;
  document.querySelector('[data-detail-state]').textContent = theme === 'night' ? 'Open formula · Overnight ritual' : 'Product study · Daily ritual';
  detailOpenButton.hidden = !openImage;
  detailOpenButton.textContent = 'Open the jar';
  detailAdd.textContent = `Add · ${price}`;
  detailAdd.dataset.name = title;
  detailAdd.dataset.price = price;
  productDialog.showModal();
  if (openImage) openJarTimer = window.setTimeout(() => {
    detailStage.classList.add('is-open');
    detailOpenButton.textContent = 'Close the jar';
  }, reduceMotion ? 0 : 650);
}));

detailOpenButton.addEventListener('click', () => {
  const open = detailStage.classList.toggle('is-open');
  detailOpenButton.textContent = open ? 'Close the jar' : 'Open the jar';
});

productDialog.addEventListener('click', (event) => {
  if (event.target === productDialog) productDialog.close();
});

productDialog.addEventListener('close', () => {
  window.clearTimeout(openJarTimer);
  detailStage.classList.remove('is-open');
});

menuButton.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const openCart = () => {
  body.classList.add('cart-open');
  cart.setAttribute('aria-hidden', 'false');
  document.querySelector('[data-cart-close]').focus();
};

const closeCart = () => {
  body.classList.remove('cart-open');
  cart.setAttribute('aria-hidden', 'true');
};

document.querySelectorAll('[data-cart-open]').forEach((button) => button.addEventListener('click', openCart));
document.querySelector('[data-cart-close]').addEventListener('click', closeCart);
document.querySelector('[data-cart-scrim]').addEventListener('click', closeCart);
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeCart(); });

const parsePrice = (price) => Number(price.replace(/[^0-9]/g, ''));

const renderCart = () => {
  cartCount.textContent = String(items.length);
  cartTotal.textContent = `₱${items.reduce((sum, item) => sum + parsePrice(item.price), 0).toLocaleString()}`;
  if (!items.length) {
    cartItems.innerHTML = '<p class="cart-empty">Your ritual is waiting.</p>';
    return;
  }
  cartItems.innerHTML = items.map((item, index) => `
    <article class="cart-item">
      <div><h3>${item.name}</h3><p>${item.price}</p></div>
      <button type="button" data-remove="${index}" aria-label="Remove ${item.name}">Remove</button>
    </article>
  `).join('');
  cartItems.querySelectorAll('[data-remove]').forEach((button) => button.addEventListener('click', () => {
    items.splice(Number(button.dataset.remove), 1);
    renderCart();
  }));
};

document.querySelectorAll('[data-add]').forEach((button) => button.addEventListener('click', () => {
  items.push({ name: button.dataset.name, price: button.dataset.price });
  renderCart();
  toast.textContent = `${button.dataset.name} added`;
  toast.classList.add('visible');
  window.setTimeout(() => toast.classList.remove('visible'), 1800);
}));

document.querySelector('.checkout-button').addEventListener('click', () => {
  toast.textContent = 'Checkout is intentionally disabled in this concept.';
  toast.classList.add('visible');
  window.setTimeout(() => toast.classList.remove('visible'), 2600);
});

renderCart();
