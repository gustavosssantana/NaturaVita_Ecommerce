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

// Builds the Nuvemshop direct-buy link for a product/variant, which drops the
// shopper straight into the store's real checkout (Pix, card, boleto).
export function buyUrl(storeUrl, product, variantId = null, qty = 1) {
  const vId = variantId || product?.variantId;
  if (storeUrl && vId) {
    return `${storeUrl.replace(/\/$/, '')}/comprar/?add_to_cart=${vId}&quantity=${qty}`;
  }
  return product?.canonicalUrl || storeUrl || null;
}

// Cart → Nuvemshop checkout. The store adds one variant per `add_to_cart`
// parameter, so multi-item carts repeat it.
export function cartCheckoutUrl(storeUrl, items) {
  if (!storeUrl || !items?.length) return null;
  const base = storeUrl.replace(/\/$/, '');
  const params = items
    .filter((i) => i.variant?.id || i.product?.variantId)
    .map((i) => `add_to_cart=${i.variant?.id || i.product.variantId}&quantity=${i.qty}`)
    .join('&');
  if (!params) return base;
  return `${base}/comprar/?${params}`;
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
