// ============================================================
// PANIER.JS — Page panier
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
});

function renderCart() {
  const cart = getCart();
  const cartItems = document.getElementById('cartItems');
  const cartSummary = document.getElementById('cartSummary');
  const cartEmpty = document.getElementById('cartEmpty');

  if (!cart.length) {
    cartItems.classList.add('hidden');
    cartSummary.classList.add('hidden');
    cartEmpty.classList.remove('hidden');
    return;
  }

  cartEmpty.classList.add('hidden');
  cartItems.classList.remove('hidden');
  cartSummary.classList.remove('hidden');

  cartItems.innerHTML = cart.map(item => {
    const p = products.find(prod => prod.id === item.id);
    if (!p) return '';
    return `
      <div class="cart-item">
        <div class="cart-item-img">
          <div style="width:70px;height:100px">${phoneSVG(p.color_code, p.emoji)}</div>
        </div>
        <div class="cart-item-info">
          <div class="cart-item-brand">${p.brand}</div>
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-meta">${p.storage} · ${p.color} · Grade ${p.grade}</div>
          <div class="cart-item-price">${p.price} €</div>
        </div>
        <div class="cart-item-actions">
          <div class="qty-control">
            <button onclick="changeQty(${p.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${p.id}, 1)">+</button>
          </div>
          <button class="btn-remove" onclick="removeItem(${p.id})">🗑️ Retirer</button>
        </div>
        <div class="cart-item-total">${(p.price * item.qty).toFixed(2)} €</div>
      </div>
    `;
  }).join('');

  const subtotal = getCartTotal();
  const shipping = 4.99;
  const total = subtotal + shipping;

  cartSummary.innerHTML = `
    <div class="summary-box">
      <h2>Récapitulatif</h2>
      <div class="summary-row">
        <span>Sous-total</span><span>${subtotal.toFixed(2)} €</span>
      </div>
      <div class="summary-row">
        <span>Livraison estimée</span><span>4,99 €</span>
      </div>
      <div class="summary-row summary-total">
        <strong>Total</strong><strong>${total.toFixed(2)} €</strong>
      </div>
      <a href="paiement.html" class="btn-primary" style="display:block;text-align:center;margin-top:1.5rem">
        Procéder au paiement
      </a>
      <a href="catalogue.html" class="btn-ghost" style="display:block;text-align:center;margin-top:0.75rem">
        Continuer mes achats
      </a>
      <div class="secure-badges" style="margin-top:1rem">
        <div class="badge">🔒 Paiement fictif</div>
        <div class="badge">✅ Site de test</div>
      </div>
    </div>
  `;
}

function changeQty(productId, delta) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === productId);
  if (idx < 0) return;
  cart[idx].qty = Math.max(1, cart[idx].qty + delta);
  saveCart(cart);
  renderCart();
}

function removeItem(productId) {
  removeFromCart(productId);
  renderCart();
}
