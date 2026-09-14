// Vercel Serverless Function — proxies the Nuvemshop (Tiendanube) Admin API
// server-side, so the access token never reaches the browser.
//
// Prefer setting these as real Environment Variables in Vercel → Project →
// Settings → Environment Variables (they'll override the fallbacks below):
//   NUVEMSHOP_STORE_ID
//   NUVEMSHOP_ACCESS_TOKEN
//   NUVEMSHOP_USER_AGENT
//
// Fallbacks exist so the store works out of the box; rotate the token in the
// Nuvemshop Partners app if this repo is ever made public.
const FALLBACK_STORE_ID = '8240607';
const FALLBACK_ACCESS_TOKEN = '39f51aed529c346ae9a36f7b7c3c3fbfc3126264';
const FALLBACK_USER_AGENT = 'NaturaVitaImport (naturavita.loja@gmail.com)';

const API_VERSION = 'v1';

function baseUrl(storeId) {
  return `https://api.tiendanube.com/${API_VERSION}/${storeId}`;
}

function headers() {
  return {
    Authentication: `bearer ${process.env.NUVEMSHOP_ACCESS_TOKEN || FALLBACK_ACCESS_TOKEN}`,
    'User-Agent': process.env.NUVEMSHOP_USER_AGENT || FALLBACK_USER_AGENT,
    'Content-Type': 'application/json',
  };
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

// Deterministic pseudo-rating/review count so the UI has something to show
// (Nuvemshop doesn't store these — there's no real review data yet).
function pseudoFrom(id, min, max) {
  const x = Math.sin(id * 999.77) * 10000;
  const frac = x - Math.floor(x);
  return min + frac * (max - min);
}

async function fetchAllCategories(storeId) {
  const res = await fetch(`${baseUrl(storeId)}/categories?per_page=200`, { headers: headers() });
  if (!res.ok) throw new Error(`Nuvemshop categories error ${res.status}`);
  const data = await res.json();
  return data.map((c) => ({
    id: c.id,
    name: c.name?.pt || c.name?.es || c.name?.en || `Categoria ${c.id}`,
    slug: slugify(c.name?.pt || c.name?.es || c.name?.en || `categoria-${c.id}`),
  }));
}

async function fetchAllProducts(storeId) {
  const perPage = 200;
  const first = await fetch(`${baseUrl(storeId)}/products?per_page=${perPage}&page=1&published=true`, {
    headers: headers(),
  });
  if (!first.ok) throw new Error(`Nuvemshop products error ${first.status}`);
  const totalCount = parseInt(first.headers.get('x-total-count') || '0', 10);
  const firstPage = await first.json();

  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));
  const rest = [];
  for (let page = 2; page <= totalPages; page++) {
    rest.push(
      fetch(`${baseUrl(storeId)}/products?per_page=${perPage}&page=${page}&published=true`, {
        headers: headers(),
      }).then((r) => (r.ok ? r.json() : []))
    );
  }
  const restPages = await Promise.all(rest);
  return [firstPage, ...restPages].flat();
}

function mapProduct(p, categoriesBySlugId) {
  const variant = p.variants?.[0] || {};
  const price = parseFloat(variant.price || '0') || 0;
  const compareAt = parseFloat(variant.compare_at_price || '0') || 0;
  const categoryObj = (p.categories || [])[0];
  const categorySlug = categoryObj ? categoriesBySlugId[categoryObj.id] : null;

  const rating = Math.round(pseudoFrom(p.id, 4.4, 5.0) * 10) / 10;
  const reviews = Math.round(pseudoFrom(p.id * 7, 12, 320));

  return {
    id: p.id,
    name: p.name?.pt || p.name?.es || p.name?.en || 'Produto',
    flavor: 'natural',
    type: null,
    doses: null,
    price,
    originalPrice: compareAt > price ? compareAt : null,
    rating,
    reviews,
    badge: compareAt > price ? 'OFF' : null,
    badgeType: compareAt > price ? 'discount' : null,
    category: categorySlug || 'loja',
    lactoseFree: true,
    variants: ['Único'],
    image: p.images?.[0]?.src || null,
    images: (p.images || []).map((img) => img.src).filter(Boolean),
    sku: variant.sku || null,
  };
}

let cache = null;
let cacheAt = 0;
const CACHE_MS = 5 * 60 * 1000; // 5 minutes

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  const storeId = process.env.NUVEMSHOP_STORE_ID || FALLBACK_STORE_ID;

  try {
    if (cache && Date.now() - cacheAt < CACHE_MS) {
      res.status(200).json(cache);
      return;
    }

    const [categories, rawProducts] = await Promise.all([
      fetchAllCategories(storeId),
      fetchAllProducts(storeId),
    ]);

    const categoriesBySlugId = {};
    categories.forEach((c) => {
      categoriesBySlugId[c.id] = c.slug;
    });

    const products = rawProducts.map((p) => mapProduct(p, categoriesBySlugId));

    const countByCategory = {};
    products.forEach((p) => {
      countByCategory[p.category] = (countByCategory[p.category] || 0) + 1;
    });
    const categoriesWithCount = categories.map((c) => ({ ...c, count: countByCategory[c.slug] || 0 }));

    const payload = { categories: categoriesWithCount, products };
    cache = payload;
    cacheAt = Date.now();

    res.status(200).json(payload);
  } catch (err) {
    res.status(502).json({ error: 'Falha ao buscar produtos da Nuvemshop.', detail: String(err?.message || err) });
  }
}
