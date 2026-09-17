// Vercel Serverless Function — proxies the Nuvemshop (Tiendanube) Admin API
// server-side, so the access token never reaches the browser.
//
// The access token is read ONLY from the environment. It is never written in
// this file: the repository is public, and a token committed here is a key
// left in the street — anyone who finds the repo can rewrite the store.
//
// Set it in Vercel → Project → Settings → Environment Variables:
//   NUVEMSHOP_ACCESS_TOKEN   (required)
//   NUVEMSHOP_STORE_ID       (optional, defaults below)
//   NUVEMSHOP_USER_AGENT     (optional, defaults below)
const FALLBACK_STORE_ID = '8240607';
const FALLBACK_USER_AGENT = 'NaturaVitaImport (naturavita.loja@gmail.com)';

const API_VERSION = 'v1';

function baseUrl(storeId) {
  return `https://api.tiendanube.com/${API_VERSION}/${storeId}`;
}

function accessToken() {
  const token = process.env.NUVEMSHOP_ACCESS_TOKEN;
  if (!token) {
    // Failing loudly beats falling back to a token in the source: a silent
    // fallback is how the old one ended up published in a public repo.
    throw new Error(
      'NUVEMSHOP_ACCESS_TOKEN is not set. Add it in Vercel → Project → Settings → Environment Variables.'
    );
  }
  return token;
}

function headers() {
  return {
    Authentication: `bearer ${accessToken()}`,
    'User-Agent': process.env.NUVEMSHOP_USER_AGENT || FALLBACK_USER_AGENT,
    'Content-Type': 'application/json',
  };
}

function txt(field, fallback = '') {
  if (!field) return fallback;
  if (typeof field === 'string') return field;
  return field.pt || field.es || field.en || fallback;
}

function slugify(str) {
  return (str || '')
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Deterministic pseudo-rating so the UI has something to show.
// (Nuvemshop doesn't store reviews — there's no real review data yet.)
function pseudoFrom(id, min, max) {
  const x = Math.sin(id * 999.77) * 10000;
  const frac = x - Math.floor(x);
  return min + frac * (max - min);
}

// Products/categories that are clearly leftovers from the import test run.
function isTestEntry(name) {
  const n = (name || '').trim().toLowerCase();
  return n === 'teste produto' || n === 'produto teste' || n === 'categoria teste' || n === 'teste';
}

// O produto __BANNERS__ existe só para guardar as imagens do carrossel da
// home (veja api/banners.js). Ele nunca é publicado, mas a checagem por nome
// fica aqui de qualquer forma: se alguém publicá-lo por engano no admin da
// Nuvemshop, a vitrine não passa a vender um "produto" que é um banner.
function isBannerHolder(name) {
  return (name || '').trim() === '__BANNERS__';
}

async function fetchStore(storeId) {
  try {
    const res = await fetch(`${baseUrl(storeId)}/store`, { headers: headers() });
    if (!res.ok) return null;
    const s = await res.json();
    const url = txt(s.url) || s.original_domain || null;
    return {
      name: txt(s.name, 'NaturaVita'),
      url: url ? (url.startsWith('http') ? url : `https://${url}`) : null,
    };
  } catch {
    return null;
  }
}

async function fetchAllCategories(storeId) {
  const res = await fetch(`${baseUrl(storeId)}/categories?per_page=200`, { headers: headers() });
  if (!res.ok) throw new Error(`Nuvemshop categories error ${res.status}`);
  const data = await res.json();
  return data
    .map((c) => ({
      id: c.id,
      name: txt(c.name, `Categoria ${c.id}`),
      slug: slugify(txt(c.name, `categoria-${c.id}`)),
    }))
    .filter((c) => !isTestEntry(c.name));
}

async function fetchAllProducts(storeId) {
  const perPage = 200;
  const first = await fetch(
    `${baseUrl(storeId)}/products?per_page=${perPage}&page=1&published=true`,
    { headers: headers() }
  );
  if (!first.ok) throw new Error(`Nuvemshop products error ${first.status}`);
  const totalCount = parseInt(first.headers.get('x-total-count') || '0', 10);
  const firstPage = await first.json();

  // Fall back to walking pages until one comes back short, in case the
  // store doesn't send the x-total-count header.
  const totalPages = totalCount
    ? Math.ceil(totalCount / perPage)
    : firstPage.length === perPage
      ? 12
      : 1;

  const rest = [];
  for (let page = 2; page <= totalPages; page++) {
    rest.push(
      fetch(`${baseUrl(storeId)}/products?per_page=${perPage}&page=${page}&published=true`, {
        headers: headers(),
      })
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => [])
    );
  }
  const restPages = await Promise.all(rest);
  return [firstPage, ...restPages].flat();
}

function mapProduct(p, slugById, storeUrl) {
  const variants = Array.isArray(p.variants) ? p.variants : [];
  const variant = variants[0] || {};
  const price = parseFloat(variant.price || '0') || 0;
  const compareAt = parseFloat(variant.promotional_price ? variant.price : variant.compare_at_price || '0') || 0;
  const promo = parseFloat(variant.promotional_price || '0') || 0;

  // Nuvemshop stores a promo as promotional_price < price.
  const finalPrice = promo > 0 && promo < price ? promo : price;
  const listPrice = promo > 0 && promo < price ? price : compareAt > price ? compareAt : null;

  const categoryObj = (p.categories || [])[0];
  const categorySlug = categoryObj ? slugById[categoryObj.id] : null;

  const images = (p.images || []).map((img) => img.src).filter(Boolean);
  const name = txt(p.name, 'Produto');

  const canonical = p.canonical_url || (storeUrl && p.handle ? `${storeUrl}/produtos/${txt(p.handle)}/` : null);

  const stock = variants.reduce((sum, v) => {
    if (v.stock === null || v.stock === undefined) return sum + 999; // unlimited
    return sum + (parseInt(v.stock, 10) || 0);
  }, 0);

  return {
    id: p.id,
    variantId: variant.id || null,
    name,
    price: finalPrice,
    originalPrice: listPrice,
    rating: Math.round(pseudoFrom(p.id, 4.4, 5.0) * 10) / 10,
    reviews: Math.round(pseudoFrom(p.id * 7, 12, 320)),
    badge: listPrice ? 'OFF' : null,
    badgeType: listPrice ? 'discount' : null,
    category: categorySlug || null,
    categoryId: categoryObj ? categoryObj.id : null,
    brand: txt(p.brand) || null,
    variants: variants.map((v) => ({
      id: v.id,
      label: (v.values || []).map((val) => txt(val)).join(' / ') || 'Único',
      price: parseFloat(v.promotional_price || v.price || '0') || 0,
      sku: v.sku || null,
    })),
    image: images[0] || null,
    images,
    sku: variant.sku || null,
    stock,
    inStock: stock > 0,
    canonicalUrl: canonical,
    description: txt(p.description, '').replace(/<[^>]*>/g, '').trim(),
  };
}

let cache = null;
let cacheAt = 0;
const CACHE_MS = 10 * 60 * 1000;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');

  const storeId = process.env.NUVEMSHOP_STORE_ID || FALLBACK_STORE_ID;

  try {
    if (cache && Date.now() - cacheAt < CACHE_MS) {
      res.status(200).json(cache);
      return;
    }

    const [store, categories, rawProducts] = await Promise.all([
      fetchStore(storeId),
      fetchAllCategories(storeId),
      fetchAllProducts(storeId),
    ]);

    const storeUrl = store?.url || null;

    const slugById = {};
    categories.forEach((c) => {
      slugById[c.id] = c.slug;
    });

    const seen = new Set();
    const products = rawProducts
      .filter((p) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        // O `published=true` da requisição não é respeitado pela API: ela
        // devolve produto despublicado junto. Sem esta checagem, itens que a
        // loja tirou da vitrine (por foto errada, por exemplo) reaparecem aqui.
        if (p.published === false) return false;
        if (isBannerHolder(txt(p.name))) return false;
        return !isTestEntry(txt(p.name));
      })
      // A product without a category still belongs in /loja — only priceless
      // entries (drafts) are dropped.
      .map((p) => mapProduct(p, slugById, storeUrl))
      .filter((p) => p.price > 0);

    // Category metadata: product count + a representative photo.
    const countByCategory = {};
    const imageByCategory = {};
    products.forEach((p) => {
      countByCategory[p.category] = (countByCategory[p.category] || 0) + 1;
      if (!imageByCategory[p.category] && p.image) imageByCategory[p.category] = p.image;
    });

    const categoriesWithMeta = categories
      .map((c) => ({
        ...c,
        count: countByCategory[c.slug] || 0,
        image: imageByCategory[c.slug] || null,
      }))
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count);

    const payload = {
      store: { name: store?.name || 'NaturaVita', url: storeUrl },
      categories: categoriesWithMeta,
      products,
      updatedAt: new Date().toISOString(),
    };

    cache = payload;
    cacheAt = Date.now();

    res.status(200).json(payload);
  } catch (err) {
    res.status(502).json({
      error: 'Falha ao buscar produtos da Nuvemshop.',
      detail: String(err?.message || err),
    });
  }
}
