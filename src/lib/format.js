const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function money(value) {
  const n = Number(value) || 0;
  return BRL.format(n);
}

// "6x de R$ 9,48"
export function installment(value, times = 6) {
  const n = Number(value) || 0;
  return `${times}x de ${money(n / times)}`;
}

export function discountPercent(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round((1 - price / originalPrice) * 100);
}

// Link that takes the shopper straight to this item's page in the Nuvemshop
// store, where the real purchase happens (price, shipping by CEP, payment).
//
// The `?add_to_cart=` URL format is NOT used: this store answers it with an
// empty cart, which loses the purchase.
export function buyUrl(storeUrl, product) {
  if (product?.canonicalUrl) return product.canonicalUrl;
  if (storeUrl) return storeUrl;
  return null;
}

// Rough delivery estimate by region, used only as an indication — the real
// shipping cost and deadline come from the store's checkout.
export function deliveryEstimate(uf) {
  const sudeste = ['SP', 'RJ', 'MG', 'ES'];
  const sul = ['PR', 'SC', 'RS'];
  const centro = ['GO', 'DF', 'MT', 'MS'];
  if (sudeste.includes(uf)) return '2 a 4 dias úteis';
  if (sul.includes(uf) || centro.includes(uf)) return '3 a 6 dias úteis';
  if (uf) return '5 a 10 dias úteis';
  return null;
}
