// Vercel Serverless Function — banners da home.
//
// Onde as imagens ficam guardadas: não existe banco de dados neste projeto,
// e criar um só para cinco fotos seria mais infraestrutura para o lojista
// manter. Então os banners moram na própria Nuvemshop, como as imagens de um
// produto escondido chamado __BANNERS__ (nunca publicado, nunca vendido).
//
// Vantagem prática: o upload usa a mesma rota de imagem que o painel já usa,
// as fotos ficam no CDN da Nuvemshop e nada disso depende de outro serviço.
//
// O link de cada banner fica na descrição desse produto, como JSON:
//   { "<id da imagem>": { "link": "/vitaminas" } }

const FALLBACK_STORE_ID = '8240607';
const FALLBACK_USER_AGENT = 'NaturaVita (naturavita.loja@gmail.com)';

export const NOME_PORTADOR = '__BANNERS__';

function base() {
  const storeId = process.env.NUVEMSHOP_STORE_ID || FALLBACK_STORE_ID;
  return `https://api.tiendanube.com/v1/${storeId}`;
}

function headers() {
  const token = process.env.NUVEMSHOP_ACCESS_TOKEN;
  if (!token) throw new Error('NUVEMSHOP_ACCESS_TOKEN não está configurado.');
  return {
    Authentication: `bearer ${token}`,
    'User-Agent': process.env.NUVEMSHOP_USER_AGENT || FALLBACK_USER_AGENT,
    'Content-Type': 'application/json',
  };
}

function txt(campo, padrao = '') {
  if (!campo) return padrao;
  if (typeof campo === 'string') return campo;
  return campo.pt || campo.es || campo.en || padrao;
}

/** Acha o produto portador dos banners, ou null se ainda não existe. */
export async function acharPortador() {
  // A busca por texto resolve em uma requisição. Se ela falhar (a API às
  // vezes ignora `q` com sublinhado), varremos as páginas como reserva.
  try {
    const r = await fetch(`${base()}/products?q=BANNERS&per_page=50`, { headers: headers() });
    if (r.ok) {
      const achados = await r.json();
      const p = achados.find((x) => txt(x.name).trim() === NOME_PORTADOR);
      if (p) return p;
    }
  } catch {
    // cai na varredura
  }

  for (let pagina = 1; pagina <= 20; pagina++) {
    const r = await fetch(`${base()}/products?per_page=200&page=${pagina}`, { headers: headers() });
    if (!r.ok) break;
    const lote = await r.json();
    if (!lote.length) break;
    const p = lote.find((x) => txt(x.name).trim() === NOME_PORTADOR);
    if (p) return p;
    if (lote.length < 200) break;
  }
  return null;
}

/** Lê o mapa de links guardado na descrição do portador. */
export function lerMeta(produto) {
  try {
    const bruto = txt(produto?.description, '').trim();
    if (!bruto.startsWith('{')) return {};
    const obj = JSON.parse(bruto);
    return obj && typeof obj === 'object' ? obj : {};
  } catch {
    return {};
  }
}

/** Converte o produto portador na lista que a home consome. */
export function montarBanners(produto) {
  if (!produto) return [];
  const meta = lerMeta(produto);
  return (produto.images || [])
    .slice()
    .sort((a, b) => (a.position || 0) - (b.position || 0))
    .map((img) => {
      const extra = meta[String(img.id)] || {};
      return {
        id: img.id,
        src: img.src,
        link: typeof extra.link === 'string' && extra.link ? extra.link : null,
        alt: typeof extra.alt === 'string' ? extra.alt : '',
      };
    })
    .filter((b) => b.src);
}

let cache = null;
let cacheEm = 0;
const CACHE_MS = 60 * 1000;

export default async function handler(req, res) {
  // Cache curto: o lojista sobe um banner e quer ver na loja em seguida.
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  try {
    if (cache && Date.now() - cacheEm < CACHE_MS) {
      res.status(200).json(cache);
      return;
    }

    const portador = await acharPortador();
    const payload = { banners: montarBanners(portador) };

    cache = payload;
    cacheEm = Date.now();
    res.status(200).json(payload);
  } catch (err) {
    // Banner é enfeite: se falhar, a home mostra a capa padrão e segue.
    res.status(200).json({ banners: [], erro: String(err?.message || err) });
  }
}
