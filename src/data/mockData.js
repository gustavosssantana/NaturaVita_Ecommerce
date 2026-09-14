
export const categories = [
  { id: 1, name: 'Whey',       slug: 'whey',       count: 12 },
  { id: 2, name: 'Pré-treino', slug: 'pre-treino', count: 12 },
  { id: 3, name: 'Creatina',   slug: 'creatina',   count: 12 },
  { id: 4, name: 'BCAA',       slug: 'bcaa',       count: 12 },
  { id: 5, name: 'Granel',     slug: 'granel',     count: 12 },
  { id: 6, name: 'Vitaminas',  slug: 'vitaminas',  count: 12 },
];

export const products = [
  // ── Whey (12) ──────────────────────────────────────────────────
  { id: 1,  name: 'Whey Pure 900g',         flavor: 'chocolate', type: 'concentrado', doses: 30, price: 189, originalPrice: 239, rating: 4.9, reviews: 362, badge: '20% Off',  badgeType: 'discount', category: 'whey',       lactoseFree: false, variants: ['460g','900g','1kg'] },
  { id: 2,  name: 'Whey Hidro 900g',        flavor: 'baunilha',  type: 'hidrolisado', doses: 30, price: 249, originalPrice: 299, rating: 4.9, reviews: 201, badge: '15% Off',  badgeType: 'discount', category: 'whey',       lactoseFree: true,  variants: ['900g','1kg'] },
  { id: 3,  name: 'Whey Isolado 900g',      flavor: 'morango',   type: 'isolado',     doses: 30, price: 229, originalPrice: null,rating: 4.8, reviews: 143, badge: null,        badgeType: null,       category: 'whey',       lactoseFree: true,  variants: ['460g','900g'] },
  { id: 4,  name: 'Whey Concentrado 1kg',   flavor: 'baunilha',  type: 'concentrado', doses: 33, price: 169, originalPrice: null,rating: 4.6, reviews: 88,  badge: null,        badgeType: null,       category: 'whey',       lactoseFree: false, variants: ['900g','1kg'] },
  { id: 5,  name: 'Whey Zero Lactose 460g', flavor: 'cookies',   type: 'isolado',     doses: 15, price: 149, originalPrice: 179, rating: 4.7, reviews: 212, badge: '16% Off',  badgeType: 'discount', category: 'whey',       lactoseFree: true,  variants: ['460g'] },
  { id: 6,  name: 'Whey Blend 1kg',         flavor: 'chocolate', type: 'blend',       doses: 33, price: 199, originalPrice: null,rating: 4.8, reviews: 56,  badge: 'NOVO',     badgeType: 'new',      category: 'whey',       lactoseFree: false, variants: ['900g','1kg'] },
  { id: 7,  name: 'Whey Recovery 900g',     flavor: 'natural',   type: 'blend',       doses: 30, price: 219, originalPrice: null,rating: 4.9, reviews: 174, badge: null,        badgeType: null,       category: 'whey',       lactoseFree: false, variants: ['900g','1.5kg'] },
  { id: 8,  name: 'Whey Nativo 1kg',        flavor: 'morango',   type: 'concentrado', doses: 33, price: 269, originalPrice: 319, rating: 4.9, reviews: 310, badge: '15% Off',  badgeType: 'discount', category: 'whey',       lactoseFree: true,  variants: ['900g','1kg'] },
  { id: 9,  name: 'Whey Isolado 1kg',       flavor: 'chocolate', type: 'isolado',     doses: 33, price: 259, originalPrice: null,rating: 4.7, reviews: 95,  badge: null,        badgeType: null,       category: 'whey',       lactoseFree: true,  variants: ['900g','1kg'] },
  { id: 10, name: 'Whey Pro 460g',          flavor: 'morango',   type: 'concentrado', doses: 15, price: 119, originalPrice: null,rating: 4.5, reviews: 41,  badge: 'NOVO',     badgeType: 'new',      category: 'whey',       lactoseFree: false, variants: ['460g'] },
  { id: 11, name: 'Whey Slim 900g',         flavor: 'baunilha',  type: 'isolado',     doses: 30, price: 179, originalPrice: 209, rating: 4.8, reviews: 128, badge: '14% Off',  badgeType: 'discount', category: 'whey',       lactoseFree: true,  variants: ['900g'] },
  { id: 12, name: 'Whey Orgânico 900g',     flavor: 'natural',   type: 'concentrado', doses: 30, price: 289, originalPrice: null,rating: 4.9, reviews: 67,  badge: null,        badgeType: null,       category: 'whey',       lactoseFree: false, variants: ['900g'] },

  // ── Pré-treino (12) ────────────────────────────────────────────
  { id: 13, name: 'Pré BLAST 300g',         flavor: 'morango',   type: null, doses: 30, price: 129, originalPrice: null,rating: 4.7, reviews: 248, badge: 'NOVO',    badgeType: 'new',      category: 'pre-treino', lactoseFree: true,  variants: ['300g'] },
  { id: 14, name: 'Pré Ignition 300g',      flavor: 'limão',     type: null, doses: 30, price: 109, originalPrice: 139, rating: 4.6, reviews: 91,  badge: '21% Off', badgeType: 'discount', category: 'pre-treino', lactoseFree: true,  variants: ['300g'] },
  { id: 15, name: 'Pré Fury 300g',          flavor: 'melancia',  type: null, doses: 30, price: 139, originalPrice: null,rating: 4.8, reviews: 174, badge: 'NOVO',    badgeType: 'new',      category: 'pre-treino', lactoseFree: true,  variants: ['300g','450g'] },
  { id: 16, name: 'Pré Pump 400g',          flavor: 'uva',       type: null, doses: 40, price: 119, originalPrice: null,rating: 4.5, reviews: 63,  badge: null,       badgeType: null,       category: 'pre-treino', lactoseFree: true,  variants: ['400g'] },
  { id: 17, name: 'Pré Endurance 360g',     flavor: 'maracujá',  type: null, doses: 36, price: 99,  originalPrice: 119, rating: 4.7, reviews: 112, badge: '16% Off', badgeType: 'discount', category: 'pre-treino', lactoseFree: true,  variants: ['360g'] },
  { id: 18, name: 'Pré Flow 300g',          flavor: 'limão',     type: null, doses: 30, price: 89,  originalPrice: null,rating: 4.4, reviews: 48,  badge: null,       badgeType: null,       category: 'pre-treino', lactoseFree: true,  variants: ['300g'] },
  { id: 19, name: 'Pré Storm 300g',         flavor: 'melancia',  type: null, doses: 30, price: 149, originalPrice: null,rating: 4.8, reviews: 82,  badge: 'NOVO',    badgeType: 'new',      category: 'pre-treino', lactoseFree: true,  variants: ['300g'] },
  { id: 20, name: 'Pré Nitro 300g',         flavor: 'laranja',   type: null, doses: 30, price: 129, originalPrice: null,rating: 4.6, reviews: 55,  badge: null,       badgeType: null,       category: 'pre-treino', lactoseFree: true,  variants: ['300g'] },
  { id: 21, name: 'Pré X-Force 400g',       flavor: 'uva',       type: null, doses: 40, price: 159, originalPrice: 189, rating: 4.7, reviews: 99,  badge: '15% Off', badgeType: 'discount', category: 'pre-treino', lactoseFree: true,  variants: ['400g'] },
  { id: 22, name: 'Pré Boost 300g',         flavor: 'chocolate', type: null, doses: 30, price: 79,  originalPrice: null,rating: 4.3, reviews: 37,  badge: null,       badgeType: null,       category: 'pre-treino', lactoseFree: true,  variants: ['300g'] },
  { id: 23, name: 'Pré Caffeine 200g',      flavor: 'limão',     type: null, doses: 20, price: 69,  originalPrice: null,rating: 4.4, reviews: 29,  badge: null,       badgeType: null,       category: 'pre-treino', lactoseFree: true,  variants: ['200g'] },
  { id: 24, name: 'Pré Natural 300g',       flavor: 'natural',   type: null, doses: 30, price: 99,  originalPrice: null,rating: 4.6, reviews: 44,  badge: 'NOVO',    badgeType: 'new',      category: 'pre-treino', lactoseFree: true,  variants: ['300g'] },

  // ── Creatina (12) ──────────────────────────────────────────────
  { id: 25, name: 'Creatina 300g',          flavor: 'natural',   type: null, doses: 30,  price: 99,  originalPrice: null,rating: 4.8, reviews: 189, badge: null,       badgeType: null,       category: 'creatina',   lactoseFree: true,  variants: ['300g','500g'] },
  { id: 26, name: 'Creatina Mono 500g',     flavor: 'natural',   type: null, doses: 100, price: 139, originalPrice: null,rating: 4.9, reviews: 445, badge: null,       badgeType: null,       category: 'creatina',   lactoseFree: true,  variants: ['300g','500g'] },
  { id: 27, name: 'Creatina HCL 120caps',   flavor: 'caps',      type: null, doses: 120, price: 89,  originalPrice: null,rating: 4.7, reviews: 73,  badge: null,       badgeType: null,       category: 'creatina',   lactoseFree: true,  variants: ['120caps'] },
  { id: 28, name: 'Creatina Micronizada 300g',flavor:'natural',   type: null, doses: 60,  price: 109, originalPrice: null,rating: 4.8, reviews: 112, badge: null,       badgeType: null,       category: 'creatina',   lactoseFree: true,  variants: ['300g','500g'] },
  { id: 29, name: 'Creatina + Beta 400g',   flavor: 'natural',   type: null, doses: 40,  price: 129, originalPrice: null,rating: 4.7, reviews: 58,  badge: 'NOVO',    badgeType: 'new',      category: 'creatina',   lactoseFree: true,  variants: ['400g'] },
  { id: 30, name: 'Creatina Turbo 300g',    flavor: 'limão',     type: null, doses: 30,  price: 119, originalPrice: 149, rating: 4.6, reviews: 81,  badge: '20% Off', badgeType: 'discount', category: 'creatina',   lactoseFree: true,  variants: ['300g'] },
  { id: 31, name: 'Creatina Alcalina 300g', flavor: 'natural',   type: null, doses: 60,  price: 149, originalPrice: null,rating: 4.9, reviews: 94,  badge: null,       badgeType: null,       category: 'creatina',   lactoseFree: true,  variants: ['300g'] },
  { id: 32, name: 'Creatina Efervescente',  flavor: 'laranja',   type: null, doses: 30,  price: 79,  originalPrice: null,rating: 4.5, reviews: 47,  badge: null,       badgeType: null,       category: 'creatina',   lactoseFree: true,  variants: ['300g'] },
  { id: 33, name: 'Creatina Pure 500g',     flavor: 'natural',   type: null, doses: 100, price: 159, originalPrice: null,rating: 4.8, reviews: 136, badge: null,       badgeType: null,       category: 'creatina',   lactoseFree: true,  variants: ['500g'] },
  { id: 34, name: 'Creatina Vegana 300g',   flavor: 'natural',   type: null, doses: 60,  price: 99,  originalPrice: null,rating: 4.7, reviews: 39,  badge: 'NOVO',    badgeType: 'new',      category: 'creatina',   lactoseFree: true,  variants: ['300g'] },
  { id: 35, name: 'Creatina Premium 300g',  flavor: 'natural',   type: null, doses: 60,  price: 189, originalPrice: null,rating: 4.9, reviews: 201, badge: null,       badgeType: null,       category: 'creatina',   lactoseFree: true,  variants: ['300g','500g'] },
  { id: 36, name: 'Creatina Fast 300g',     flavor: 'natural',   type: null, doses: 60,  price: 79,  originalPrice: null,rating: 4.4, reviews: 28,  badge: null,       badgeType: null,       category: 'creatina',   lactoseFree: true,  variants: ['300g'] },

  // ── BCAA (12) ──────────────────────────────────────────────────
  { id: 37, name: 'BCAA 200g',              flavor: 'natural',   type: null, doses: 30, price: 79,  originalPrice: null,rating: 4.6, reviews: 156, badge: null,       badgeType: null,       category: 'bcaa',       lactoseFree: true,  variants: ['200g','400g'] },
  { id: 38, name: 'BCAA Pro 400g',          flavor: 'limão',     type: null, doses: 40, price: 89,  originalPrice: null,rating: 4.5, reviews: 77,  badge: null,       badgeType: null,       category: 'bcaa',       lactoseFree: true,  variants: ['200g','400g'] },
  { id: 39, name: 'BCAA 4:1:1 300g',        flavor: 'limão',     type: null, doses: 30, price: 69,  originalPrice: null,rating: 4.5, reviews: 63,  badge: null,       badgeType: null,       category: 'bcaa',       lactoseFree: true,  variants: ['300g','500g'] },
  { id: 40, name: 'BCAA Aminoácido 400g',   flavor: 'morango',   type: null, doses: 40, price: 89,  originalPrice: null,rating: 4.7, reviews: 88,  badge: null,       badgeType: null,       category: 'bcaa',       lactoseFree: true,  variants: ['400g'] },
  { id: 41, name: 'BCAA Recovery 400g',     flavor: 'melancia',  type: null, doses: 40, price: 95,  originalPrice: null,rating: 4.6, reviews: 52,  badge: 'NOVO',    badgeType: 'new',      category: 'bcaa',       lactoseFree: true,  variants: ['400g'] },
  { id: 42, name: 'BCAA Leucina+ 300g',     flavor: 'natural',   type: null, doses: 30, price: 79,  originalPrice: null,rating: 4.8, reviews: 115, badge: null,       badgeType: null,       category: 'bcaa',       lactoseFree: true,  variants: ['300g'] },
  { id: 43, name: 'BCAA Max 600g',          flavor: 'limão',     type: null, doses: 60, price: 119, originalPrice: 139, rating: 4.7, reviews: 98,  badge: '14% Off', badgeType: 'discount', category: 'bcaa',       lactoseFree: true,  variants: ['300g','600g'] },
  { id: 44, name: 'BCAA Vegano 300g',       flavor: 'morango',   type: null, doses: 30, price: 85,  originalPrice: null,rating: 4.6, reviews: 44,  badge: 'NOVO',    badgeType: 'new',      category: 'bcaa',       lactoseFree: true,  variants: ['300g'] },
  { id: 45, name: 'BCAA 10:1:1 400g',       flavor: 'natural',   type: null, doses: 40, price: 109, originalPrice: null,rating: 4.9, reviews: 167, badge: null,       badgeType: null,       category: 'bcaa',       lactoseFree: true,  variants: ['400g'] },
  { id: 46, name: 'BCAA Powder 500g',       flavor: 'baunilha',  type: null, doses: 50, price: 99,  originalPrice: null,rating: 4.5, reviews: 59,  badge: null,       badgeType: null,       category: 'bcaa',       lactoseFree: true,  variants: ['500g'] },
  { id: 47, name: 'BCAA Essential 300g',    flavor: 'limão',     type: null, doses: 30, price: 75,  originalPrice: null,rating: 4.4, reviews: 33,  badge: null,       badgeType: null,       category: 'bcaa',       lactoseFree: true,  variants: ['300g'] },
  { id: 48, name: 'BCAA Sport 400g',        flavor: 'laranja',   type: null, doses: 40, price: 89,  originalPrice: 109, rating: 4.6, reviews: 71,  badge: '18% Off', badgeType: 'discount', category: 'bcaa',       lactoseFree: true,  variants: ['400g'] },

  // ── Granel (12) ────────────────────────────────────────────────
  { id: 49, name: 'Glutamina 300g',         flavor: 'natural',   type: null, doses: 60,  price: 69,  originalPrice: null,rating: 4.7, reviews: 134, badge: null,       badgeType: null,       category: 'granel',     lactoseFree: true,  variants: ['300g','500g'] },
  { id: 50, name: 'Beta Alanina 300g',      flavor: 'natural',   type: null, doses: 60,  price: 59,  originalPrice: null,rating: 4.7, reviews: 88,  badge: null,       badgeType: null,       category: 'granel',     lactoseFree: true,  variants: ['300g'] },
  { id: 51, name: 'L-Carnitina 300g',       flavor: 'natural',   type: null, doses: 60,  price: 69,  originalPrice: null,rating: 4.8, reviews: 102, badge: null,       badgeType: null,       category: 'granel',     lactoseFree: true,  variants: ['300g','500g'] },
  { id: 52, name: 'Albumina 500g',          flavor: 'natural',   type: null, doses: 50,  price: 79,  originalPrice: null,rating: 4.6, reviews: 61,  badge: null,       badgeType: null,       category: 'granel',     lactoseFree: true,  variants: ['500g','1kg'] },
  { id: 53, name: 'Dextrose 1kg',           flavor: 'natural',   type: null, doses: 100, price: 39,  originalPrice: null,rating: 4.5, reviews: 47,  badge: null,       badgeType: null,       category: 'granel',     lactoseFree: true,  variants: ['1kg','2kg'] },
  { id: 54, name: 'Palatinose 500g',        flavor: 'natural',   type: null, doses: 50,  price: 59,  originalPrice: null,rating: 4.7, reviews: 38,  badge: 'NOVO',    badgeType: 'new',      category: 'granel',     lactoseFree: true,  variants: ['500g'] },
  { id: 55, name: 'L-Arginina 300g',        flavor: 'natural',   type: null, doses: 60,  price: 69,  originalPrice: null,rating: 4.6, reviews: 55,  badge: null,       badgeType: null,       category: 'granel',     lactoseFree: true,  variants: ['300g'] },
  { id: 56, name: 'Caseína 900g',           flavor: 'baunilha',  type: null, doses: 30,  price: 149, originalPrice: 179, rating: 4.8, reviews: 93,  badge: '16% Off', badgeType: 'discount', category: 'granel',     lactoseFree: false, variants: ['900g'] },
  { id: 57, name: 'Taurina 300g',           flavor: 'natural',   type: null, doses: 100, price: 49,  originalPrice: null,rating: 4.5, reviews: 42,  badge: 'NOVO',    badgeType: 'new',      category: 'granel',     lactoseFree: true,  variants: ['300g'] },
  { id: 58, name: 'Maltodextrina 1kg',      flavor: 'natural',   type: null, doses: 100, price: 35,  originalPrice: null,rating: 4.4, reviews: 29,  badge: null,       badgeType: null,       category: 'granel',     lactoseFree: true,  variants: ['1kg','2kg'] },
  { id: 59, name: 'L-Glutamina 500g',       flavor: 'natural',   type: null, doses: 100, price: 89,  originalPrice: null,rating: 4.8, reviews: 77,  badge: null,       badgeType: null,       category: 'granel',     lactoseFree: true,  variants: ['300g','500g'] },
  { id: 60, name: 'Colágeno Hidrolisado',   flavor: 'natural',   type: null, doses: 30,  price: 69,  originalPrice: null,rating: 4.7, reviews: 64,  badge: null,       badgeType: null,       category: 'granel',     lactoseFree: true,  variants: ['300g'] },

  // ── Vitaminas (12) ─────────────────────────────────────────────
  { id: 61, name: 'Vitamina D3 60caps',     flavor: 'caps',      type: null, doses: 60,  price: 49,  originalPrice: null,rating: 4.8, reviews: 98,  badge: 'NOVO',    badgeType: 'new',      category: 'vitaminas',  lactoseFree: true,  variants: ['60caps','120caps'] },
  { id: 62, name: 'Vitamina C 1000mg',      flavor: 'caps',      type: null, doses: 60,  price: 39,  originalPrice: null,rating: 4.8, reviews: 141, badge: null,       badgeType: null,       category: 'vitaminas',  lactoseFree: true,  variants: ['60caps','120caps'] },
  { id: 63, name: 'Magnésio 60caps',        flavor: 'caps',      type: null, doses: 60,  price: 49,  originalPrice: null,rating: 4.7, reviews: 87,  badge: null,       badgeType: null,       category: 'vitaminas',  lactoseFree: true,  variants: ['60caps'] },
  { id: 64, name: 'Multivitamínico 60caps', flavor: 'caps',      type: null, doses: 60,  price: 59,  originalPrice: null,rating: 4.9, reviews: 203, badge: 'NOVO',    badgeType: 'new',      category: 'vitaminas',  lactoseFree: true,  variants: ['60caps','120caps'] },
  { id: 65, name: 'Ômega 3 60caps',         flavor: 'caps',      type: null, doses: 60,  price: 45,  originalPrice: null,rating: 4.8, reviews: 176, badge: null,       badgeType: null,       category: 'vitaminas',  lactoseFree: true,  variants: ['60caps','120caps'] },
  { id: 66, name: 'Zinco + Magnésio',       flavor: 'caps',      type: null, doses: 60,  price: 55,  originalPrice: null,rating: 4.7, reviews: 68,  badge: null,       badgeType: null,       category: 'vitaminas',  lactoseFree: true,  variants: ['60caps'] },
  { id: 67, name: 'Vitamina B12 60caps',    flavor: 'caps',      type: null, doses: 60,  price: 35,  originalPrice: null,rating: 4.6, reviews: 54,  badge: 'NOVO',    badgeType: 'new',      category: 'vitaminas',  lactoseFree: true,  variants: ['60caps'] },
  { id: 68, name: 'Ferro + Vitamina C',     flavor: 'caps',      type: null, doses: 60,  price: 45,  originalPrice: null,rating: 4.8, reviews: 92,  badge: null,       badgeType: null,       category: 'vitaminas',  lactoseFree: true,  variants: ['60caps'] },
  { id: 69, name: 'Cálcio + Vitamina D',    flavor: 'caps',      type: null, doses: 60,  price: 55,  originalPrice: null,rating: 4.7, reviews: 79,  badge: null,       badgeType: null,       category: 'vitaminas',  lactoseFree: true,  variants: ['60caps','120caps'] },
  { id: 70, name: 'Probiótico 30caps',      flavor: 'caps',      type: null, doses: 30,  price: 79,  originalPrice: 99,  rating: 4.9, reviews: 115, badge: '20% Off', badgeType: 'discount', category: 'vitaminas',  lactoseFree: true,  variants: ['30caps','60caps'] },
  { id: 71, name: 'Vitamina E 60caps',      flavor: 'caps',      type: null, doses: 60,  price: 39,  originalPrice: null,rating: 4.6, reviews: 48,  badge: null,       badgeType: null,       category: 'vitaminas',  lactoseFree: true,  variants: ['60caps'] },
  { id: 72, name: 'Complexo B 60caps',      flavor: 'caps',      type: null, doses: 60,  price: 45,  originalPrice: null,rating: 4.7, reviews: 63,  badge: null,       badgeType: null,       category: 'vitaminas',  lactoseFree: true,  variants: ['60caps','120caps'] },
];

export const testimonials = [
  { id: 1, text: 'Melhor whey que já tomei. Dissolve fácil, sem gosto ruim e os resultados vieram rápido. Indico demais!', name: 'Cliente 1', verified: true, rating: 5 },
  { id: 2, text: 'A creatina é incrível. Percebi ganho de força nas primeiras semanas. Produto puro e de qualidade.', name: 'Cliente 2', verified: true, rating: 5 },
  { id: 3, text: 'Entrega rápida, embalagem cuidadosa e produto top. Já sou cliente há 2 anos e não troco por nada.', name: 'Cliente 3', verified: true, rating: 5 },
];

export const filterTabs = [
  { id: 'all',       label: 'Todos' },
  { id: 'whey',      label: 'Whey' },
  { id: 'pre-treino',label: 'Pré-treino' },
  { id: 'creatina',  label: 'Creatina' },
  { id: 'granel',    label: 'Granel' },
  { id: 'vitaminas', label: 'Vitaminas' },
];

export const footerLinks = {
  loja: [
    { label: 'Whey',       href: '/whey' },
    { label: 'Pré-treino', href: '/pre-treino' },
    { label: 'Creatina',   href: '/creatina' },
    { label: 'Granel',     href: '/granel' },
  ],
  marca: [
    { label: 'Sobre',      href: '/sobre' },
    { label: 'Manifesto',  href: '/manifesto' },
    { label: 'Lab',        href: '/lab' },
    { label: 'Atletas',    href: '/atletas' },
  ],
  ajuda: [
    { label: 'Frete',      href: '/frete' },
    { label: 'Trocas',     href: '/trocas' },
    { label: 'Contato',    href: '/contato' },
    { label: 'FAQ',        href: '/faq' },
  ],
};

export const highlightedProduct = products[0];

export const weeklyOffers = products.filter(
  (p) => p.originalPrice !== null || p.badge !== null
);

export const productFlavors = {
  whey:        ['Chocolate', 'Baunilha', 'Morango', 'Cookies', 'Sem sabor'],
  'pre-treino':['Limão', 'Melancia', 'Maracujá', 'Uva', 'Laranja'],
  creatina:    ['Natural'],
  bcaa:        ['Natural', 'Limão', 'Morango', 'Laranja'],
  granel:      ['Natural'],
  vitaminas:   ['Cápsula'],
};

export const productHighlights = {
  whey:        ['27g proteína / dose', '0g açúcar', 'Sem glúten', 'Lab BR · GMP'],
  'pre-treino':['200mg cafeína', 'Sem açúcar', 'Focus blend', 'Lab BR · GMP'],
  creatina:    ['5g por dose', 'Creapure® certificada', 'Sem aditivos', 'Lab BR · GMP'],
  bcaa:        ['6g BCAA por dose', 'Proporção 2:1:1', 'Sem açúcar', 'Lab BR · GMP'],
  granel:      ['100% puro', 'Sem aditivos', 'Embalagem hermética', 'Lab BR · GMP'],
  vitaminas:   ['Alta biodisponibilidade', 'Sem conservantes', 'Vegano', 'Lab BR · GMP'],
};

export const productDescription =
  'Produzido com proteína de soro de leite de alta qualidade, o Whey Pure passa por um rigoroso processo de microfiltração que preserva os aminoácidos essenciais e elimina gordura e lactose em excesso. Resultado: um whey limpo, eficiente e com sabor suave que dissolve facilmente. Ideal para recuperação muscular pós-treino e para quem busca aumento de massa magra com qualidade certificada.';

