// ============================================================
// CHECKOUT.JS — Page paiement fictif
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  renderOrderSummary();
  setupCardPreview();
  setupPaymentMethods();
  setupPayButton();
});

function renderOrderSummary() {
  const cart = getCart();
  const summaryItems = document.getElementById('summaryItems');
  const summarySubtotal = document.getElementById('summarySubtotal');
  const summaryTotal = document.getElementById('summaryTotal');

  if (!cart.length) {
    summaryItems.innerHTML = '<p style="color:#999">Panier vide</p>';
    return;
  }

  const subtotal = getCartTotal();
  const shipping = getShippingCost();

  summaryItems.innerHTML = cart.map(item => {
    const p = products.find(pr => pr.id === item.id);
    if (!p) return '';
    return `
      <div class="summary-item">
        <div class="summary-item-img" style="width:40px;height:55px">${phoneSVG(p.color_code, p.emoji)}</div>
        <div class="summary-item-info">
          <div>${p.name}</div>
          <div class="summary-item-meta">×${item.qty} · Grade ${p.grade}</div>
        </div>
        <div class="summary-item-price">${(p.price * item.qty).toFixed(2)} €</div>
      </div>
    `;
  }).join('');

  summarySubtotal.textContent = subtotal.toFixed(2) + ' €';
  summaryTotal.textContent = (subtotal + shipping).toFixed(2) + ' €';
}

function getShippingCost() {
  const sel = document.querySelector('input[name="shipping"]:checked');
  if (!sel) return 4.99;
  return sel.value === 'express' ? 9.99 : sel.value === 'relay' ? 2.99 : 4.99;
}

function setupCardPreview() {
  const cardNumber = document.getElementById('cardNumber');
  const cardName = document.getElementById('cardName');
  const cardExp = document.getElementById('cardExp');

  if (!cardNumber) return;

  cardNumber.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').substring(0, 16);
    v = v.replace(/(.{4})/g, '$1 ').trim();
    e.target.value = v;
    document.getElementById('cardNumPreview').textContent = v || '•••• •••• •••• ••••';

    // Détection type carte (cosmétique)
    const logo = document.getElementById('cardPreview').querySelector('.card-logo-preview');
    if (v.startsWith('4')) logo.textContent = 'VISA';
    else if (v.startsWith('5')) logo.textContent = 'MASTERCARD';
    else if (v.startsWith('3')) logo.textContent = 'AMEX';
    else logo.textContent = 'CARTE';
  });

  cardName.addEventListener('input', e => {
    document.getElementById('cardNamePreview').textContent = e.target.value.toUpperCase() || 'PRÉNOM NOM';
  });

  cardExp.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2);
    e.target.value = v;
    document.getElementById('cardExpPreview').textContent = v || 'MM/AA';
  });
}

function setupPaymentMethods() {
  document.querySelectorAll('.pay-method').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pay-method').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const method = btn.dataset.method;
      document.getElementById('cardForm').classList.toggle('hidden', method !== 'card');
      document.getElementById('paypalForm').classList.toggle('hidden', method !== 'paypal');
      document.getElementById('applepayForm').classList.toggle('hidden', method !== 'apple');
    });
  });

  // Update summary on shipping change
  document.querySelectorAll('input[name="shipping"]').forEach(r => {
    r.addEventListener('change', () => {
      const shipping = getShippingCost();
      const subtotal = getCartTotal();
      document.getElementById('summaryShipping').textContent = shipping.toFixed(2) + ' €';
      document.getElementById('summaryTotal').textContent = (subtotal + shipping).toFixed(2) + ' €';
    });
  });
}

function setupPayButton() {
  const btn = document.getElementById('btnPay');
  if (!btn) return;

  btn.addEventListener('click', () => {
    // Validation basique côté client (fictive)
    const firstName = document.getElementById('firstName')?.value.trim();
    const email = document.getElementById('email')?.value.trim();

    if (!firstName || !email) {
      showToast('⚠️ Veuillez remplir les informations de livraison');
      return;
    }

    // Animation loading
    btn.disabled = true;
    btn.innerHTML = '<span class="loading-dots">Traitement en cours<span>.</span><span>.</span><span>.</span></span>';

    setTimeout(() => {
      // Générer un numéro de commande fictif
      const orderNum = 'RP-' + Date.now().toString().slice(-8).toUpperCase();
      document.getElementById('fakeOrderNum').textContent = orderNum;

      // Vider le panier fictif
      sessionStorage.removeItem('rephone_cart');
      updateCartUI();

      // Afficher modal
      document.getElementById('confirmModal').classList.remove('hidden');
      btn.disabled = false;
      btn.innerHTML = '<span>Confirmer la commande fictive</span><span class="pay-secure">🔒 Simulation sécurisée</span>';
    }, 2000);
  });
}
