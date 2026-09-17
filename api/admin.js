// Vercel Serverless Function — painel de administração da loja.
//
// Tudo que escreve na loja passa por aqui, nunca pelo navegador: o token fica
// no servidor, e cada operação confere a senha antes de tocar na Nuvemshop.
//
// Variáveis de ambiente necessárias (Vercel → Settings → Environment Variables):
//   NUVEMSHOP_ACCESS_TOKEN   token com write_products
//   ADMIN_SENHA              a senha do painel
//   NUVEMSHOP_STORE_ID       opcional
//   NUVEMSHOP_USER_AGENT     opcional

import crypto from 'node:crypto';

const FALLBACK_STORE_ID = '8240607';
const FALLBACK_USER_AGENT = 'NaturaVitaImport (naturavita.loja@gmail.com)';

const MAX_IMG_BYTES = 9 * 1024 * 1024; // a Nuvemshop aceita até 10MB; folga de 1MB
const FORMATOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function env(nome) {
  const v = process.env[nome];
  if (!v) throw new Error(`${nome} não está configurada nas variáveis de ambiente.`);
  return v;
}

function headers() {
  return {
    Authentication: `bearer ${env('NUVEMSHOP_ACCESS_TOKEN')}`,
    'User-Agent': process.env.NUVEMSHOP_USER_AGENT || FALLBACK_USER_AGENT,
    'Content-Type': 'application/json',
  };
}

const API = () =>
  `https://api.tiendanube.com/v1/${process.env.NUVEMSHOP_STORE_ID || FALLBACK_STORE_ID}`;

// Comparação em tempo constante: uma comparação comum vaza, pelo tempo de
// resposta, quantos caracteres do início da senha estão certos.
function senhaConfere(recebida) {
  const certa = env('ADMIN_SENHA');
  const a = Buffer.from(String(recebida || ''));
  const b = Buffer.from(certa);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

const txt = (campo) =>
  !campo ? '' : typeof campo === 'string' ? campo : campo.pt || campo.es || campo.en || '';

function limpar(v, max) {
  return String(v ?? '').trim().slice(0, max);
}

function mapear(p) {
  const v = (p.variants || [])[0] || {};
  return {
    id: p.id,
    variantId: v.id || null,
    nome: txt(p.name),
    descricao: txt(p.description).replace(/<[^>]*>/g, '').trim(),
    preco: parseFloat(v.promotional_price || v.price || '0') || 0,
    precoOriginal: parseFloat(v.price || '0') || 0,
    estoque: v.stock === null || v.stock === undefined ? null : Number(v.stock),
    sku: v.sku || null,
    publicado: p.published !== false,
    imagem: (p.images || [])[0]?.src || null,
    imagens: (p.images || []).map((i) => ({ id: i.id, src: i.src })),
    categorias: (p.categories || []).map((c) => c.id),
  };
}

// A API devolve produto despublicado mesmo com ?published=true — já nos
// enganou duas vezes. Então buscamos tudo e filtramos aqui, com um cache
// curto para o painel não refazer 6 requisições a cada clique.
let cacheProdutos = null;
let cacheEm = 0;
const CACHE_MS = 60 * 1000;

async function todosOsProdutos({ forcar = false } = {}) {
  if (!forcar && cacheProdutos && Date.now() - cacheEm < CACHE_MS) return cacheProdutos;
  const tudo = [];
  for (let pagina = 1; pagina <= 20; pagina++) {
    const lote = await nuvem(`/products?per_page=200&page=${pagina}`);
    if (!lote || !lote.length) break;
    tudo.push(...lote);
    if (lote.length < 200) break;
  }
  cacheProdutos = tudo;
  cacheEm = Date.now();
  return tudo;
}

function invalidarCache() {
  cacheProdutos = null;
}

async function nuvem(caminho, opcoes = {}) {
  const r = await fetch(`${API()}${caminho}`, { ...opcoes, headers: headers() });
  const corpo = await r.text();
  if (!r.ok) {
    console.error('Nuvemshop', caminho, r.status, corpo.slice(0, 400));
    const erro = new Error(corpo.slice(0, 200));
    erro.status = r.status;
    throw erro;
  }
  return corpo ? JSON.parse(corpo) : null;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ erro: 'Use POST.' });
    return;
  }

  let corpo;
  try {
    corpo = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  } catch {
    res.status(400).json({ erro: 'Requisição inválida.' });
    return;
  }

  const { acao, senha } = corpo;

  // A senha é conferida em TODA operação, não só no login: o painel roda no
  // navegador e qualquer um pode chamar esta função direto.
  try {
    if (!senhaConfere(senha)) {
      res.status(401).json({ erro: 'Senha incorreta.' });
      return;
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Painel não configurado. Falta ADMIN_SENHA.' });
    return;
  }

  try {
    switch (acao) {
      case 'entrar':
        return res.status(200).json({ ok: true });

      case 'categorias': {
        const cats = await nuvem('/categories?per_page=200');
        return res.status(200).json({
          categorias: cats.map((c) => ({ id: c.id, nome: txt(c.name) })),
        });
      }

      case 'listar': {
        const busca = limpar(corpo.busca, 60).toLowerCase();
        const filtro = ['todos', 'loja', 'ocultos'].includes(corpo.filtro) ? corpo.filtro : 'todos';
        const pagina = Math.max(1, Number(corpo.pagina) || 1);
        const porPagina = 30;

        let lista = (await todosOsProdutos()).map(mapear);

        const totais = {
          todos: lista.length,
          loja: lista.filter((p) => p.publicado).length,
          ocultos: lista.filter((p) => !p.publicado).length,
          ocultosComEstoque: lista.filter((p) => !p.publicado && (p.estoque ?? 0) > 0).length,
        };

        if (filtro === 'loja') lista = lista.filter((p) => p.publicado);
        if (filtro === 'ocultos') lista = lista.filter((p) => !p.publicado);

        if (busca) {
          lista = lista.filter(
            (p) =>
              p.nome.toLowerCase().includes(busca) ||
              (p.sku || '').toLowerCase().includes(busca)
          );
        }

        // Nos ocultos, quem tem estoque vem primeiro: é o produto que o lojista
        // tem na prateleira e não está vendendo. É por onde ele deve começar.
        if (filtro === 'ocultos') {
          lista.sort((a, b) => (b.estoque ?? 0) - (a.estoque ?? 0));
        }

        const total = lista.length;
        const inicio = (pagina - 1) * porPagina;
        return res.status(200).json({
          produtos: lista.slice(inicio, inicio + porPagina),
          pagina,
          total,
          temMais: inicio + porPagina < total,
          totais,
        });
      }

      case 'publicacao': {
        const id = Number(corpo.id);
        if (!id) return res.status(400).json({ erro: 'Produto não informado.' });
        await nuvem(`/products/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ published: !!corpo.publicado }),
        });
        invalidarCache();
        return res.status(200).json({ ok: true, publicado: !!corpo.publicado });
      }

      case 'produto': {
        const p = await nuvem(`/products/${Number(corpo.id)}`);
        return res.status(200).json({ produto: mapear(p) });
      }

      case 'salvar': {
        const id = Number(corpo.id);
        if (!id) return res.status(400).json({ erro: 'Produto não informado.' });

        const campos = {};
        if (corpo.nome !== undefined) {
          const nome = limpar(corpo.nome, 140);
          if (!nome) return res.status(400).json({ erro: 'O nome não pode ficar vazio.' });
          campos.name = { pt: nome };
        }
        if (corpo.descricao !== undefined) campos.description = { pt: limpar(corpo.descricao, 4000) };
        if (corpo.publicado !== undefined) campos.published = !!corpo.publicado;
        if (Array.isArray(corpo.categorias)) campos.categories = corpo.categorias.map(Number);

        if (Object.keys(campos).length) {
          await nuvem(`/products/${id}`, { method: 'PUT', body: JSON.stringify(campos) });
        }

        // Preço e estoque ficam na variante, não no produto.
        const variantId = Number(corpo.variantId);
        if (variantId && (corpo.preco !== undefined || corpo.estoque !== undefined)) {
          const v = {};
          if (corpo.preco !== undefined) {
            const preco = Number(corpo.preco);
            if (!(preco > 0)) return res.status(400).json({ erro: 'Preço inválido.' });
            v.price = preco.toFixed(2);
          }
          if (corpo.estoque !== undefined && corpo.estoque !== null && corpo.estoque !== '') {
            v.stock = Math.max(0, Math.floor(Number(corpo.estoque) || 0));
          }
          await nuvem(`/products/${id}/variants/${variantId}`, {
            method: 'PUT',
            body: JSON.stringify(v),
          });
        }

        if (corpo.foto) {
          await subirFoto(id, corpo.foto, corpo.fotoNome, corpo.removerFotosAntigas);
        }

        invalidarCache();
        const atualizado = await nuvem(`/products/${id}`);
        return res.status(200).json({ produto: mapear(atualizado) });
      }

      case 'criar': {
        const nome = limpar(corpo.nome, 140);
        const preco = Number(corpo.preco);
        if (!nome) return res.status(400).json({ erro: 'Informe o nome do produto.' });
        if (!(preco > 0)) return res.status(400).json({ erro: 'Informe um preço válido.' });

        const novo = {
          name: { pt: nome },
          description: { pt: limpar(corpo.descricao, 4000) },
          published: corpo.publicado !== false,
          variants: [
            {
              price: preco.toFixed(2),
              stock:
                corpo.estoque === undefined || corpo.estoque === ''
                  ? null
                  : Math.max(0, Math.floor(Number(corpo.estoque) || 0)),
              sku: limpar(corpo.sku, 40) || null,
            },
          ],
        };
        if (Array.isArray(corpo.categorias) && corpo.categorias.length) {
          novo.categories = corpo.categorias.map(Number);
        }

        const criado = await nuvem('/products', { method: 'POST', body: JSON.stringify(novo) });

        if (corpo.foto) {
          try {
            await subirFoto(criado.id, corpo.foto, corpo.fotoNome, false);
          } catch (e) {
            // O produto já existe; avisar é melhor que fingir que falhou tudo.
            console.error('foto do produto novo falhou', e);
            const semFoto = await nuvem(`/products/${criado.id}`);
            return res.status(200).json({
              produto: mapear(semFoto),
              aviso: 'Produto criado, mas a foto não subiu. Edite o produto e tente de novo.',
            });
          }
        }

        invalidarCache();
        const completo = await nuvem(`/products/${criado.id}`);
        return res.status(200).json({ produto: mapear(completo) });
      }

      default:
        return res.status(400).json({ erro: 'Ação desconhecida.' });
    }
  } catch (e) {
    console.error('admin falhou', acao, e);
    if (e.status === 401 || e.status === 403) {
      return res.status(502).json({ erro: 'A loja recusou a autorização. Avise o administrador.' });
    }
    return res.status(500).json({ erro: 'Não foi possível concluir. Tente novamente.' });
  }
}

// ── foto ────────────────────────────────────────────────────────────────────
// A foto chega em base64 do celular. A antiga só sai DEPOIS que a nova é
// aceita: se o envio falhar, o produto continua com a imagem que tinha.
async function subirFoto(produtoId, dataUrl, nomeArquivo, removerAntigas) {
  const m = /^data:([^;]+);base64,(.+)$/s.exec(String(dataUrl));
  if (!m) throw new Error('Formato de imagem não reconhecido.');
  const [, mime, base64] = m;

  if (!FORMATOS.includes(mime.toLowerCase())) {
    const err = new Error('Use uma imagem JPG, PNG ou WEBP.');
    err.status = 400;
    throw err;
  }
  if (Buffer.from(base64, 'base64').length > MAX_IMG_BYTES) {
    const err = new Error('A imagem é grande demais (máximo 9 MB).');
    err.status = 400;
    throw err;
  }

  const ext = mime.split('/')[1].replace('jpeg', 'jpg');
  const antigas = removerAntigas
    ? ((await nuvem(`/products/${produtoId}`)).images || []).map((i) => i.id)
    : [];

  await nuvem(`/products/${produtoId}/images`, {
    method: 'POST',
    body: JSON.stringify({
      attachment: base64,
      filename: (limpar(nomeArquivo, 60) || `foto-${Date.now()}`).replace(/[^\w.-]/g, '') + `.${ext}`,
    }),
  });

  for (const idImg of antigas) {
    try {
      await nuvem(`/products/${produtoId}/images/${idImg}`, { method: 'DELETE' });
    } catch (e) {
      console.error('não removeu foto antiga', idImg, e);
    }
  }
}
