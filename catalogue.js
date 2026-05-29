// ============================================================
// CATALOGUE.JS — Filtres et affichage catalogue
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('catalogueGrid');
  const countEl = document.getElementById('productCount');
  const priceRange = document.getElementById('priceRange');
  const priceVal = document.getElementById('priceVal');
  const sortSelect = document.getElementById('sortSelect');
  const resetBtn = document.getElementById('resetFilters');
  const brandFiltersEl = document.getElementById('brandFilters');

  // Génère les filtres marque dynamiquement
  const brands = [...new Set(products.map(p => p.brand))];
  brands.forEach(brand => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" value="${brand}" class="brand-filter" checked /> ${brand}`;
    brandFiltersEl.appendChild(label);
  });

  function getFilters() {
    const selectedBrands = [...document.querySelectorAll('.brand-filter:checked')].map(i => i.value);
    const selectedGrades = [...document.querySelectorAll('.grade-filter:checked')].map(i => i.value);
    const maxPrice = parseInt(priceRange.value);
    const sort = sortSelect.value;
    return { selectedBrands, selectedGrades, maxPrice, sort };
  }

  function render() {
    const { selectedBrands, selectedGrades, maxPrice, sort } = getFilters();

    let filtered = products.filter(p =>
      selectedBrands.includes(p.brand) &&
      selectedGrades.includes(p.grade) &&
      p.price <= maxPrice
    );

    if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

    grid.innerHTML = filtered.length
      ? filtered.map(productCard).join('')
      : '<div class="no-results">Aucun produit ne correspond à vos filtres.</div>';

    countEl.textContent = `${filtered.length} produit${filtered.length > 1 ? 's' : ''}`;
  }

  // Listeners
  priceRange.addEventListener('input', () => {
    priceVal.textContent = priceRange.value;
    render();
  });

  sortSelect.addEventListener('change', render);

  document.addEventListener('change', e => {
    if (e.target.classList.contains('brand-filter') || e.target.classList.contains('grade-filter')) {
      render();
    }
  });

  resetBtn.addEventListener('click', () => {
    document.querySelectorAll('.brand-filter, .grade-filter').forEach(i => i.checked = true);
    priceRange.value = 1000;
    priceVal.textContent = '1000';
    sortSelect.value = 'default';
    render();
  });

  render();
});
