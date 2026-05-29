// ============================================================
// APP.JS — Fonctions globales RePhone
// ============================================================

// PANIER — stocké en sessionStorage (pas de persistence = pas de collecte de données)
function getCart() {
  try {
    return JSON.parse(sessionStorage.getItem('rephone_cart')) || [];
  } catch { return []; }
}

function saveCart(cart) {
  sessionStorage.setItem('rephone_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === productId);
  if (idx >= 0) {
    cart[idx].qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }
  saveCart(cart);
  showToast('✅ Ajouté au panier !');
}

function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
}

function updateCartUI() {
  const cart = getCart();
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll('#cartCount').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'inline' : 'none';
  });
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => {
    const p = products.find(p => p.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}

// TOAST NOTIFICATION
function showToast(msg) {
  const existing = document.getElementById('rp-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'rp-toast';
  toast.className = 'rp-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 2500);
}

// GÉNÈRE LE SVG COULEUR DU TÉLÉPHONE
function phoneSVG(colorCode, emoji) {
  return `
    <svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
      <rect x="10" y="5" width="100" height="190" rx="16" ry="16" fill="${colorCode}" />
      <rect x="14" y="9" width="92" height="182" rx="13" ry="13" fill="${colorCode}" opacity="0.6"/>
      <rect x="20" y="18" width="80" height="140" rx="8" ry="8" fill="#111" />
      <rect x="20" y="18" width="80" height="140" rx="8" ry="8" fill="url(#screenGrad)" />
      <defs>
        <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1a1a2e"/>
          <stop offset="100%" stop-color="#16213e"/>
        </linearGradient>
      </defs>
      <rect x="47" y="20" width="26" height="7" rx="3.5" fill="#000" />
      <text x="60" y="95" text-anchor="middle" font-size="32">${emoji || '📱'}</text>
      <rect x="40" y="168" width="40" height="6" rx="3" fill="#333" />
    </svg>
  `;
}

// GÉNÈRE UNE CARTE PRODUIT HTML
function productCard(p) {
  const discount = Math.round((1 - p.price / p.originalPrice) * 100);
  const stockBadge = p.inStock ? '' : '<div class="badge-out">Rupture de stock</div>';
  return `
    <div class="product-card ${!p.inStock ? 'out-of-stock' : ''}">
      <a href="produit.html?id=${p.id}" class="product-img-wrap">
        ${stockBadge}
        <div class="badge-discount">-${discount}%</div>
        <div class="badge-grade grade-${p.grade.toLowerCase()}">${p.grade}</div>
        <div class="product-img-svg">${phoneSVG(p.color_code, p.emoji)}</div>
      </a>
      <div class="product-info">
        <div class="product-brand">${p.brand}</div>
        <h3 class="product-name"><a href="produit.html?id=${p.id}">${p.name}</a></h3>
        <div class="product-meta">${p.storage} · ${p.color}</div>
        <div class="product-battery">🔋 Batterie ${p.battery}%</div>
        <div class="product-prices">
          <span class="price-current">${p.price} €</span>
          <span class="price-original">${p.originalPrice} €</span>
        </div>
        ${p.inStock
          ? `<button class="btn-add-cart" onclick="addToCart(${p.id})">Ajouter au panier</button>`
          : `<button class="btn-add-cart disabled" disabled>Indisponible</button>`
        }
      </div>
    </div>
  `;
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();

  // Shipping options toggle
  document.querySelectorAll('.shipping-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.shipping-opt').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });
});
