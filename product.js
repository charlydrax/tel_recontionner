// ============================================================
// PRODUCT.JS — Page produit détail
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const product = products.find(p => p.id === id);

  if (!product) {
    document.getElementById('productDetail').innerHTML = '<div class="no-results" style="padding:4rem">Produit introuvable. <a href="catalogue.html">Retour au catalogue</a></div>';
    return;
  }

  document.title = `${product.name} – RePhone`;
  document.getElementById('breadProduct').textContent = product.name;

  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  document.getElementById('productDetail').innerHTML = `
    <div class="product-detail-img">
      <div class="product-detail-svg">${phoneSVG(product.color_code, product.emoji)}</div>
      <div class="product-detail-badges">
        <div class="badge-grade grade-${product.grade.toLowerCase()}">Grade ${product.grade}</div>
        <div class="badge-discount">-${discount}%</div>
      </div>
    </div>
    <div class="product-detail-info">
      <div class="product-brand big">${product.brand}</div>
      <h1 class="product-detail-name">${product.name}</h1>
      <div class="product-detail-meta">${product.storage} · ${product.color}</div>

      <div class="product-detail-prices">
        <span class="price-current big">${product.price} €</span>
        <span class="price-original">${product.originalPrice} €</span>
        <span class="price-save">Vous économisez ${product.originalPrice - product.price} €</span>
      </div>

      <div class="product-battery-bar">
        <span>🔋 Batterie : ${product.battery}%</span>
        <div class="batt-track"><div class="batt-fill" style="width:${product.battery}%;background:${product.battery > 85 ? '#4ade80' : product.battery > 75 ? '#facc15' : '#f87171'}"></div></div>
      </div>

      <p class="product-desc">${product.description}</p>

      <div class="product-specs">
        <h3>Caractéristiques</h3>
        <ul>${product.specs.map(s => `<li>✓ ${s}</li>`).join('')}</ul>
      </div>

      <div class="product-guarantees">
        <div class="guarantee-item">📦 <strong>Livraison</strong> sous 24h</div>
        <div class="guarantee-item">🔄 <strong>Retour gratuit</strong> 30 jours</div>
        <div class="guarantee-item">🛡️ <strong>Garantie</strong> 12 mois</div>
        <div class="guarantee-item">♻️ <strong>Reconditionné</strong> certifié</div>
      </div>

      ${product.inStock
        ? `<button class="btn-primary big" onclick="addToCart(${product.id}); window.location.href='panier.html'">
             Ajouter au panier — ${product.price} €
           </button>`
        : `<div class="out-of-stock-msg">Ce produit est temporairement indisponible.</div>`
      }
    </div>
  `;

  // Afficher des avis aléatoires
  const reviewsGrid = document.getElementById('reviewsGrid');
  const shuffled = [...reviews].sort(() => Math.random() - 0.5).slice(0, 3);
  reviewsGrid.innerHTML = shuffled.map(r => `
    <div class="review-card">
      <div class="review-header">
        <div class="review-author">${r.author}</div>
        <div class="review-stars">${'⭐'.repeat(r.rating)}</div>
        <div class="review-date">${r.date}</div>
      </div>
      <p class="review-text">${r.text}</p>
      <div class="review-product">${r.product}</div>
    </div>
  `).join('');
});
