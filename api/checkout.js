// Vercel Serverless Function — cria um rascunho de pedido (draft order) na
// Nuvemshop com o carrinho inteiro e devolve o link de checkout.
//
// Por que existe: a loja só aceita UM item por vez pelo formulário de compra,
// e a Cart API é somente leitura. O draft order é o único caminho que leva o
// carrinho completo para o checkout — e roda no servidor, então o token nunca
// chega ao navegador do cliente.
//
// Requer NUVEMSHOP_ACCESS_TOKEN com escopo write_draft_orders.

const FALLBACK_STORE_ID = '8240607';
const FALLBACK_USER_AGENT = 'NaturaVitaImport (naturavita.loja@gmail.com)';

const MAX_ITENS = 40;
const MAX_QTD = 99;

function accessToken() {
  const token = process.env.NUVEMSHOP_ACCESS_TOKEN;
  if (!token) {
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function limpar(v, max = 60) {
  return String(v ?? '').trim().slice(0, max);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Use POST.' });
    return;
  }

  const storeId = process.env.NUVEMSHOP_STORE_ID || FALLBACK_STORE_ID;

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    const email = limpar(body.email, 120).toLowerCase();
    const nome = limpar(body.nome);
    const sobrenome = limpar(body.sobrenome);
    const itens = Array.isArray(body.itens) ? body.itens : [];

    // Validação antes de gastar uma chamada à Nuvemshop — e para devolver ao
    // cliente uma mensagem em português, não o erro cru da API.
    if (!EMAIL_RE.test(email)) {
      res.status(400).json({ error: 'Informe um e-mail válido.' });
      return;
    }
    if (!nome) {
      res.status(400).json({ error: 'Informe o nome.' });
      return;
    }
    if (!sobrenome) {
      res.status(400).json({ error: 'Informe o sobrenome.' });
      return;
    }
    if (!itens.length) {
      res.status(400).json({ error: 'O carrinho está vazio.' });
      return;
    }
    if (itens.length > MAX_ITENS) {
      res.status(400).json({ error: `São no máximo ${MAX_ITENS} itens por pedido.` });
      return;
    }

    const products = [];
    for (const it of itens) {
      const variantId = Number(it?.variantId);
      const quantity = Math.floor(Number(it?.quantity) || 0);
      if (!Number.isInteger(variantId) || variantId <= 0) {
        res.status(400).json({ error: 'Item inválido no carrinho.' });
        return;
      }
      if (quantity < 1 || quantity > MAX_QTD) {
        res.status(400).json({ error: 'Quantidade inválida.' });
        return;
      }
      products.push({ variant_id: variantId, quantity });
    }

    const r = await fetch(`https://api.tiendanube.com/v1/${storeId}/draft_orders`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        contact_email: email,
        contact_name: nome,
        contact_lastname: sobrenome,
        products,
      }),
    });

    const texto = await r.text();

    if (!r.ok) {
      // O erro cru da Nuvemshop não serve para o cliente final: vai para o log
      // do servidor, e o cliente recebe uma frase que ele entende.
      console.error('draft_orders falhou', r.status, texto.slice(0, 500));
      const msg =
        r.status === 401 || r.status === 403
          ? 'A loja recusou a autorização. Avise o administrador.'
          : 'Não foi possível montar seu pedido agora. Tente novamente em instantes.';
      res.status(502).json({ error: msg });
      return;
    }

    const draft = JSON.parse(texto);

    if (!draft.checkout_url) {
      console.error('draft_orders sem checkout_url', texto.slice(0, 500));
      res.status(502).json({ error: 'A loja não devolveu o link de pagamento. Tente novamente.' });
      return;
    }

    res.status(200).json({ checkoutUrl: draft.checkout_url, draftOrderId: draft.id });
  } catch (err) {
    console.error('checkout falhou', err);
    res.status(500).json({ error: 'Erro ao montar o pedido. Tente novamente.' });
  }
}
