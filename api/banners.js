// Vercel Serverless Function — banners da home.
//
// Onde as imagens ficam guardadas: não existe banco de dados neste projeto,
// e criar um só para dez fotos seria mais infraestrutura para o lojista
// manter. Então os banners moram na própria Nuvemshop, como as imagens de um
// produto escondido chamado __BANNERS__ (nunca publicado, nunca vendido).
//
// Cada banner é um PAR de artes: uma deitada (8:3, para o computador) e uma
// quadrada (1:1, para o celular). Sem o par, a arte deitada teria as laterais
// cortadas no telefone e o texto sumiria junto.
//
// A ligação entre as duas artes fica na descrição do produto, em JSON:
//   {
//     "grupos":  { "g1": { "link": "/vitaminas", "ordem": 1 } },
//     "imagens": { "12345": { "grupo": "g1", "variante": "desktop" },
//                  "12346": { "grupo": "g1", "variante": "celular" } }
//   }

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

/**
 * Lê o JSON da descrição do portador, já normalizado.
 *
 * Tolera o formato antigo (um banner por imagem, sem par) para o caso de
 * alguém ter subido algo antes desta mudança: cada imagem solta vira um
 * grupo próprio, com a arte no lugar da versão de computador.
 */
export function lerMeta(produto) {
  let bruto = {};
  try {
    const s = txt(produto?.description, '').trim();
    if (s.startsWith('{')) bruto = JSON.parse(s) || {};
  } catch {
    return { grupos: {}, imagens: {} };
  }

  if (bruto.grupos && bruto.imagens) {
    return { grupos: bruto.grupos || {}, imagens: bruto.imagens || {} };
  }

  const grupos = {};
  const imagens = {};
  Object.entries(bruto).forEach(([idImagem, dados], i) => {
    if (!dados || typeof dados !== 'object') return;
    const g = `g${idImagem}`;
    grupos[g] = { link: typeof dados.link === 'string' ? dados.link : '', ordem: i + 1 };
    imagens[idImagem] = { grupo: g, variante: 'desktop' };
  });
  return { grupos, imagens };
}

/** Converte o produto portador na lista que a home consome. */
export function montarBanners(produto) {
  if (!produto) return [];
  const { grupos, imagens } = lerMeta(produto);

  const urlPorId = {};
  (produto.images || []).forEach((img) => {
    if (img.src) urlPorId[String(img.id)] = img.src;
  });

  const porGrupo = {};
  Object.entries(imagens).forEach(([idImagem, dados]) => {
    const url = urlPorId[idImagem];
    if (!url || !dados?.grupo) return;
    const g = (porGrupo[dados.grupo] ||= { id: dados.grupo, desktop: null, celular: null });
    if (dados.variante === 'celular') g.celular = url;
    else g.desktop = url;
  });

  return Object.values(porGrupo)
    .map((g) => ({
      ...g,
      link: typeof grupos[g.id]?.link === 'string' ? grupos[g.id].link : '',
      ordem: Number(grupos[g.id]?.ordem) || 0,
    }))
    // Um grupo sem nenhuma das duas artes não tem o que mostrar.
    .filter((g) => g.desktop || g.celular)
    .sort((a, b) => a.ordem - b.ordem);
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
